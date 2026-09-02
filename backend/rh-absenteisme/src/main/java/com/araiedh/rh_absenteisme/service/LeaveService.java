package com.araiedh.rh_absenteisme.service;


import com.araiedh.rh_absenteisme.dto.LeaveRequestDto;
import com.araiedh.rh_absenteisme.dto.LeaveResponseDto;
import com.araiedh.rh_absenteisme.dto.LeaveUpdateRequestDto;
import com.araiedh.rh_absenteisme.entity.Leave;
import com.araiedh.rh_absenteisme.entity.LeaveStatus;
import com.araiedh.rh_absenteisme.entity.User;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.LeaveMapper;
import com.araiedh.rh_absenteisme.repository.LeaveRepository;
import com.araiedh.rh_absenteisme.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveService {
    private final LeaveRepository leaveRepository ;
    private final UserRepository userRepository ;
    private final LeaveMapper leaveMapper ;



    @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER','AI_SERVICE')")
    public List<LeaveResponseDto> getAllLeave() {
        List<Leave> leaves = leaveRepository.findAll() ;
        return leaves.stream()
                .map(leaveMapper::toDto)
                .collect(Collectors.toList()) ;

    }

    @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER','MANAGER','EMPLOYEE')")
    public LeaveResponseDto getLeaveById (Long id) {
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("leave not found with id : " + id)) ;
        return leaveMapper.toDto(leave) ;
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR_MANAGER','MANAGER','EMPLOYEE')")
    @Transactional
    public LeaveResponseDto createLeave (LeaveRequestDto dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResourceNotFoundException("user not found with id : " + dto.userId())) ;
        Leave leave = leaveMapper.toEntity(dto , user) ;
        Leave savedLeave = leaveRepository.save(leave) ;
        return leaveMapper.toDto(savedLeave) ;

    }

    @PreAuthorize("hasAnyRole('HR_MANAGER')")
    @Transactional
    public LeaveResponseDto responseLeaveRequest(Long id , LeaveUpdateRequestDto dto) {
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("user not found with id : " + id));
        if (dto.status() != null) leave.setStatus(dto.status());
        Leave updatedLeave = leaveRepository.save(leave) ;
        return leaveMapper.toDto(updatedLeave);


    }
}
