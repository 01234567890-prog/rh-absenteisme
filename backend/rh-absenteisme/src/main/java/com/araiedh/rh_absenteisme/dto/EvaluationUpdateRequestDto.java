package com.araiedh.rh_absenteisme.dto;

import java.math.BigDecimal;

public record EvaluationUpdateRequestDto(
        BigDecimal performanceScore,
        BigDecimal competencyScore,
        BigDecimal behaviorScore,
        String comment
) {
}
