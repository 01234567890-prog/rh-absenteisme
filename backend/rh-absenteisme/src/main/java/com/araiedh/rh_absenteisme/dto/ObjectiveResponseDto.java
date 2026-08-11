package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.ObjectiveStatus;

import java.math.BigDecimal;

public record ObjectiveResponseDto(
        Long id,
        String description,
        BigDecimal targetValue,
        BigDecimal achievedValue,
        ObjectiveStatus status,
        Long evaluationId
) {
}
