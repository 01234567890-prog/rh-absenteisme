package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.ContratStatus;
import com.araiedh.rh_absenteisme.entity.ContratType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContratRequestDto(

        @NotNull
        ContratType type,

        @DecimalMin(value = "00.0")
        @DecimalMax(value = "100.0")
        BigDecimal baseSalary,

        @NotNull
        LocalDate signatureDate,

        @NotNull
        LocalDate startDate,


        @NotNull
        LocalDate endDate,

        @NotNull
        ContratStatus status,


        @NotNull
        @NotBlank(message = "UserId is required")
        Long userId
) {
}
