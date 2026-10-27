package com.example.NYT_backend;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.NYT_backend.Entity.Word;

@RestController
@CrossOrigin (origins = {"http://localhost:5000", "http://frontend:5000"})
@EnableJpaRepositories(basePackages = "com.example.NYT_backend.Repository")
@EntityScan(basePackages = "com.example.NYT_backend.Entity")
@SpringBootApplication
public class Backend {

	private final WordleLoader wordleLoader;
	private final ConnectionsLoader connectionsLoader;

	public Backend(WordleLoader wordleLoader, ConnectionsLoader connectionsLoader) {
		this.wordleLoader = wordleLoader;
        this.connectionsLoader = connectionsLoader;
    }

	@GetMapping("wordle/guess/{str}")
	public ResponseEntity<Map<String, Object>> validateWordleGuess(@PathVariable String str) {
		Word word = wordleLoader.getCurrentWord();
		if (!word.getDate().equals(LocalDate.now(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))){
			wordleLoader.loadNewWord();
		}

		String[] result = wordleLoader.validateWord(str.toUpperCase());
		Map<String, Object> response = new HashMap<>();
		if (result[0].equals("Invalid Guess")) {
			response.put("Word Valid", false);
			response.put("Guess Result", result[0]);
			return ResponseEntity.badRequest().body(response);  // 400 Bad Request
		}

		response.put("Word Valid", true);
		response.put("Guess Result", List.of(result));
		return ResponseEntity.ok(response);
	}

	@GetMapping("wordle/reveal")
	public ResponseEntity<Map<String, String>> reveal() {
		Word word = wordleLoader.getCurrentWord();
		Map<String, String> response = new HashMap<>();
		response.put("word", word.getWord());
		response.put("date", word.getDate());
		return ResponseEntity.ok(response);
	}

	private static final Logger logger = LoggerFactory.getLogger(ConnectionsLoader.class);

	/**
	 * This method randomizes the grid so that the frontend may have the shuffle functionality on click. Handles the
	 * logic on the backend to minimize frontend resource usage.
	 *
	 * @return Returns a 200 network code along with a response that contains the newly randomized array/list of words.
	 */
	@GetMapping("connections/randomize")
	public ResponseEntity<Map<String, Object>> randomizeGrid() {
		logger.error("api called");
		// Randomizes the string array through connections loader
		String[] words = connectionsLoader.randomizeWords();
		Map<String, Object> response = new HashMap<>();
		response.put("Randomized Words", words);
		return ResponseEntity.ok(response);
	}

	/**
	 * This method validates a guess sent from the frontend in relations to the Connections game. The frontend will send
	 * a package which contains four words. That list will then be validated in the connections loader class and will
	 * return one of three responses.
	 *
	 * @param words A list of four words sent from the frontend which contains the users guess of order.
	 * @return Returns a 200 network code along with a response that contains a string for Status and the status, which
	 * 		   may be CORRECT, ONE AWAY, or INCORRECT.
	 */
	@PostMapping("connections/guess")
	public ResponseEntity<Map<String, Object>> validateConnectionsGuess(@RequestBody List<String> words) {
		// Validate the guess using the ConnectionsLoader
		String result = connectionsLoader.validateGuess(words);
		Map<String, Object> response = new HashMap<>();
		// Structure the response based on the result
		switch (result.split(":")[0]) {
			case "CORRECT":
				response.put("Status", "CORRECT");
				response.put("Category", result.split(":")[1].trim());
				response.put("Level", result.split(":")[2].trim());
				break;
			case "ONE AWAY":
				response.put("Status", "ONE AWAY");
				break;
			case "INCORRECT":
			default:
				response.put("Status", "INCORRECT");
				break;
		}
		return ResponseEntity.ok(response);
	}

	public static void main(String[] args) {
		SpringApplication.run(Backend.class, args);
	}

}
