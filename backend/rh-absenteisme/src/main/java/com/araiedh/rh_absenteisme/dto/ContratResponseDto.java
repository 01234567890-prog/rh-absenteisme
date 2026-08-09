package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.ContratStatus;
import com.araiedh.rh_absenteisme.entity.ContratType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContratResponseDto(
        Long id ,
        ContratType type,
        BigDecimal baseSalary,
        LocalDate signatureDate,
        LocalDate startDate,
        LocalDate endDate,
        ContratStatus status,
        Long userId
) {
}
