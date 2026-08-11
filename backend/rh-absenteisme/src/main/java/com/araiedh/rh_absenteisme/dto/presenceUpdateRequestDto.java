package com.araiedh.rh_absenteisme.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record presenceUpdateRequestDto(
        @NotNull
        LocalDateTime checkOutTime
) {
}
