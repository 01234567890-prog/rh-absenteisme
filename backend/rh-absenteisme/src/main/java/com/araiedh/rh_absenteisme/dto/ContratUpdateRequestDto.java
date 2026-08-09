package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.ContratStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContratUpdateRequestDto(
        BigDecimal baseSalary ,
        LocalDate endDate ,
        ContratStatus status
) {
}
