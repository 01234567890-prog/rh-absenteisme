package com.araiedh.rh_absenteisme.service;

import com.araiedh.rh_absenteisme.dto.ContratRequestDto;
import com.araiedh.rh_absenteisme.dto.ContratResponseDto;
import com.araiedh.rh_absenteisme.dto.ContratUpdateRequestDto;
import com.araiedh.rh_absenteisme.entity.Contrat;
import com.araiedh.rh_absenteisme.entity.User;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.ContratMapper;
import com.araiedh.rh_absenteisme.repository.ContratRepository;
import com.araiedh.rh_absenteisme.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContratService {
    private final ContratRepository contratRepository ;
    private final ContratMapper contratMapper ;
    private final UserRepository userRepository ;

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER')")
    public List<ContratResponseDto> getAllContrat() {
        List<Contrat> allContrat = contratRepository.findAll() ;
        return allContrat.stream()
                .map(contratMapper::toDto)
                .collect(Collectors.toList()) ;
    }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER','EMPLOYEE')")
    public ContratResponseDto getContratById(Long id) {
        Contrat contrat = contratRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrat not found with id : " + id)) ;
        return contratMapper.toDto(contrat) ;
    }

    @PreAuthorize("hasAnyRole('RH_MANAGER')")
    @Transactional
    public ContratResponseDto createContrat (ContratRequestDto dto ) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResourceNotFoundException("user not found with id : "+ dto.userId())) ;
        Contrat contart = contratMapper.toEntity(dto , user) ;
        Contrat savedContrat = contratRepository.save(contart) ;
        return contratMapper.toDto(savedContrat) ;
    }

    @PreAuthorize("hasAnyRole('RH_MANAGER')")
    @Transactional
    public ContratResponseDto updateContrat(Long id , ContratUpdateRequestDto dto) {
        Contrat contrat = contratRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("contrat not found with id : " + id)) ;
        if (dto.baseSalary() != null) contrat.setBaseSalary(dto.baseSalary());
        if (dto.endDate() != null) contrat.setEndDate(dto.endDate());
        if (dto.status() != null) contrat.setStatus(dto.status());
        Contrat updatedContrat = contratRepository.save(contrat) ;
        return contratMapper.toDto(updatedContrat) ;
    }
}
