package com.example.NYT_backend.Service;

import java.util.List;
import java.util.Optional;

import com.example.NYT_backend.Entity.NounEntity;
import com.example.NYT_backend.Entity.TopicEntity;
import com.example.NYT_backend.Entity.WordEntity;
import com.example.NYT_backend.Repository.NounRepository;
import com.example.NYT_backend.Repository.TopicRepository;
import com.example.NYT_backend.Repository.WordleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Service
public class Service{

    private final WordleRepository wordleRepository;
    private final NounRepository nounRepository;
    private final TopicRepository topicRepository;

    @Autowired
    public Service(WordleRepository wordleRepository, NounRepository nounRepository, TopicRepository topicRepository) {
        this.wordleRepository = wordleRepository;
        this.nounRepository = nounRepository;
        this.topicRepository = topicRepository;
    }
    
    public List<WordEntity> getAllWords() { return wordleRepository.findAll(); }

    public List<NounEntity> getAllNouns() { return nounRepository.findAll(); }

    public List<TopicEntity> getAllTopics() { return topicRepository.findAll(); }

    @Modifying
    public void markWordAsUsed(String word) {
        WordEntity wordObject = wordleRepository.findById(word).orElseThrow(() ->
                new RuntimeException("Word not found"));
        wordObject.setUsedToday(true);
        wordleRepository.save(wordObject);
    }

    public boolean isWordUsedToday(String word) {
        WordEntity wordObject = wordleRepository.findById(word).orElseThrow(() ->
                new RuntimeException("Word not found"));
        return wordObject.isUsedToday();
    }

    @Modifying
    public void markTopicAsUsed(String topic) {
        TopicEntity topicObject = topicRepository.findById(topic).orElseThrow(() ->
                new RuntimeException("Topic not found"));
        topicObject.setUsedToday(true);
        topicRepository.save(topicObject);
    }

    public boolean isTopicUsedToday(String topic) {
        TopicEntity topicObject = topicRepository.findById(topic).orElseThrow(() ->
                new RuntimeException("Topic not found"));
        return topicObject.isUsedToday();
    }


}
