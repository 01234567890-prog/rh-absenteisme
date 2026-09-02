package com.araiedh.rh_absenteisme.service;

import com.araiedh.rh_absenteisme.dto.PredictionRequestDto;
import com.araiedh.rh_absenteisme.dto.PredictionResponseDto;
import com.araiedh.rh_absenteisme.entity.AbsenteeismPrediction;
import com.araiedh.rh_absenteisme.entity.User;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.PredictionMapper;
import com.araiedh.rh_absenteisme.repository.AbsenteeismPredictionRepository;
import com.araiedh.rh_absenteisme.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PredictionService {

        private final AbsenteeismPredictionRepository predictionRepository;
        private final UserRepository userRepository;
        private final PredictionMapper predictionMapper;

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER')")
        public List<PredictionResponseDto> getAllPredictions() {
            return predictionRepository.findAll().stream()
                    .map(predictionMapper::toDto)
                    .collect(Collectors.toList());
        }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER')")
        public PredictionResponseDto getPredictionById(Long id) {
            AbsenteeismPrediction prediction = predictionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("prediction not found with id: " + id));
            return predictionMapper.toDto(prediction);
        }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER')")
        public List<PredictionResponseDto> getPredictionsByUserId(Long userId) {
            return predictionRepository.findByUserId(userId).stream()
                    .map(predictionMapper::toDto)
                    .collect(Collectors.toList());
        }

        @Transactional
        public PredictionResponseDto createPrediction(PredictionRequestDto dto) {
            User user = userRepository.findById(dto.userId())
                    .orElseThrow(() -> new ResourceNotFoundException("user not found with id: " + dto.userId()));
            AbsenteeismPrediction prediction = predictionMapper.toEntity(dto, user);
            AbsenteeismPrediction saved = predictionRepository.save(prediction);
            return predictionMapper.toDto(saved);
        }
}
