package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.ContratRequestDto;
import com.araiedh.rh_absenteisme.dto.ContratResponseDto;
import com.araiedh.rh_absenteisme.dto.ContratUpdateRequestDto;
import com.araiedh.rh_absenteisme.service.ContratService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contrats")
@RequiredArgsConstructor
public class ContratController {
    private final ContratService contratService;

    @GetMapping
    public List<ContratResponseDto> getAllContrat() {
        return contratService.getAllContrat();
    }

    @GetMapping("/{id}")
    public ContratResponseDto getContratById(@PathVariable Long id) {
        return contratService.getContratById(id);
    }

    @PostMapping
    public ContratResponseDto createContrat(@Valid @RequestBody ContratRequestDto dto) {
        return contratService.createContrat(dto);
    }

    @PatchMapping("/{id}")
    public ContratResponseDto updateContrat(@Valid @PathVariable Long id, @RequestBody ContratUpdateRequestDto dto) {
        return contratService.updateContrat(id, dto);
    }

}
