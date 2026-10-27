package com.example.NYT_backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.description;
import static org.mockito.Mockito.when;

import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import com.example.NYT_backend.Entity.NounEntity;
import com.example.NYT_backend.Entity.TopicEntity;
import com.example.NYT_backend.Entity.Word;
import com.example.NYT_backend.Service.Service;

public class ConnectionsLoaderTest {
    private ConnectionsLoader connectionsLoader;
    private Service service;
    private Backend backend;
    private List<NounEntity> mockNouns;
    private List<TopicEntity> mockTopics;

    @BeforeEach
    public void setUp() {
        service = Mockito.mock(Service.class);
        connectionsLoader = new ConnectionsLoader(service);
        backend = new Backend(null, connectionsLoader);

        mockNouns = Arrays.asList(
            createNounEntity("blue", "colors"),
            createNounEntity("red", "colors"),
            createNounEntity("yellow", "colors"),
            createNounEntity("green", "colors"),
            createNounEntity("monopoly", "board games"),
            createNounEntity("yhatzee", "board games"),
            createNounEntity("sudoku", "board games"),
            createNounEntity("crossword", "board games"),
            createNounEntity("kiwi", "green fruits"),
            createNounEntity("green apple", "green fruits"),
            createNounEntity("lime", "green fruits"),
            createNounEntity("avocado", "green fruits"),
            createNounEntity("spear", "wordle starting words"),
            createNounEntity("crane", "wordle starting words"),
            createNounEntity("adieu", "wordle starting words"),
            createNounEntity("trace", "wordle starting words")
        );
    
        mockTopics = Arrays.asList(
            createMockTopicEntity("colors", 1),
            createMockTopicEntity("board games", 2),
            createMockTopicEntity("green fruits", 3),
            createMockTopicEntity("wordle starting words", 4)
        );

    }

    /*
     * This method tests that the when given four arraylists, a randomized arraylist is returned from the randomizeMap method,
     * This method does have a problem that theoretically, there is a chance that the sorted 2d array returned is the same with
     * the unshuffled arraylist, this is an issue that is being worked on.
     */
    @Test
    void testRandomizeWordsReturnsShuffledList() {
    
    when(service.getAllNouns()).thenReturn(mockNouns);
    when(service.getAllTopics()).thenReturn(mockTopics);
    when(service.isTopicUsedToday(anyString())).thenReturn(false);
    String[] expected = new String[] {
        "blue", "red", "yellow", "green",
        "monopoly", "yhatzee", "sudoku", "crossword",
        "kiwi", "green apple", "lime", "avocado",
        "spear", "crane", "adieu", "trace"
    };
    connectionsLoader.currentWords = expected.clone();

    String[] randomized = connectionsLoader.randomizeWords();

    assertNotEquals(Arrays.toString(expected), Arrays.toString(randomized), "Words should be randomized.");
    assertTrue(
        Arrays.asList(randomized).containsAll(Arrays.asList(expected)),
        "Randomized words should contain the same elements as expected."
    );

    }

    /*
     * This method tests that, when four words are guessed that are not in the same category, the JSON response body that is
     * sent to the frontend will read incorrect. This method does not use shuffle, as the checking is nonconsequential for
     * the actual map
     */
    @Test
    void testValidateGuessIncorrect() {

        when(service.getAllNouns()).thenReturn(mockNouns);
        when(service.getAllTopics()).thenReturn(mockTopics);
        when(service.isTopicUsedToday(anyString())).thenReturn(false);

        connectionsLoader.randomizeWords(); 
        List<String> guess = Arrays.asList("blue", "monopoly", "kiwi", "spear");
        String response = connectionsLoader.validateGuess(guess);
        System.out.println(response);
        assertEquals("INCORRECT", response, "The guess should be marked as incorrect.");
    }

    /*
     * This method test that when three are correct. The frontend JSON response body shows: one away with no other information. This
     * is how we would expect for the connections game to work.
     */
    @Test
    void testValidateGuessOneAway() {
        when(service.getAllNouns()).thenReturn(mockNouns);
        when(service.getAllTopics()).thenReturn(mockTopics);
        when(service.isTopicUsedToday(anyString())).thenReturn(false);
        connectionsLoader.randomizeWords(); 
        List<String> guess = Arrays.asList("blue", "red", "yellow", "spear");
        String response = connectionsLoader.validateGuess(guess);

        assertEquals("ONE AWAY", response, "The guess should be marked as one away.");
    }

    /*
     * This method uses JUNit tests to make a correct guess of four words. The expected JSON response should contain
     * the category that those four words belong to, along with an integer to show the difficulty ranking.
     */
    @Test
    void testValidateGuessCorrect() {
        when(service.getAllNouns()).thenReturn(mockNouns);
        when(service.getAllTopics()).thenReturn(mockTopics);
        when(service.isTopicUsedToday(anyString())).thenReturn(false);
        connectionsLoader.randomizeWords(); 
        List<String> guess = Arrays.asList("blue", "red", "yellow", "green");
        String response = connectionsLoader.validateGuess(guess);
        System.out.println(response);
        assertTrue(response.contains("CORRECT: colors:1"),
            "The guess should be marked as correct with the topic 'colors'.");
    }

    /*
     * This method tests that the randomize word fucntion returns the expected JSON response
     * when it is called from the backend, instead of directly from the connections loader
     */

    @Test
    void testRandomizeWordsThroughBackend() {
        when(service.getAllNouns()).thenReturn(mockNouns);
        when(service.getAllTopics()).thenReturn(mockTopics);
        when(service.isTopicUsedToday(anyString())).thenReturn(false);
        String[] expected = new String[] {
            "blue", "red", "yellow", "green",
            "monopoly", "yhatzee", "sudoku", "crossword",
            "kiwi", "green apple", "lime", "avocado",
            "spear", "crane", "adieu", "trace"
        };
        ResponseEntity<Map<String, Object>> response = backend.randomizeGrid();
        Object strArray = response.getBody().get("Randomized Words");
        String [] randomizedWords = (String []) strArray;
        
        assertNotEquals(randomizedWords.toString(), expected.toString());
        assertTrue(
        Arrays.asList(randomizedWords).containsAll(Arrays.asList(expected)),
        "Randomized words should contain the same elements as expected."
    );
    }

    /*
     * This method tests that the correct JSON response is returned to the front end when 
     * an incorrect guess is put through
     */
    @Test
    void testIncorrectGuessThroughBackend() {

        when(service.getAllNouns()).thenReturn(mockNouns);
        when(service.getAllTopics()).thenReturn(mockTopics);
        when(service.isTopicUsedToday(anyString())).thenReturn(false);

        List<String> guess = Arrays.asList("blue", "monopoly", "kiwi", "spear");
        ResponseEntity<Map<String, Object>> response = backend.validateConnectionsGuess(guess);
        assertTrue(response.getBody().get("Status").equals("INCORRECT"));
    }

    /*
     * This method tests that the correct JSON response is returned to the front end when
     * a one away guess it put through 
     */
    @Test
    void testOneAwayGuessThroughBackend() {

        when(service.getAllNouns()).thenReturn(mockNouns);
        when(service.getAllTopics()).thenReturn(mockTopics);
        when(service.isTopicUsedToday(anyString())).thenReturn(false);

        List<String> guess = Arrays.asList("blue", "red", "yellow", "spear");
        ResponseEntity<Map<String, Object>> response = backend.validateConnectionsGuess(guess);
        assertTrue(response.getBody().get("Status").equals("ONE AWAY"));
    }

    /*
     * This tests that the correct JSON repsonse, correct, topic name, and difficulty is
     * passed when a correct guess is made 
     */
    @Test
    void testCorrectGuessThroughBackend() {

        when(service.getAllNouns()).thenReturn(mockNouns);
        when(service.getAllTopics()).thenReturn(mockTopics);
        when(service.isTopicUsedToday(anyString())).thenReturn(false);

        List<String> guess = Arrays.asList("blue", "red", "yellow", "green");
        ResponseEntity<Map<String, Object>> response = backend.validateConnectionsGuess(guess);
        assertTrue(response.getBody().get("Status").equals("CORRECT"));
        assertTrue(response.getBody().get("Category").equals("colors"));
        assertTrue(response.getBody().get("Level").equals("1"));
    }

    /*
     * This method tests that the connections backend is able to correctly 
     * choose, sort, and maintain each level when there are multiple levels
     * present in the topics list. 
     */
    @Test
    void testIsAbleToSortMultipleCategories() {


        List<NounEntity> mockNounsNew = Arrays.asList(
            createNounEntity("blue", "colors"),
            createNounEntity("red", "colors"),
            createNounEntity("yellow", "colors"),
            createNounEntity("green", "colors"),
            createNounEntity("monopoly", "board games"),
            createNounEntity("yhatzee", "board games"),
            createNounEntity("sudoku", "board games"),
            createNounEntity("crossword", "board games"),
            createNounEntity("kiwi", "green fruits"),
            createNounEntity("green apple", "green fruits"),
            createNounEntity("lime", "green fruits"),
            createNounEntity("avocado", "green fruits"),
            createNounEntity("spear", "wordle starting words"),
            createNounEntity("crane", "wordle starting words"),
            createNounEntity("adieu", "wordle starting words"),
            createNounEntity("trace", "wordle starting words"),
            createNounEntity("rocket", "space exploration"),
            createNounEntity("astronaut", "space exploration"),
            createNounEntity("satellite", "space exploration"),
            createNounEntity("mars rover", "space exploration"),
            createNounEntity("guitar", "musical instruments"),
            createNounEntity("violin", "musical instruments"),
            createNounEntity("drum", "musical instruments"),
            createNounEntity("saxophone", "musical instruments"),
            createNounEntity("eiffel tower", "famous landmarks"),
            createNounEntity("great wall", "famous landmarks"),
            createNounEntity("taj mahal", "famous landmarks"),
            createNounEntity("statue of liberty", "famous landmarks"),
            createNounEntity("dolphin", "ocean creatures"),
            createNounEntity("jellyfish", "ocean creatures"),
            createNounEntity("octopus", "ocean creatures"),
            createNounEntity("shark", "ocean creatures")
        );
    
        List<TopicEntity> mockTopicsNew = Arrays.asList(
            createMockTopicEntity("colors", 1),
            createMockTopicEntity("board games", 2),
            createMockTopicEntity("green fruits", 3),
            createMockTopicEntity("wordle starting words", 4),
            createMockTopicEntity("space exploration", 1),
            createMockTopicEntity("musical instruments", 2),
            createMockTopicEntity("famous landmarks", 3),
            createMockTopicEntity("ocean creatures", 4)
        );

        when(service.getAllNouns()).thenReturn(mockNounsNew);
        when(service.getAllTopics()).thenReturn(mockTopicsNew);
        when(service.isTopicUsedToday(anyString())).thenReturn(false);
        
        String[] randomized = connectionsLoader.randomizeWords();
        String randomizedList = Arrays.toString(randomized);

        Boolean containsColors = randomizedList.contains("blue");
        Boolean containsSpace = randomizedList.contains("astronaut");
        assertTrue(containsColors != containsSpace);

    }

/*
 * This is a helper method for NounEntity creation
 */
private NounEntity createNounEntity(String noun, String topic) {
    NounEntity nounEntity = new NounEntity();
    nounEntity.setWord(noun);
    nounEntity.setTopic(topic);
    return nounEntity;
}


/*
 * This is a helper method for TopicEntity Creation 
*/
private TopicEntity createMockTopicEntity(String topic, int difficulty) {
    TopicEntity topicEntity = new TopicEntity(); 
    topicEntity.setTopic(topic);
    topicEntity.setDiff(difficulty);
    return topicEntity;

}

}
