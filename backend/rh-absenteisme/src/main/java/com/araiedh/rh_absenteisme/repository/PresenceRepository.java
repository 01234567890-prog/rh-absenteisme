package com.araiedh.rh_absenteisme.repository;

import com.araiedh.rh_absenteisme.entity.Presence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresenceRepository extends JpaRepository<Presence , Long> {

}
