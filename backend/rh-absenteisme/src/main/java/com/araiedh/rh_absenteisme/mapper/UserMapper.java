package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.UserRequestDto;
import com.araiedh.rh_absenteisme.dto.UserResponseDto;
import com.araiedh.rh_absenteisme.entity.Departement;
import com.araiedh.rh_absenteisme.entity.Position;
import com.araiedh.rh_absenteisme.entity.Role;
import com.araiedh.rh_absenteisme.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User toEntity (UserRequestDto dto , Departement departement , Role role , Position position) {
        User user = new User();
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPhoneNumber(dto.phoneNumber());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setHireDate(dto.hireDate());
        user.setStatus(dto.status());
        user.setDepartement(departement);
        user.setRole(role);
        user.setPosition(position);
        return user ;

    }

    public UserResponseDto toDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getEmail(),
                user.getCreatedDate() ,
                user.getHireDate() ,
                user.getStatus() ,
                user.getDepartement() != null ? user.getDepartement().getId() : null ,
                user.getRole().getId() ,
                user.getPosition() != null ? user.getPosition().getId() : null

        ) ;
    }
}
