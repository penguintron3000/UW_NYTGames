package com.example.NYT_backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/*
 * This class is used to access the database table that holds words.
 */
@Entity
@Table(name = "wordlist")
public class WordEntity {
    /**
     * The word stored in this entity. 
     */
    @Id
    @Column(name = "word", length = 5, nullable = false)
    private String word;

    @Column(name = "valid")
    private boolean valid; 

    @Column(name = "usedToday")
    private boolean usedToday;

    /*
     * Default constructor 
     */
    public WordEntity() {
    }

    /**
     * Retrieves the word associated with this entry.
     * 
     * @return the word
     */
    public String getWord() {
        return word;
    }

    /**
     * Sets the word for this entry.
     * 
     * @param word the word to set
     */
    public void setWord(String word) {
        this.word = word;
    }

    /**
     * Checks if the word is valid.
     * 
     * @return true if the word is valid false otherwise
     */
    public boolean isValid() {
        return valid;
    }

    /**
     * Sets the validity of the word.
     * 
     * @param valid true to mark the word as valid false otherwise
     */
    public void setValid(boolean valid) {
        this.valid = valid;
    }

    /**
     * Checks if the word has been used today.
     * 
     * @return true if the word has been used today false otherwise
     */
    public boolean isUsedToday() {
        return usedToday;
    }

    /**
     * Sets the usage status of the word for today.
     * 
     * @param usedToday true to mark the word as used today false otherwise
     */
    public void setUsedToday(boolean usedToday) {
        this.usedToday = usedToday;
    }
}
