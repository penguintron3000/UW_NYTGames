package com.example.NYT_backend.Repository;

import com.example.NYT_backend.Entity.WordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WordleRepository extends JpaRepository<WordEntity, String> {
}
