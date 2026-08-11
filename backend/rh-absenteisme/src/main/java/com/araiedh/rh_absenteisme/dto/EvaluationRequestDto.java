package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.EvaluationPeriod;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EvaluationRequestDto(
        EvaluationPeriod period,
        BigDecimal performanceScore,
        BigDecimal competencyScore,
        BigDecimal behaviorScore,
        LocalDate evaluationDate,
        String comment,
        Long evaluatedUserId,
        Long evaluatorId
) {
}
