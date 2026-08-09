package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.RoleName;

public record RoleResponseDto(
        Long id ,
        RoleName name
) {
}
