package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.PositionRequestDto;
import com.araiedh.rh_absenteisme.dto.PositionResponseDto;
import com.araiedh.rh_absenteisme.repository.PositionRepository;
import com.araiedh.rh_absenteisme.service.PositionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionController {
    private final PositionService positionService;

    @GetMapping
    public List<PositionResponseDto> getAllPosition() {
        return positionService.getAllPosition();
    }

    @GetMapping("/{id}")
    public PositionResponseDto getPositionById(@PathVariable Long id) {
        return positionService.getPositionById(id);
    }

    @PostMapping
    public PositionResponseDto createPosition(@Valid @RequestBody PositionRequestDto dto) {
        return positionService.createPosition(dto);
    }

    @DeleteMapping("/{id}")
    public void deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
    }


    @PatchMapping("/{id}")
    public PositionResponseDto updatePosition(@Valid @PathVariable Long id, @RequestBody PositionRequestDto dto) {
        return positionService.updatePosition(id , dto) ;
    }


}