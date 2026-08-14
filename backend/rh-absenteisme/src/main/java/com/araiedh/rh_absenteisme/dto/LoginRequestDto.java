package com.araiedh.rh_absenteisme.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(
        @NotBlank(message = "email is required ") String email ,
        @NotBlank(message = "Password is required ") String password
) {
}
