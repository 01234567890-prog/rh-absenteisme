package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.PredictionRequestDto;
import com.araiedh.rh_absenteisme.dto.PredictionResponseDto;
import com.araiedh.rh_absenteisme.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prediction")
@RequiredArgsConstructor
public class PredictionController {
    private final PredictionService predictionService;

    @GetMapping
    public List<PredictionResponseDto> getAllPredictions() {
        return predictionService.getAllPredictions();
    }

    @GetMapping("/{id}")
    public PredictionResponseDto getPredictionById(@PathVariable Long id) {
        return predictionService.getPredictionById(id);
    }

    @GetMapping("/user/{userId}")
    public List<PredictionResponseDto> getPredictionsByUserId(@PathVariable Long userId) {
        return predictionService.getPredictionsByUserId(userId);
    }

    @PostMapping
    public PredictionResponseDto createPrediction(@RequestBody PredictionRequestDto dto) {
        return predictionService.createPrediction(dto);
    }
}
