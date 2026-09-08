package com.araiedh.rh_absenteisme.service;

import com.araiedh.rh_absenteisme.dto.EvaluationRequestDto;
import com.araiedh.rh_absenteisme.dto.EvaluationResponseDto;
import com.araiedh.rh_absenteisme.dto.EvaluationUpdateRequestDto;
import com.araiedh.rh_absenteisme.entity.Evaluation;
import com.araiedh.rh_absenteisme.entity.User;
import com.araiedh.rh_absenteisme.exception.OperationNotAllowedException;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.EvaluationMapper;
import com.araiedh.rh_absenteisme.repository.EvaluationRepository;
import com.araiedh.rh_absenteisme.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationService {
    private final EvaluationRepository evaluationRepository;
    private final UserRepository userRepository;
    private final EvaluationMapper evaluationMapper;

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER','EMPLOYEE','AI_SERVICE')")
    public List<EvaluationResponseDto> getAllEvaluations() {
        return evaluationRepository.findAll().stream()
                .map(evaluationMapper::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER','EMPLOYEE')")
    public EvaluationResponseDto getEvaluationById(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("evaluation not found with id: " + id));
        return evaluationMapper.toDto(evaluation);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER')")
    @Transactional
    public EvaluationResponseDto createEvaluation(EvaluationRequestDto dto) {
        User evaluatedUser = userRepository.findById(dto.evaluatedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("user not found with id: " + dto.evaluatedUserId()));
        User evaluator = userRepository.findById(dto.evaluatorId())
                .orElseThrow(() -> new ResourceNotFoundException("user not found with id: " + dto.evaluatorId()));

        Evaluation evaluation = evaluationMapper.toEntity(dto, evaluatedUser, evaluator);
        Evaluation saved = evaluationRepository.save(evaluation);
        return evaluationMapper.toDto(saved);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER')")
    @Transactional
    public EvaluationResponseDto updateEvaluation(Long id, EvaluationUpdateRequestDto dto) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("evaluation not found with id: " + id));

        if (evaluation.isConfirmed()) {
            throw new OperationNotAllowedException("Cannot modify a confirmed evaluation");
        }

        if (dto.performanceScore() != null) evaluation.setPerformanceScore(dto.performanceScore());
        if (dto.competencyScore() != null) evaluation.setCompetencyScore(dto.competencyScore());
        if (dto.behaviorScore() != null) evaluation.setBehaviorScore(dto.behaviorScore());
        if (dto.comment() != null) evaluation.setComment(dto.comment());

        Evaluation updated = evaluationRepository.save(evaluation);
        return evaluationMapper.toDto(updated);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER')")
    @Transactional
    public EvaluationResponseDto confirmEvaluation(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("evaluation not found with id: " + id));
        evaluation.setConfirmed(true);
        Evaluation updated = evaluationRepository.save(evaluation);
        return evaluationMapper.toDto(updated);
    }
}
