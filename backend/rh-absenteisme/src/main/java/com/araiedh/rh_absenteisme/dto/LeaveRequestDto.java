package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.LeaveStatus;
import com.araiedh.rh_absenteisme.entity.LeaveType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record LeaveRequestDto(
        @NotNull
        LeaveType type ,

        @NotNull
        LocalDate startDate ,

        @NotNull
        LocalDate endDate ,

        @NotBlank(message = "Reason is required")
        String reason ,

        @NotNull(message = "Id is Required ")
        @Positive
        Long userId
) {
}
