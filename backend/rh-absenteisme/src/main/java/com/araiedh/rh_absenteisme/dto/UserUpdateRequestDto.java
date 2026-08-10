package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.UserStatus;

public record UserUpdateRequestDto(
        String firstName,
        String lastName,
        String phoneNumber,
        UserStatus status,
        Long departementId,
        Long roleId,
        Long positionId
) {
}
