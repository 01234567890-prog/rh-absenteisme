package com.araiedh.rh_absenteisme.repository;

import com.araiedh.rh_absenteisme.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationRepository extends JpaRepository<Evaluation , Long> {
}
