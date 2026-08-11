package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.DepartementRequestDto;
import com.araiedh.rh_absenteisme.dto.DepartementResponseDto;
import com.araiedh.rh_absenteisme.service.DepartementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departements")
@RequiredArgsConstructor
public class DepartementController {
    private final DepartementService departementService ;

    @GetMapping
    public List<DepartementResponseDto> getAllDepartement() {
        return departementService.getAllDepartement() ;
    }

    @GetMapping("/{id}")
    public DepartementResponseDto getDepartementById(@PathVariable Long id) {
        return departementService.getDepartementByID(id) ;
    }

    @PostMapping
    public DepartementResponseDto createDepartement(@Valid @RequestBody DepartementRequestDto dto) {
        return departementService.createDepartement(dto) ;

    }

    @DeleteMapping("/{id}")
    public void deleteDepartementById(@PathVariable Long id) {
        departementService.deleteDepartementById(id);
    }

    @PatchMapping("/{id}")
    public DepartementResponseDto updateDepartement(@PathVariable Long id , @RequestBody DepartementRequestDto
                                                    dto) {
        return departementService.updateDepartement(id , dto) ;
    }
}
