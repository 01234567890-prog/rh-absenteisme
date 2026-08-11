package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.EvaluationPeriod;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EvaluationRequestDto(
        @NotNull
        EvaluationPeriod period,

        @NotBlank(message = "PerformanceScore is required")
        @DecimalMin(value = "0.0")
        @DecimalMax(value = "100.0")
        BigDecimal performanceScore,

        @NotBlank(message = "CompetencyScore is required")
        @DecimalMin(value = "0.0")
        @DecimalMax(value = "100.0")
        BigDecimal competencyScore,

        @NotBlank(message = "BehaviorScore is required")
        @DecimalMin(value = "0.0")
        @DecimalMax(value = "100.0")
        BigDecimal behaviorScore,

        @NotNull
        LocalDate evaluationDate,

        String comment,

        Long evaluatedUserId,
        Long evaluatorId
) {
}
