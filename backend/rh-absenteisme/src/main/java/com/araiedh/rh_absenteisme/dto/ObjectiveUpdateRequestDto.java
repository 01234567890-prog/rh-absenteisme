package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.ObjectiveStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ObjectiveUpdateRequestDto(
        @NotNull
        @Positive
        BigDecimal achievedValue,

        @NotNull
        ObjectiveStatus status
) {
}
