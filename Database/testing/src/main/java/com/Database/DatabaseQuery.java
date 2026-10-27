package com.Database;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DatabaseQuery {
    private String url = "jdbc:mysql://localhost:3306/NYT"; 
    private String username = "root";
    private String password = "bab_pass";

    public List<String> executeQuery(String databaseName, String query) {
        List<String> results = new ArrayList<>();
        try (Connection dbCxn = DriverManager.getConnection(url, username, password);
            Statement select = dbCxn.createStatement()) {
            
            select.execute("USE " + databaseName);

            try (ResultSet rs = select.executeQuery(query)) { 

                while (rs.next()) {
                    results.add(rs.getString(1)); // Assumes query of no more than 1 column
                }
            }
        } catch (Exception e) {
            System.out.println("Error executing query: " + e.getMessage());
        }
        return results;
    }
}
