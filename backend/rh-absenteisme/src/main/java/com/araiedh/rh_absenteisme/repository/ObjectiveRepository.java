package com.araiedh.rh_absenteisme.repository;

import com.araiedh.rh_absenteisme.entity.Objective;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObjectiveRepository extends JpaRepository<Objective,Long> {
    List<Objective> findByEvaluationId(Long evaluationId);
}
