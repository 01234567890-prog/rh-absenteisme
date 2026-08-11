package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.PredictionLevel;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PredictionRequestDto(
        @DecimalMin(value = "00.0")
        @DecimalMax(value = "100.0")
        BigDecimal score,

        @NotNull
        PredictionLevel level,

        @NotNull
        LocalDate predictionDate,

        @NotBlank
        String analysisPeriod,

        @NotNull
        @Positive
        Long userId
) {
}
