package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.PredictionRequestDto;
import com.araiedh.rh_absenteisme.dto.PredictionResponseDto;
import com.araiedh.rh_absenteisme.entity.AbsenteeismPrediction;
import com.araiedh.rh_absenteisme.entity.User;
import org.springframework.stereotype.Component;

@Component
public class PredictionMapper {
    public AbsenteeismPrediction toEntity(PredictionRequestDto dto, User user) {
        AbsenteeismPrediction prediction = new AbsenteeismPrediction();
        prediction.setScore(dto.score());
        prediction.setLevel(dto.level());
        prediction.setPredictionDate(dto.predictionDate());
        prediction.setAnalysisPeriod(dto.analysisPeriod());
        prediction.setUser(user);
        return prediction;
    }

    public PredictionResponseDto toDto(AbsenteeismPrediction prediction) {
        return new PredictionResponseDto(
                prediction.getId(),
                prediction.getScore(),
                prediction.getLevel(),
                prediction.getPredictionDate(),
                prediction.getAnalysisPeriod(),
                prediction.getUser().getId()
        );

    }
}
