package com.example.NYT_backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cnouns")
public class NounEntity {
    @Id
    @Column(name = "nounid", nullable = false)
    private int nounId;

    @Column(name = "noun", nullable = false)
    private String noun;

    @Column(name = "topic")
    private String topic;

    public NounEntity() {}

    public int getNounId() { return nounId; }

    public void setNounId(int nounId) { this.nounId = nounId; }

    public String getNoun() {
        return noun;
    }

    public void setWord(String word) {
        this.noun = word;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}
