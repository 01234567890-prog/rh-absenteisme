package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.ContratRequestDto;
import com.araiedh.rh_absenteisme.dto.ContratResponseDto;
import com.araiedh.rh_absenteisme.entity.Contrat;
import com.araiedh.rh_absenteisme.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ContratMapper {

    public Contrat toEntity(ContratRequestDto dto , User user) {
        Contrat contrat = new Contrat() ;
        contrat.setType(dto.type());
        contrat.setBaseSalary(dto.baseSalary());
        contrat.setSignatureDate(dto.signatureDate());
        contrat.setStartDate(dto.startDate());
        contrat.setEndDate(dto.endDate());
        contrat.setStatus(dto.status());
        contrat.setUser(user);
        return contrat ;
    }

    public ContratResponseDto toDto (Contrat contrat) {
        return new ContratResponseDto(
                contrat.getId() ,
                contrat.getType() ,
                contrat.getBaseSalary() ,
                contrat.getSignatureDate() ,
                contrat.getStartDate() ,
                contrat.getEndDate() ,
                contrat.getStatus() ,
                contrat.getUser().getId()
        );
    }
}
