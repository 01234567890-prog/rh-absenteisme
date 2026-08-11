package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.LeaveStatus;
import com.araiedh.rh_absenteisme.entity.LeaveType;

import java.time.LocalDate;

public record LeaveResponseDto(
        Long id ,
        LeaveType type ,
        LocalDate startDate ,
        LocalDate endDate ,
        LeaveStatus status ,
        String reason ,
        Long userId
) {
}
