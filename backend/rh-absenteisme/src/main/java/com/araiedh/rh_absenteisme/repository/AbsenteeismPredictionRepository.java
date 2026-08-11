package com.araiedh.rh_absenteisme.repository;

import com.araiedh.rh_absenteisme.entity.AbsenteeismPrediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface AbsenteeismPredictionRepository extends JpaRepository<AbsenteeismPrediction,Long> {
    List<AbsenteeismPrediction> findByUserId(Long userId);
}
