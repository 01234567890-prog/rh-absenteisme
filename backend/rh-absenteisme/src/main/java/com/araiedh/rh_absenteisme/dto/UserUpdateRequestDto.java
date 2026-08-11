package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserUpdateRequestDto(
        @NotBlank(message = "Name is required")
        String firstName,

        @NotBlank(message = "LastName is required")
        String lastName,

        @NotNull
        String phoneNumber,

        @NotNull
        UserStatus status,

        Long departementId,

        Long roleId,

        Long positionId
) {
}
