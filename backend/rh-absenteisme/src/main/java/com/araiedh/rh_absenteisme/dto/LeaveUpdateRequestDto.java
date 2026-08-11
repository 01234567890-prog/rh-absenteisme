package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.LeaveStatus;
import jakarta.validation.constraints.NotNull;

public record LeaveUpdateRequestDto(
        @NotNull
        LeaveStatus status
) {
}
