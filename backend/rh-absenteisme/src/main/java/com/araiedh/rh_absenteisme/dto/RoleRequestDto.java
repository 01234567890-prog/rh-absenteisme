package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.RoleName;
import jakarta.validation.constraints.NotBlank;

public record RoleRequestDto(
        @NotBlank(message = "name is required")
       RoleName name
) {
}
