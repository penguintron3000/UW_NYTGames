package com.example.NYT_backend.Repository;

import com.example.NYT_backend.Entity.NounEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NounRepository extends JpaRepository<NounEntity, String> {
}
