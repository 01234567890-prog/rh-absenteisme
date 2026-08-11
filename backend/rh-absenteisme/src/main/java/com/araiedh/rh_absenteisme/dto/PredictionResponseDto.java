package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.PredictionLevel;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PredictionResponseDto(
        Long id,
        BigDecimal score,
        PredictionLevel level ,
        LocalDate predictionDate,
        String analysisPeriod,
        Long userId
) {
}
