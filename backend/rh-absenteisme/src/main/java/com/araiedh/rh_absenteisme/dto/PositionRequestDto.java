package com.araiedh.rh_absenteisme.dto;

import jakarta.validation.constraints.NotBlank;

public record PositionRequestDto(
        @NotBlank(message = "Title is required")
        String title ,
        String description
) {
}
