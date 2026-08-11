package com.araiedh.rh_absenteisme.dto;

import java.math.BigDecimal;

public record ObjectiveRequestDto(
        String description ,
        BigDecimal targetValue ,
        Long evaluationId
) {
}
