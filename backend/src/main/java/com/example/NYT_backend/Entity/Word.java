package com.example.NYT_backend.Entity;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

/*
 * This class represents a word and date, this class provides encapsulation and abstraction to the
 * wordle backend. It is used to store a word and date as well as chaning these variables.
 */
public class Word {
    String word;
    String topic;
    String date;
    int difficulty;
    DateTimeFormatter formatter;

    /*
     * This constructor creates a new word object.
     * Input: word the string that is associated with todays word
     */
    public Word(String word) {
        this.word = word;
        this.topic = "";
        this.difficulty = 0;
        this.formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        this.date = LocalDate.now(ZoneOffset.UTC).format(formatter);
    }

    public int getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(int difficulty) {
        this.difficulty = difficulty;
    }

    public void setTopic(String topic) { this.topic = topic; }

    public String getTopic() { return topic; }

    /**
     * Sets a new word for this object.
     *
     * word the new word to set
     */
    public void setWord(String word){
        this.word = word;
    }

    /**
     * Retrieves the word stored in this object.
     *
     * @return the stored word
     */
    public String getWord(){
        return word;
    }

    /**
     * Retrieves the date associated with this object.
     *
     * @return the associated date
     */
    public String getDate() {
        return date;
    }

    /**
     * Updates the associated date to the current UTC date.
     */
    public void changeDate() {
        this.date = LocalDate.now(ZoneOffset.UTC).format(formatter);
    }
}

