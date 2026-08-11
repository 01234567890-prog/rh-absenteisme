package com.araiedh.rh_absenteisme.repository;

import com.araiedh.rh_absenteisme.entity.Presence;
import com.araiedh.rh_absenteisme.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface PresenceRepository extends JpaRepository<Presence , Long> {

    boolean existsByUserAndDateAndCheckOutTimeIsNull(User user, LocalDate date);
    Optional<Presence> findByUserAndDateAndCheckOutTimeIsNull(User user, LocalDate date);

}
