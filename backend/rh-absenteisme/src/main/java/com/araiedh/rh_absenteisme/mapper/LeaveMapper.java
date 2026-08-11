package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.LeaveRequestDto;
import com.araiedh.rh_absenteisme.dto.LeaveResponseDto;
import com.araiedh.rh_absenteisme.entity.Leave;
import com.araiedh.rh_absenteisme.entity.LeaveStatus;
import com.araiedh.rh_absenteisme.entity.User;
import org.springframework.stereotype.Component;

@Component
public class LeaveMapper {
    public Leave toEntity(LeaveRequestDto dto , User user) {
        Leave leave = new Leave() ;
        leave.setType(dto.type());
        leave.setStartDate(dto.startDate());
        leave.setEndDate(dto.endDate());
        leave.setStatus(LeaveStatus.PENDING);
        leave.setReason(dto.reason());
        leave.setUser(user);
        return leave ;
    }
    public LeaveResponseDto toDto(Leave leave) {
        return new LeaveResponseDto(
                leave.getId(),
                leave.getType() ,
                leave.getStartDate() ,
                leave.getEndDate() ,
                leave.getStatus() ,
                leave.getReason() ,
                leave.getUser().getId()

        ) ;
    }
}
