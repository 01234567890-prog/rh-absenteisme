package com.araiedh.rh_absenteisme.service;

import com.araiedh.rh_absenteisme.dto.ObjectiveRequestDto;
import com.araiedh.rh_absenteisme.dto.ObjectiveResponseDto;
import com.araiedh.rh_absenteisme.dto.ObjectiveUpdateRequestDto;
import com.araiedh.rh_absenteisme.entity.Evaluation;
import com.araiedh.rh_absenteisme.entity.Objective;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.ObjectiveMapper;
import com.araiedh.rh_absenteisme.repository.EvaluationRepository;
import com.araiedh.rh_absenteisme.repository.ObjectiveRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ObjectiveService {
    private final ObjectiveRepository objectiveRepository;
    private final EvaluationRepository evaluationRepository;
    private final ObjectiveMapper objectiveMapper;

    @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER','MANAGER')")
    public List<ObjectiveResponseDto> getAllObjectives() {
        return objectiveRepository.findAll().stream()
                .map(objectiveMapper::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER','MANAGER','EMPLOYEE')")
    public ObjectiveResponseDto getObjectiveById(Long id) {
        Objective objective = objectiveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("objective not found with id: " + id));
        return objectiveMapper.toDto(objective);
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER','MANAGER','EMPLOYEE')")
    public List<ObjectiveResponseDto> getObjectivesByEvaluationId(Long evaluationId) {
        return objectiveRepository.findByEvaluationId(evaluationId).stream()
                .map(objectiveMapper::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER','MANAGER')")
    @Transactional
    public ObjectiveResponseDto createObjective(ObjectiveRequestDto dto) {
        Evaluation evaluation = evaluationRepository.findById(dto.evaluationId())
                .orElseThrow(() -> new ResourceNotFoundException("evaluation not found with id: " + dto.evaluationId()));
        Objective objective = objectiveMapper.toEntity(dto, evaluation);
        Objective saved = objectiveRepository.save(objective);
        return objectiveMapper.toDto(saved);
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER','MANAGER')")
    @Transactional
    public ObjectiveResponseDto updateObjective(Long id, ObjectiveUpdateRequestDto dto) {
        Objective objective = objectiveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("objective not found with id: " + id));

        if (dto.achievedValue() != null) objective.setAchievedValue(dto.achievedValue());
        if (dto.status() != null) objective.setStatus(dto.status());

        Objective updated = objectiveRepository.save(objective);
        return objectiveMapper.toDto(updated);
    }

}
