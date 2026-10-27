package com.example.NYT_backend.Entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ctopic")
public class TopicEntity {
    @Id
    @Column(name = "topic", nullable = false)
    private String topic;

    @Column(name = "difficulty")
    private int diff;

    @Column(name = "used")
    private boolean usedToday;

    public TopicEntity() {
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public int getDiff() {
        return diff;
    }

    public void setDiff(int diff) {
        this.diff = diff;
    }

    public boolean isUsedToday() {
        return usedToday;
    }

    public void setUsedToday(boolean usedToday) {
        this.usedToday = usedToday;
    }
}
