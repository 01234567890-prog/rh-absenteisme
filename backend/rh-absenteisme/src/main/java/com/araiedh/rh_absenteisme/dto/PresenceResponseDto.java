package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.PresenceStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public record PresenceResponseDto(
        Long id ,
        LocalDate date ,
        LocalTime checkInTime ,
        LocalTime checkOutTime ,
        PresenceStatus status ,
        Long userId
) {
}
