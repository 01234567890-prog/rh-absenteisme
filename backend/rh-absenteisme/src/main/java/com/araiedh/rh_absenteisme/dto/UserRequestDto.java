package com.araiedh.rh_absenteisme.dto;

import com.araiedh.rh_absenteisme.entity.UserStatus;

import java.time.LocalDate;

public record UserRequestDto(
        String firstName ,
        String lastName ,
        String phoneNumber ,
        String email ,
        String password ,
        LocalDate hireDate ,
        UserStatus status ,
        Long departementId ,
        Long roleId ,
        Long positionId

) {
}
