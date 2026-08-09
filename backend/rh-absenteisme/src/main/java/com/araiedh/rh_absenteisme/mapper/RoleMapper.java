package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.RoleRequestDto;
import com.araiedh.rh_absenteisme.dto.RoleResponseDto;
import com.araiedh.rh_absenteisme.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public Role toEntity(RoleRequestDto dto) {
        Role role = new Role() ;
        role.setName(dto.name());
        return role ;
    }

    public RoleResponseDto toDto (Role role) {
        return new RoleResponseDto(role.getId(),
                role.getName()) ;
    }
}
