package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.EvaluationPeriod;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EvaluationResponseDto(
        Long id,
        EvaluationPeriod period,
        BigDecimal performanceScore,
        BigDecimal competencyScore,
        BigDecimal behaviorScore,
        LocalDate evaluationDate,
        String comment,
        boolean confirmed,
        Long evaluatedUserId,
        Long evaluatorId
) {
}
