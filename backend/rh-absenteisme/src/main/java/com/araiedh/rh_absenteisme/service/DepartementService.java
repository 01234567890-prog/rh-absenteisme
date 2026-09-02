package com.araiedh.rh_absenteisme.service;

import com.araiedh.rh_absenteisme.dto.DepartementRequestDto;
import com.araiedh.rh_absenteisme.dto.DepartementResponseDto;
import com.araiedh.rh_absenteisme.entity.Departement;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.DepartementMapper;
import com.araiedh.rh_absenteisme.repository.DepartementRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartementService {
    private final DepartementRepository departementRepository ;
    private final DepartementMapper departementMapper ;


    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER','EMPLOYEE')")
    public List<DepartementResponseDto> getAllDepartement() {
        List<Departement> allDepartement = departementRepository.findAll();
        return allDepartement.stream()
                .map(departementMapper::toDto)
                .collect(Collectors.toList()) ;

    }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER','EMPLOYEE')")
    public DepartementResponseDto getDepartementByID(Long id) {
        Departement depart =  departementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("not found with id : "+id));
        return departementMapper.toDto(depart);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER','EMPLOYEE')")
    @Transactional
    public DepartementResponseDto createDepartement(DepartementRequestDto dto) {
        Departement departement = departementMapper.toEntity(dto) ;
        Departement saved = departementRepository.save(departement) ;
        return departementMapper.toDto(saved) ;
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Transactional
    public void deleteDepartementById(Long id) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("depatement not found with id : " + id)) ;
        departementRepository.delete(departement);
    }


    @PreAuthorize("hasAnyRole('ADMIN')")
    @Transactional
    public DepartementResponseDto updateDepartement (Long id ,DepartementRequestDto dto) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("deprtement not find with id : " + id)) ;
        if (dto.name() != null) departement.setName(dto.name());
        if (dto.description() != null) departement.setDescription(dto.description());
        Departement departementUpdated = departementRepository.save(departement) ;
        return departementMapper.toDto(departementUpdated) ;
    }

}
