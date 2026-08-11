package com.araiedh.rh_absenteisme.mapper;

import com.araiedh.rh_absenteisme.dto.PresenceRequestDto;
import com.araiedh.rh_absenteisme.dto.PresenceResponseDto;
import com.araiedh.rh_absenteisme.entity.Presence;
import com.araiedh.rh_absenteisme.entity.User;
import org.springframework.stereotype.Component;

@Component
public class PresenceMapper {

    public Presence toEntity ( User user) {
        Presence presence = new Presence() ;
        presence.setUser(user);
        return presence ;
    }

    public PresenceResponseDto toDto (Presence presence) {
        return new PresenceResponseDto(
                presence.getId() ,
                presence.getDate() ,
                presence.getCheckInTime() ,
                presence.getCheckOutTime() ,
                presence.getStatus() ,
                presence.getUser().getId()
        ) ;
    }
}
