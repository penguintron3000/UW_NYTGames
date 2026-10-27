package com.Database;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.ArrayList;
import java.util.List;

public class ConnectionsDBQueryTest {
    private DatabaseQuery dbQuery = new DatabaseQuery(); // reusable instance to perform queries
    String databaseName = "NYT";

    // tests if the cnouns table has been loaded at all
    @Test
    public void testCnounsNotEmpty() {
        String query = "SELECT COUNT(*) FROM cnouns;";

        List<String> results = dbQuery.executeQuery(databaseName, query);

        assertFalse(results.isEmpty(), "cnouns contains no data");
    }

    // tests if the cnouns table has been loaded properly
    // Right now, this performs a simple verification of the expected number of rows. Changing 
    // the verification method to a more sustainable one may be needed if the data to be loaded 
    // were to change
    @Test
    public void testCnounsLoadedProperly() {
        String query = "SELECT COUNT(*) FROM cnouns;";
        // expected number of entries in the DB
        Integer expectedOutput = 396;
        Integer actualOutput = 0;

        List<String> results = dbQuery.executeQuery(databaseName, query);

        if (!results.isEmpty()) {
            actualOutput = Integer.valueOf((results).get(0));
        }

        assertEquals(expectedOutput, actualOutput, "cnouns does not contain the correct " + 
                                                        "number of rows. It has not been loaded as expected");
    }

   // tests if the cnouns table has been loaded at all
   @Test
   public void testCtopicNotEmpty() {
       String query = "SELECT COUNT(*) FROM ctopic;";

       List<String> results = dbQuery.executeQuery(databaseName, query);

       assertFalse(results.isEmpty(), "ctopic contains no data");
   }

   // tests if the cnouns table has been loaded properly
   // Right now, this performs a simple verification of the expected number of rows. Changing 
   // the verification method to a more sustainable one may be needed if the data to be loaded 
   // were to change
   @Test
   public void testCtopicLoadedProperly() {
       String query = "SELECT COUNT(*) FROM ctopic;";
       // expected number of entries in the DB
       Integer expectedOutput = 100; // TODO find this value. "100" is placeholder
       Integer actualOutput = 0;

       List<String> results = dbQuery.executeQuery(databaseName, query);

       if (!results.isEmpty()) {
           actualOutput = Integer.valueOf((results).get(0));
       }

       assertEquals(expectedOutput, actualOutput, "ctopic does not contain the correct " + 
                                                       "number of rows. It has not been loaded as expected");
   }

    // tests if the cnouns table exists
    @Test
    public void testCnounsExists() {
        String query = "SHOW TABLES;";
        String expectedTable = "cnouns";
        boolean tableFound = false;

        // fetches result list
        List<String> results = dbQuery.executeQuery(databaseName, query);

        for (String string : results) {
            if (string == expectedTable) {
                tableFound = true;
                break;
            }
        }

        assertTrue(tableFound, "cnouns does not exist.");
    }

    // tests if the ctopic table exists
    @Test
    public void testCtopicExists() {
        String query = "SHOW TABLES;";
        String expectedTable = "ctopic";
        boolean tableFound = false;

        // fetches result list
        List<String> results = dbQuery.executeQuery(databaseName, query);

        for (String string : results) {
            if (string == expectedTable) {
                tableFound = true;
                break;
            }
        }

        assertTrue(tableFound, "ctopic does not exist.");
    }
}
