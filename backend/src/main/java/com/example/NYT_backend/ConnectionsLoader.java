package com.example.NYT_backend;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.example.NYT_backend.Entity.NounEntity;
import com.example.NYT_backend.Entity.TopicEntity;
import com.example.NYT_backend.Entity.Word;
import com.example.NYT_backend.Service.Service;

/*
 * This class loads the topics and words used for Connections. It also contains the validation logic used to verify
 * packages sent from the frontend for validity and correctness.
 */
@Component
public class ConnectionsLoader {

    protected final Service service;
    protected String[] currentTopics = new String[4];
    protected Word[] connectionsWords = new Word[16]; // Correct Order //Eric's edit, removed final so I can reset Connections word to ensure no bugs
    protected String[] currentWords = new String[16]; // Randomized Order
    private List<NounEntity> allNouns = Collections.emptyList();
    private final Map<Integer, List<TopicEntity>> topicsByDifficulty = new HashMap<>();
    public ConnectionsLoader(Service service) { this.service = service; }


    // This method queries the database to get all the topics and nouns in the Connections database. It then separates
    // the topics into difficulty for finding the daily nouns.
    private void initializeConnections() {
        // Query the database for the topics and words for Connections
        allNouns = service.getAllNouns();
        List<TopicEntity> topicEntities = service.getAllTopics();
        // This sorts the topic entities by the difficulty fields into a HashMap in which the keys are the difficulty,
        // and the values are an arraylist of all the topics within the corresponding difficulty
        for (TopicEntity topic : topicEntities) {
            int difficulty = topic.getDiff();
            // If the difficulty does not already exist as a key, create a new HashMap entry
            if (!topicsByDifficulty.containsKey(difficulty)) {
                topicsByDifficulty.put(difficulty, new ArrayList<>());
            }
            topicsByDifficulty.get(difficulty).add(topic);
        }
    }

    // This method randomly selects the daily nouns, checking that a topic is not reused if it has been used a
    // previous day.
    private void dailyNouns() {
        connectionsWords = new Word[16];
        currentWords = new String[16];

        // Makes sure that the connections game has actually started
        if (connectionsWords[0] == null) {
            initializeConnections();
        }

        // Create a new random object instance to randomly select the topic for each of the four difficulties and the
        // four different words within each category
        Random random = new Random();
        // The array will be sorted in ascending difficulty:
        // The first four indices will be the lowest difficulty, the next four the second difficulty, etc. As such,
        // we need the word index to assign the words to the indices in the array that will hold the words.
        int wordIndex = 0;
        // Iterate through the four difficulties
        for (int difficulty = 1; difficulty <= 4; difficulty++) {
            // Retrieve the list for the current difficulty and choose using the created random object
            List<TopicEntity> topics = topicsByDifficulty.get(difficulty);
            TopicEntity selectedTopic = topics.get(random.nextInt(topics.size()));
            while(service.isTopicUsedToday(selectedTopic.getTopic())){
                selectedTopic = topics.get(random.nextInt(topics.size()));
            }
            service.markTopicAsUsed(selectedTopic.getTopic());
            String topic = selectedTopic.getTopic().replace("\"", "").trim();
            currentTopics[difficulty-1] = topic;
            logger.error(topic);
            // Using the allNouns list from above, sort the nouns by topic in a similar method to how the topics
            // were sorted by difficulty
            List<NounEntity> nouns = new ArrayList<>();
            for (NounEntity noun : allNouns) {
                String nounString = noun.getTopic().replace("\"", "").trim();
                if (nounString.equals(topic)) {
                    nouns.add(noun);
                }

            }
            // Shuffle the list of nouns to ensure randomness
            Collections.shuffle(nouns, random);

            // Add the first 4 nouns from the shuffled list to connectionsWords. More convenient than using random
            // because it's not guaranteed to get four different words if using the random object in the inner for loop
            for (int i = 0; i < 4; i++) {
                NounEntity selectedNoun = nouns.get(i);
                Word currWord = new Word(selectedNoun.getNoun().replace("\"", "").trim());
                currWord.setTopic(selectedTopic.getTopic().replace("\"", "").trim());
                currWord.setDifficulty(difficulty);
                connectionsWords[wordIndex++] = currWord;
            }

            /** 
            // Initialize currentWords with the original order of the words
            for (int i = 0; i < 4; i++) {
                currentWords[wordIndexRand] = connectionsWords[wordIndexRand++].getWord().
                        replace("\"", "").trim();
            }
            */
        }
        for(int i = 0; i < connectionsWords.length; i ++){
            currentWords[i] = connectionsWords[i].getWord().
                        replace("\"", "").trim();
        }
        logger.error("dailyNouns called");
    }

    private static final Logger logger = LoggerFactory.getLogger(ConnectionsLoader.class);

    // This method is called when the frontend calls to re-randomize the grid or on initialization when the frontend
    // first calls for the words in the grid.
    public String[] randomizeWords() {
        /*
        // Makes sure that the connections game has actually started and it is the same day
        if (connectionsWords[0] == null || !connectionsWords[0].getDate().equals(LocalDate.now(ZoneOffset.UTC).
                format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))){
            dailyNouns();
        }

        if (!connectionsWords[0].getDate().equals(LocalDate.now(ZoneOffset.UTC).
                format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))){
            dailyNouns();
        }
        */
        dailyNouns();

        // Convert currentWords to a list, shuffle it, and update the array
        List<String> wordsList = new ArrayList<>(Arrays.asList(currentWords));
        //Collections.shuffle(wordsList, new Random());
        currentWords = wordsList.toArray(new String[0]);

        logger.error("randomizedWords called");
        return currentWords;
    }

    public String validateGuess(List<String> words) {
        logger.error("validate guess called");
        // Makes sure that the connections game has actually started and it is the same day
        if (connectionsWords[0] == null || !connectionsWords[0].getDate().equals(LocalDate.now(ZoneOffset.UTC).
                format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))){
            dailyNouns();
        } 

        // Counts the number of words in each topic from the guess. For example, whether there are three words of the
        // same topic.
        Map<String, Integer> topicCount = getStringIntegerMap(words);

        // Validation of the guess
        for (Map.Entry<String, Integer> entry : topicCount.entrySet()) {
            int count = entry.getValue();
            if (count == 4) {
                int difficulty = 0;
                for (Word word : connectionsWords) {
                    if (word.getTopic().equals(entry.getKey())) {
                        difficulty = word.getDifficulty();
                        break;
                    }
                }
                // All four words belong to the same topic, which means other topics must have 0
                return "CORRECT: " + entry.getKey() + ":" + difficulty; // Include the category in the response
            } else if (count == 3) {
                // Three words match one topic, which means the guess is ONE AWAY
                return "ONE AWAY";
            }
        }
        // If no topic has 3 or 4 matches, the guess is incorrect
        return "INCORRECT";
    }

    private Map<String, Integer> getStringIntegerMap(List<String> words) {
        // Takes the correct words array and put into hashmap for ease of access when counting the topic duplicates.
        Map<String, String> wordToTopicMap = new HashMap<>();
        for (Word word : connectionsWords) {
            wordToTopicMap.put(word.getWord(), word.getTopic());
        }

        // Create a map to count occurrences of each topic in the guess. There should only be four entries into the
        // hashmap as a guess can only be four words long.
        Map<String, Integer> topicCount = new HashMap<>();
        for (String guessedWord : words) {
            String topic = wordToTopicMap.get(guessedWord);
            topicCount.put(topic, topicCount.getOrDefault(topic, 0) + 1);
        }
        return topicCount;
    }


}
