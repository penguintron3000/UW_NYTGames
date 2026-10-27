package com.example.NYT_backend;

import com.example.NYT_backend.Entity.Word;
import com.example.NYT_backend.Entity.WordEntity;
import com.example.NYT_backend.Service.Service;

import java.util.*;

import org.springframework.stereotype.Component;

/*
 * This class loads the words used for Wordle. It also contains the validation logic used to verify
 * packages sent from the frontend for validity and correctness.
 */
@Component
public class WordleLoader {
    protected final Service service;
    protected final List<String> wordsList = new ArrayList<>();
    protected final List<String> answerList = new ArrayList<>();
    protected final Map<Character, Integer> frequencyMap = new HashMap<>();
    protected Word currentWord;

    public WordleLoader(Service service) {
        this.service = service;
    }

    /*
     * A method to ensure that a word is loaded for today, is used for checking
     * before guesses that a word is valid, and that a word is valid before revealing
     */
    public synchronized void ensureWordIsLoaded() {
        if (currentWord == null) {
            initializeLists();
            loadNewWord();
        }
    }

    /*
     * This method initializes the arraylists that serve as the answer and word bank
     * it uses the wordleService initialized in the constructor to access the DB.
     */
    private void initializeLists() {
        if (wordsList.isEmpty() || answerList.isEmpty()) {
            //call to the service class method to access the database
            List<WordEntity> wordEntities = service.getAllWords();
            for (WordEntity entity : wordEntities) {
                //add every word to word list, even if they also belong in answer list for word validation checking
                wordsList.add(entity.getWord());
                if (entity.isValid() && !entity.isUsedToday()) {
                    answerList.add(entity.getWord());
                }
            }
        }
    }

    /*
     * This method loads and sets the new word for today, it updates the word and the
     * date when it is called. It also populates the frequncy map which is used for guess coloring.
     */
    public void loadNewWord() {
        Random rand = new Random();
        String randomWord = answerList.get(rand.nextInt(answerList.size())).toUpperCase();
        while (service.isWordUsedToday(randomWord)) {
            randomWord = answerList.get(rand.nextInt(answerList.size())).toUpperCase();
        }
        service.markWordAsUsed(randomWord);

        if (currentWord == null) {
            currentWord = new Word(randomWord);
        } else {
            currentWord.setWord(randomWord);
            currentWord.changeDate();
        }

        frequencyMap.clear();
        for (char c : randomWord.toCharArray()) {
            frequencyMap.put(c, frequencyMap.getOrDefault(c, 0) + 1);
        }
    }

    /*
     * This gets the word of the day.
     * Output: Word, returns the Word object that belong to the word today
     */
    public Word getCurrentWord() {
        if (currentWord == null) {
            System.out.println("Word loading in now");
        } else {
            System.out.println("Word already loaded");
        }
        ensureWordIsLoaded();
        return currentWord;
    }

    /*
     * This method checks a guess from the user against the answer word, it then
     * colors a string array to show which letters they have in the incorrect spot,
     * correct spot, or words that are contained in the letter
     */
    public String[] validateWord(String guess) {
        ensureWordIsLoaded();
        // Create a copy of the frequency_map using the HashMap constructor.
        Map<Character, Integer> copyMap = new HashMap<>(frequencyMap);

        // Check if the word is valid
        boolean isValid = wordsList.contains(guess);
        if (!isValid) {
            return new String[]{"Invalid Guess"};
        }

        //Initialize to all grey for cleaner code
        String[] result = {"Grey", "Grey", "Grey", "Grey", "Grey"};

        //iterate through the 'Green' letters first (correct spot), this is to prevent frequency map depopulating some letters incorrectly
        for (int i = 0; i < guess.length(); i++) {
            // if letter is in the right spot
            if (guess.charAt(i) == currentWord.getWord().charAt(i)) {
                result[i] = "Green";
                copyMap.put(guess.charAt(i), copyMap.get(guess.charAt(i)) - 1);
            }
        }
            for (int i = 0; i < guess.length(); i++) {
            // if letter is not in the right spot but in the word
            if (copyMap.getOrDefault(guess.charAt(i), 0) > 0 && !result[i].equals("Green")) {
                result[i] = "Yellow";
                copyMap.put(guess.charAt(i), copyMap.get(guess.charAt(i)) - 1);
            }
            // if letter is not in the word at all
        }
        return result;
    }
}
