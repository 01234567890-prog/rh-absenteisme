package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.RoleRequestDto;
import com.araiedh.rh_absenteisme.dto.RoleResponseDto;
import com.araiedh.rh_absenteisme.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService ;

    @GetMapping
    public List<RoleResponseDto> getAllRole() {
        return roleService.getAllRoles() ;
    }

    @GetMapping("/{id}")
    public RoleResponseDto getRoleById (@PathVariable Long id) {
        return roleService.getRoleById(id) ;
    }

    @PostMapping
    public RoleResponseDto createRole (@Valid  @RequestBody RoleRequestDto dto) {
        return roleService.createRole(dto) ;
    }

    @DeleteMapping("/{id}")
    public void deleteRole (@PathVariable Long id) {
        roleService.deleteRoleById(id);
    }

    @PatchMapping("/{id}")
    public RoleResponseDto updateRole(@Valid @PathVariable Long id , @RequestBody RoleRequestDto dto) {
        return  roleService.updateRole(id , dto) ;
    }


}
