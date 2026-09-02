package com.araiedh.rh_absenteisme.service;

import com.araiedh.rh_absenteisme.dto.RoleRequestDto;
import com.araiedh.rh_absenteisme.dto.RoleResponseDto;
import com.araiedh.rh_absenteisme.entity.Role;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.RoleMapper;
import com.araiedh.rh_absenteisme.repository.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository ;
    private final RoleMapper roleMapper ;



    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER','EMPLOYEE')")
    public List<RoleResponseDto> getAllRoles () {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(roleMapper::toDto)
                .collect(Collectors.toList()) ;
    }



    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER','EMPLOYEE')")
    public RoleResponseDto getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("role Not Found With id : "+ id)) ;
        return roleMapper.toDto(role) ;
    }


    @PreAuthorize("hasAnyRole('ADMIN')")
    @Transactional
    public RoleResponseDto createRole (RoleRequestDto dto) {
        Role role = roleMapper.toEntity(dto) ;
        Role saved = roleRepository.save(role) ;
        return roleMapper.toDto(saved) ;

    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Transactional
    public void deleteRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id : " + id)) ;
        roleRepository.delete(role);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Transactional
    public RoleResponseDto updateRole(Long id , RoleRequestDto dto) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found xith id : " + id)) ;
        if (dto.name() != null) role.setName(dto.name());
        Role roleUpdated = roleRepository.save(role) ;
        return roleMapper.toDto(roleUpdated) ;
    }


}
