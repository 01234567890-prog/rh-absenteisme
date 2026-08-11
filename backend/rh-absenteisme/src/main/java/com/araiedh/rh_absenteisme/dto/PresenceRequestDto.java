package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.PresenceStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PresenceRequestDto(
        Long userId
) {
}
