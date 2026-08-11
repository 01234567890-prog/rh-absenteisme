package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.ObjectiveStatus;

import java.math.BigDecimal;

public record ObjectiveUpdateRequestDto(
        BigDecimal achievedValue,
        ObjectiveStatus status
) {
}
