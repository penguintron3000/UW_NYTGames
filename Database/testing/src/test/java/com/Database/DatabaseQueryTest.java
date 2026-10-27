package com.Database;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;

public class DatabaseQueryTest {
    private DatabaseQuery dbQuery = new DatabaseQuery(); // reusable instance to perform queries
    String databaseName = "NYT";

    // tests if the wordlist table has been loaded at all
    @Test
    public void testWordlistNotEmpty() {
        String query = "SELECT COUNT(*) FROM wordlist;";

        List<String> results = dbQuery.executeQuery(databaseName, query);

        assertFalse(results.isEmpty(), "wordlist contains no data");
    }

    // tests if the wordlist table has been loaded properly
    // Right now, this performs a simple verification of the expected number of rows. Changing 
    // the verification method to a more sustainable one may be needed if the data to be loaded 
    // were to change
    @Test
    public void testWordlistLoadedProperly() {
        String query = "SELECT COUNT(*) FROM wordlist;";
        // expected number of entries in the DB
        Integer expectedOutput = 2315;
        Integer actualOutput = 0;

        List<String> results = dbQuery.executeQuery(databaseName, query);

        if (!results.isEmpty()) {
            actualOutput = Integer.valueOf((results).get(0));
        }

        assertEquals(expectedOutput, actualOutput, "wordlist does not contain the correct " + 
                                                        "number of rows. It has not been loaded as expected");
    }

    // tests if the wordlist table exists
    @Test
    public void testWordlistExists() {
        String query = "SHOW TABLES;";
        String expectedTable = "wordlist";
        boolean tableFound = false;

        // fetches result list
        List<String> results = dbQuery.executeQuery(databaseName, query);

        for (String string : results) {
            if (string == expectedTable) {
                tableFound = true;
                break;
            }
        }

        assertTrue(tableFound, "wordlist does not exist.");
    
    }
    
}
