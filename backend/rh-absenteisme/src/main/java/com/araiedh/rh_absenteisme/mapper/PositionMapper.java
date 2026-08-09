package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.PositionRequestDto;
import com.araiedh.rh_absenteisme.dto.PositionResponseDto;
import com.araiedh.rh_absenteisme.entity.Position;
import org.springframework.stereotype.Component;

@Component
public class PositionMapper {

    public Position toEntity(PositionRequestDto dto) {
        Position position = new Position() ;
        position.setTitle(dto.title());
        position.setDescription(dto.description());
        return position ;
    }

    public PositionResponseDto toDto (Position position) {
        return new PositionResponseDto(
                position.getId() ,
                position.getTitle(),
                position.getDescription()
        ) ;
    }

}
