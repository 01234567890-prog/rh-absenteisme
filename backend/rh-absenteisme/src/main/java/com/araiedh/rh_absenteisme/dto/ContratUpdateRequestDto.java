package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.ContratStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContratUpdateRequestDto(
        @NotNull
        @DecimalMin(value = "0.00")
        @DecimalMax(value = "100.0")
        BigDecimal baseSalary ,

        @NotNull
        LocalDate endDate ,

        @NotNull
        ContratStatus status
) {
}
