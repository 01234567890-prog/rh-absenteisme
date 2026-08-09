package com.araiedh.rh_absenteisme.service;

import com.araiedh.rh_absenteisme.dto.PositionRequestDto;
import com.araiedh.rh_absenteisme.dto.PositionResponseDto;
import com.araiedh.rh_absenteisme.entity.Position;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.PositionMapper;
import com.araiedh.rh_absenteisme.repository.PositionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionService {
    private final PositionRepository positionRepository ;
    private final PositionMapper positionMapper ;


    public List<PositionResponseDto> getAllPosition () {
        List<Position> positions = positionRepository.findAll() ;
        return positions.stream()
                .map(positionMapper::toDto)
                .collect(Collectors.toList()) ;
    }

    public PositionResponseDto getPositionById(Long id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("not found position with id : " + id)) ;
        return positionMapper.toDto(position) ;
    }


    @Transactional
    public PositionResponseDto createPosition(PositionRequestDto dto) {
        Position position = positionMapper.toEntity(dto) ;
        Position saved = positionRepository.save(position) ;
        return positionMapper.toDto(saved) ;
    }

    @Transactional
    public void deletePosition(Long id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("not found position with id : " + id)) ;
        positionRepository.delete(position);

    }


    @Transactional
    public PositionResponseDto updatePosition(Long id , PositionRequestDto dto) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("not found position with id : " + id)) ;
        if (dto.title() != null) position.setTitle(dto.title());
        if (dto.description() != null) position.setDescription(dto.description());
        Position updatedPosition = positionRepository.save(position);
        return positionMapper.toDto(updatedPosition) ;

    }

}
