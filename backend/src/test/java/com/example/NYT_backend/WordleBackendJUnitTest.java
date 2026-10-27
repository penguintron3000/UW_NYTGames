package com.example.NYT_backend;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import com.example.NYT_backend.Entity.WordEntity;
import com.example.NYT_backend.Service.Service;
/*
 * This class tests both private and public methods of the Worlde Backend using JUNit.
 */
class WordleBackendJUnitTest {

    private Backend backend;
    private WordleLoader wordleLoader;
    private Service service;

    @BeforeEach
    public void setUp() {
        service = Mockito.mock(Service.class);
        wordleLoader = new WordleLoader(service);
        backend = new Backend(wordleLoader, null);
    }

	/*
	 * This test sets the word of the day and reveals it.
	 */
    @Test
    void testRevealReturnsExpected() {
        WordEntity testWord = createWordEntity("PEARS", true, false);

        Mockito.when(service.getAllWords()).thenReturn(List.of(testWord));
        Mockito.when(service.isWordUsedToday("PEARS")).thenReturn(false);

        wordleLoader.ensureWordIsLoaded();
        assertTrue(backend.reveal().toString().contains("PEARS"));
    }

	/*
	 * This test guesses a word that is not in the words_list. It will then
	 * return a BAD_REQUEST flag field
	 */
    @Test
    void testGuessInvalidWordShowsBadRequest() {
        WordEntity validWord = createWordEntity("FINAL", true, false);

        Mockito.when(service.getAllWords()).thenReturn(List.of(validWord));
        Mockito.when(service.isWordUsedToday("FINAL")).thenReturn(false);

        wordleLoader.ensureWordIsLoaded();

        ResponseEntity<Map<String, Object>> response = backend.validateWordleGuess("aaaaa");
        assertEquals("400 BAD_REQUEST", response.getStatusCode().toString());
    }

    /*
	* This tests that the loadPage() method correctly populates the frequency map for guessing.
	*/
    @Test
    void testLoadWordPopulatesFrequencyMapAndSetsWord() {
        WordEntity testWord = createWordEntity("APPLE", true, false);

        Mockito.when(service.getAllWords()).thenReturn(List.of(testWord));
        Mockito.when(service.isWordUsedToday("APPLE")).thenReturn(false);

        wordleLoader.ensureWordIsLoaded();

        assertNotNull(wordleLoader.getCurrentWord());
        assertFalse(wordleLoader.frequencyMap.isEmpty());
    }

	/*
	 * This tests checks that letter checking in the backend is correct. It checks
	 * that with the correct word, the backend correctly labels all as green in the JSON response
	 *
	 */
    @Test
    void testGuessWithCorrectWordLeadsToCorrectEntityOutputs() {
        WordEntity testWord = createWordEntity("SPEAR", true, false);

        Mockito.when(service.getAllWords()).thenReturn(List.of(testWord));
        Mockito.when(service.isWordUsedToday("SPEAR")).thenReturn(false);

        wordleLoader.ensureWordIsLoaded();
        String word = wordleLoader.getCurrentWord().getWord();

        ResponseEntity<Map<String, Object>> response = backend.validateWordleGuess(word);
        assertEquals("[Green, Green, Green, Green, Green]", response.getBody().get("Guess Result").toString());
    }

    /*
	 * This test is used for the guess method, it presets the word and populates a frequency map
	 * PEARL is used because 4/5 letters are in the preset word, it is used to make sure that
	 * Yellow and Incorrect colorings are able to be returned. This method uses reflection to
	 * access private classes in WorldeBackend
	 */
    @Test
    void testGuessInWordListButNotAnswerLeadsToCorrectColoringOutputs() {
        WordEntity answerWord = createWordEntity("SPEAR", true, false);
        WordEntity guessWord = createWordEntity("PEARL", true, true);

        Mockito.when(service.getAllWords()).thenReturn(List.of(answerWord, guessWord));
        Mockito.when(service.isWordUsedToday("SPEAR")).thenReturn(false);
        Mockito.when(service.isWordUsedToday("PEARL")).thenReturn(true);

        wordleLoader.ensureWordIsLoaded();
        ResponseEntity<Map<String, Object>> response = backend.validateWordleGuess("PEARL");

        assertEquals("[Yellow, Yellow, Yellow, Yellow, Grey]", response.getBody().get("Guess Result").toString());
    }

    /*
	 * This tests makes sure that those that are colored green are not overwritten by yellow. This case would be
	 * if there was a word that contains two instances of a letter, with the guess having one in the correct place and another in
	 * an incorrect place, where the correct placement is not overwritten.
	 * For example: SPEED and AGREE
	 */
    @Test
    void testDoubleOccuranceOfLetterOnlyColorsOne() {
        WordEntity testWord = createWordEntity("SPEAR", true, false);

        Mockito.when(service.getAllWords()).thenReturn(List.of(testWord));
        Mockito.when(service.isWordUsedToday("SPEAR")).thenReturn(false);
        wordleLoader.wordsList.add("EEEEE");
        wordleLoader.ensureWordIsLoaded();
        ResponseEntity<Map<String, Object>> response = backend.validateWordleGuess("EEEEE");

        assertEquals("[Grey, Grey, Green, Grey, Grey]", response.getBody().get("Guess Result").toString());
    }

    /*
     * This is a mock class that minics the entity class to access the database, since the db is not being accessed
     * for these tests, it is put here. 
     */
    private WordEntity createWordEntity(String word, boolean valid, boolean usedToday) {
        WordEntity entity = new WordEntity();
        entity.setWord(word);
        entity.setValid(valid);
        entity.setUsedToday(usedToday);
        return entity;
    }

}