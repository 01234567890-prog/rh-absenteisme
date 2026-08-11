package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserRequestDto(
        @NotBlank(message = "Name is required")
        String firstName ,

        @NotBlank(message = "LastName is required")
        String lastName ,

        @NotBlank(message = "NumberPhone is required")
        @Size(min = 8 , max = 15)
        String phoneNumber ,

        @Email
        String email ,

        @Size(min = 8 ,max = 50)
        String password ,

        @NotNull
        LocalDate hireDate ,

        @NotNull
        UserStatus status ,

        Long departementId ,

        Long roleId ,

        Long positionId

) {
}
