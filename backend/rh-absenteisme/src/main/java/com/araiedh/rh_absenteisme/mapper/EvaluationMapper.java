package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.EvaluationRequestDto;
import com.araiedh.rh_absenteisme.dto.EvaluationResponseDto;
import com.araiedh.rh_absenteisme.entity.Evaluation;
import com.araiedh.rh_absenteisme.entity.User;
import org.springframework.stereotype.Component;

@Component
public class EvaluationMapper {
    public Evaluation toEntity(EvaluationRequestDto dto, User evaluatedUser, User evaluator) {
        Evaluation evaluation = new Evaluation();
        evaluation.setPeriod(dto.period());
        evaluation.setPerformanceScore(dto.performanceScore());
        evaluation.setCompetencyScore(dto.competencyScore());
        evaluation.setBehaviorScore(dto.behaviorScore());
        evaluation.setEvaluationDate(dto.evaluationDate());
        evaluation.setComment(dto.comment());
        evaluation.setEvaluatedUser(evaluatedUser);
        evaluation.setEvaluator(evaluator);
        return evaluation;
    }

    public EvaluationResponseDto toDto(Evaluation evaluation) {
        return new EvaluationResponseDto(
                evaluation.getId(),
                evaluation.getPeriod(),
                evaluation.getPerformanceScore(),
                evaluation.getCompetencyScore(),
                evaluation.getBehaviorScore(),
                evaluation.getEvaluationDate(),
                evaluation.getComment(),
                evaluation.isConfirmed(),
                evaluation.getEvaluatedUser().getId(),
                evaluation.getEvaluator().getId()
        );
    }
}
