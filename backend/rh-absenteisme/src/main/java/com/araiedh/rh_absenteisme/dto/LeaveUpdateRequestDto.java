package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.LeaveStatus;

public record LeaveUpdateRequestDto(
        LeaveStatus status
) {
}
