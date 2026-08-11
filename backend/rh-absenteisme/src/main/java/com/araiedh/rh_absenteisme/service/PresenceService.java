package com.araiedh.rh_absenteisme.service;

import com.araiedh.rh_absenteisme.dto.PresenceResponseDto;
import com.araiedh.rh_absenteisme.entity.Presence;
import com.araiedh.rh_absenteisme.entity.PresenceStatus;
import com.araiedh.rh_absenteisme.entity.User;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.PresenceMapper;
import com.araiedh.rh_absenteisme.repository.PresenceRepository;
import com.araiedh.rh_absenteisme.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.w3c.dom.stylesheets.LinkStyle;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresenceService {
    private final PresenceRepository presenceRepository ;
    private final UserRepository userRepository ;
    private final PresenceMapper presenceMapper ;


    @Transactional
    public PresenceResponseDto checkIn(Long userID) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("user not find with id : " + userID)) ;
        // check if User checked in
        LocalDate toDay = LocalDate.now() ;
        Boolean alreadyCheckIn = presenceRepository.existsByUserAndDateAndCheckOutTimeIsNull(user , toDay) ;

        if (alreadyCheckIn) {
            throw new RuntimeException("User already checked in today") ;
        }

        // create presence object
        Presence presence = presenceMapper.toEntity(user) ;
        presence.setDate(toDay);
        presence.setCheckInTime(LocalTime.now());

        // Auto change status with time checked in
        LocalTime officeStart = LocalTime.of(8 ,00) ;
        if (presence.getCheckInTime().isAfter(officeStart)) {
            presence.setStatus(PresenceStatus.LATE);
        } else {
            presence.setStatus(PresenceStatus.PRESENT);
        }

        // Save presence Object
        Presence saved = presenceRepository.save(presence) ;
        return presenceMapper.toDto(saved) ;

    }

    @Transactional
    public PresenceResponseDto checkOut(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("user not found with id : " + userId)) ;

        // Looking for open presence today
        LocalDate toDay = LocalDate.now() ;
        Presence openPresence = presenceRepository.findByUserAndDateAndCheckOutTimeIsNull(user , toDay)
                .orElseThrow(() -> new ResourceNotFoundException("presence not found with id : "+ userId));
        // set timeOut
        openPresence.setCheckOutTime(LocalTime.now());

        // save change
        Presence saved = presenceRepository.save(openPresence) ;
        return presenceMapper.toDto(saved) ;
    }

    public List<PresenceResponseDto> getAllPresence() {
        List<Presence> allPresence = presenceRepository.findAll() ;
        return allPresence.stream()
                .map(presenceMapper::toDto)
                .collect(Collectors.toList()) ;
    }

    public PresenceResponseDto getPresenceById(Long id) {
        Presence presence = presenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("presence not found with id " + id)) ;
        return presenceMapper.toDto(presence) ;
    }
}
