package com.araiedh.rh_absenteisme.service;

import com.araiedh.rh_absenteisme.dto.AuthResponseDto;
import com.araiedh.rh_absenteisme.dto.LoginRequestDto;
import com.araiedh.rh_absenteisme.dto.RegisterRequestDto;
import com.araiedh.rh_absenteisme.entity.Role;
import com.araiedh.rh_absenteisme.entity.RoleName;
import com.araiedh.rh_absenteisme.entity.User;
import com.araiedh.rh_absenteisme.entity.UserStatus;
import com.araiedh.rh_absenteisme.exception.OperationNotAllowedException;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.repository.RoleRepository;
import com.araiedh.rh_absenteisme.repository.UserRepository;
import com.araiedh.rh_absenteisme.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository ;
    private final RoleRepository roleRepository ;
    private final PasswordEncoder passwordEncoder ;
    private final AuthenticationManager authenticationManager ;
    private final JwtService jwtService ;

    @Transactional
    public AuthResponseDto Register(RegisterRequestDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new OperationNotAllowedException("Email already in use  :" + dto.email());
        }
        Role defaultRole = roleRepository.findByName(RoleName.EMPLOYEE)
                .orElseThrow(() -> new ResourceNotFoundException("Default role EMPLOYEE not found "));
        User user = new User();
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setStatus(UserStatus.ACTIVE);
        user.setHireDate(LocalDate.now());
        user.setRole(defaultRole);

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return new AuthResponseDto(token, saved.getEmail(), saved.getRole().getName().name());


    }

    public AuthResponseDto login(LoginRequestDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );

        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + dto.email()));

        String token = jwtService.generateToken(user);
        return new AuthResponseDto(token, user.getEmail(), user.getRole().getName().name());
    }


}
