package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.LeaveRequestDto;
import com.araiedh.rh_absenteisme.dto.LeaveResponseDto;
import com.araiedh.rh_absenteisme.dto.LeaveUpdateRequestDto;
import com.araiedh.rh_absenteisme.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {
    private final LeaveService leaveService ;

    @GetMapping
    public List<LeaveResponseDto> getAllLeave() {
        return leaveService.getAllLeave() ;
    }

    @GetMapping("/{id}")
    public LeaveResponseDto getLeave (@PathVariable Long id) {
        return leaveService.getLeaveById(id) ;
    }

    @PostMapping
    public LeaveResponseDto createLeave(@Valid @RequestBody LeaveRequestDto dto) {
        return leaveService.createLeave(dto) ;
    }

    @PatchMapping("/{id}")
    public LeaveResponseDto responseLeaveRequest(@Valid @PathVariable Long id , @RequestBody LeaveUpdateRequestDto dto) {
        return leaveService.responseLeaveRequest(id , dto) ;
    }
}
