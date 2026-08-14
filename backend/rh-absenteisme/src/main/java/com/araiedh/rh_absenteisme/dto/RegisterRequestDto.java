package com.araiedh.rh_absenteisme.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(
        @NotBlank(message = "first name is required ") String firstName ,
        @NotBlank(message = "last name is required ") String lastName ,
        @NotBlank(message = "email is required") String email ,
        @NotBlank(message = "Password is required ") @Size(min = 8 , message = "password must be at least 8 characters") String password
) {
}
