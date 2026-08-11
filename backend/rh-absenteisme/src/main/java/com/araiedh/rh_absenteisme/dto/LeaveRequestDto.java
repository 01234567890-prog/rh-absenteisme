package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.LeaveStatus;
import com.araiedh.rh_absenteisme.entity.LeaveType;

import java.time.LocalDate;

public record LeaveRequestDto(
        LeaveType type ,
        LocalDate startDate ,
        LocalDate endDate ,
        String reason ,
        Long userId
) {
}
