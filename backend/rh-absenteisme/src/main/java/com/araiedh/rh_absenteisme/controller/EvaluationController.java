package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.EvaluationRequestDto;
import com.araiedh.rh_absenteisme.dto.EvaluationResponseDto;
import com.araiedh.rh_absenteisme.dto.EvaluationUpdateRequestDto;
import com.araiedh.rh_absenteisme.service.EvaluationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping
    public List<EvaluationResponseDto> getAllEvaluations() {
        return evaluationService.getAllEvaluations();
    }

    @GetMapping("/{id}")
    public EvaluationResponseDto getEvaluationById(@PathVariable Long id) {
        return evaluationService.getEvaluationById(id);
    }

    @PostMapping
    public EvaluationResponseDto createEvaluation(@NotNull @RequestBody EvaluationRequestDto dto) {
        return evaluationService.createEvaluation(dto);
    }

    @PatchMapping("/{id}")
    public EvaluationResponseDto updateEvaluation(@Valid @PathVariable Long id, @RequestBody EvaluationUpdateRequestDto dto) {
        return evaluationService.updateEvaluation(id, dto);
    }

    @PostMapping("/{id}/confirm")
    public EvaluationResponseDto confirmEvaluation(@PathVariable Long id) {
        return evaluationService.confirmEvaluation(id);
    }

}
