package com.araiedh.rh_absenteisme.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ObjectiveRequestDto(
        @NotBlank(message = "Description is required")
        String description ,

        @NotBlank(message = "targetValue is required")
        BigDecimal targetValue ,

        @NotBlank(message = "Id id required")
        @Positive
        Long evaluationId
) {
}
