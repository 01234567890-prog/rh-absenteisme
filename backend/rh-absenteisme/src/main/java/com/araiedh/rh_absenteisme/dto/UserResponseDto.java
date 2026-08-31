package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.UserStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserResponseDto(
        Long id ,
        String firstName ,
        String lastName ,
        String phoneNumber ,
        String email ,
        LocalDateTime createddate ,
        LocalDate hireDate ,
        UserStatus status ,
        Long departementId ,
        Long roleId ,
        Long positionId ,
        Long mangerId
) {
}
