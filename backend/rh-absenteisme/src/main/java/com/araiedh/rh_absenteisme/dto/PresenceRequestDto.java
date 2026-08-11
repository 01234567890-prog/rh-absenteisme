package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.PresenceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PresenceRequestDto(
        @NotBlank(message = "userId is required")
        @Positive
        Long userId
) {
}
