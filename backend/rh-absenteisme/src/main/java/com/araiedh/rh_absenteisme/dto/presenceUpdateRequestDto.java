package com.araiedh.rh_absenteisme.dto;

import java.time.LocalDateTime;

public record presenceUpdateRequestDto(
        LocalDateTime checkOutTime
) {
}
