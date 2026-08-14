package com.araiedh.rh_absenteisme.dto;

public record AuthResponseDto(
        String token ,
        String email ,
        String role
) {
}
