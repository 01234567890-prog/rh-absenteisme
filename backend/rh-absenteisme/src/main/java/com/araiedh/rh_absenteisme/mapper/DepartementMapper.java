package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.DepartementRequestDto;
import com.araiedh.rh_absenteisme.dto.DepartementResponseDto;
import com.araiedh.rh_absenteisme.entity.Departement;
import org.springframework.stereotype.Component;

@Component
public class DepartementMapper {

    public Departement toEntity(DepartementRequestDto dto) {
        Departement departement = new Departement() ;
        departement.setName(dto.name());
        departement.setDescription(dto.description());
        return departement ;
    }

    public DepartementResponseDto toDto (Departement departement) {
        return new DepartementResponseDto(departement.getId() ,
                departement.getName() ,
                departement.getDescription()) ;
    }
}
