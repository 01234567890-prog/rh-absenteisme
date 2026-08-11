package com.araiedh.rh_absenteisme.dto;

import jakarta.validation.constraints.NotBlank;

public record DepartementRequestDto(
        @NotBlank(message = "Name is required")
        String name ,
        String description
) {
}
