package com.araiedh.rh_absenteisme.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record EvaluationUpdateRequestDto(

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


        String comment
) {
}
