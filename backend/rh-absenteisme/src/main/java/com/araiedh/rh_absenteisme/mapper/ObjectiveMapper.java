package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.ObjectiveRequestDto;
import com.araiedh.rh_absenteisme.dto.ObjectiveResponseDto;
import com.araiedh.rh_absenteisme.entity.Evaluation;
import com.araiedh.rh_absenteisme.entity.Objective;
import com.araiedh.rh_absenteisme.entity.ObjectiveStatus;
import org.springframework.stereotype.Component;

@Component
public class ObjectiveMapper {
    public Objective toEntity(ObjectiveRequestDto dto, Evaluation evaluation) {
        Objective objective = new Objective();
        objective.setDescription(dto.description());
        objective.setTargetValue(dto.targetValue());
        objective.setStatus(ObjectiveStatus.NOT_STARTED);
        objective.setEvaluation(evaluation);
        return objective;
    }

    public ObjectiveResponseDto toDto(Objective objective) {
        return new ObjectiveResponseDto(
                objective.getId(),
                objective.getDescription(),
                objective.getTargetValue(),
                objective.getAchievedValue(),
                objective.getStatus(),
                objective.getEvaluation().getId()
        );
    }
}
