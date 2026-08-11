package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.ObjectiveRequestDto;
import com.araiedh.rh_absenteisme.dto.ObjectiveResponseDto;
import com.araiedh.rh_absenteisme.dto.ObjectiveUpdateRequestDto;
import com.araiedh.rh_absenteisme.service.ObjectiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/objectives")
@RequiredArgsConstructor
public class ObjectiveController {

    private final ObjectiveService objectiveService;

    @GetMapping
    public List<ObjectiveResponseDto> getAllObjectives() {
        return objectiveService.getAllObjectives();
    }

    @GetMapping("/{id}")
    public ObjectiveResponseDto getObjectiveById(@PathVariable Long id) {
        return objectiveService.getObjectiveById(id);
    }

    @GetMapping("/evaluation/{evaluationId}")
    public List<ObjectiveResponseDto> getObjectivesByEvaluationId(@PathVariable Long evaluationId) {
        return objectiveService.getObjectivesByEvaluationId(evaluationId);
    }

    @PostMapping
    public ObjectiveResponseDto createObjective(@RequestBody ObjectiveRequestDto dto) {
        return objectiveService.createObjective(dto);
    }

    @PatchMapping("/{id}")
    public ObjectiveResponseDto updateObjective(@PathVariable Long id, @RequestBody ObjectiveUpdateRequestDto dto) {
        return objectiveService.updateObjective(id, dto);
    }
}
