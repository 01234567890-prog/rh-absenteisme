package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.AuthResponseDto;
import com.araiedh.rh_absenteisme.dto.LoginRequestDto;
import com.araiedh.rh_absenteisme.dto.RegisterRequestDto;
import com.araiedh.rh_absenteisme.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponseDto register(@Valid @RequestBody RegisterRequestDto dto) {
        return authService.Register(dto);
    }
    @PostMapping("/login")
    public AuthResponseDto login(@Valid @RequestBody LoginRequestDto dto) {
        return authService.login(dto) ;
    }

    @GetMapping("/api/auth/test")
    public String test() {
        return "public endpoint works";
    }


}
