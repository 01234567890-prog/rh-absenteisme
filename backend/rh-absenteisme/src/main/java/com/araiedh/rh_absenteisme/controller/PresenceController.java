package com.araiedh.rh_absenteisme.controller;

import com.araiedh.rh_absenteisme.dto.PresenceResponseDto;
import com.araiedh.rh_absenteisme.service.PresenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presences")
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;

    @GetMapping
    public List<PresenceResponseDto> getAllPresence() {
        return presenceService.getAllPresence();
    }

    @GetMapping("/{id}")
    public PresenceResponseDto getPresenceById(@PathVariable Long id) {
        return presenceService.getPresenceById(id);
    }

    @PostMapping("/checkin/{userId}")
    public PresenceResponseDto checkIn(@Valid @PathVariable Long userId) {
        return presenceService.checkIn(userId);
    }

    @PostMapping("/checkout/{userId}")
    public PresenceResponseDto checkOut(@Valid @PathVariable Long userId) {
        return presenceService.checkOut(userId);
    }
}
