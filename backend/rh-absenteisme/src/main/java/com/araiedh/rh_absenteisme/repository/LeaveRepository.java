package com.araiedh.rh_absenteisme.repository;

import com.araiedh.rh_absenteisme.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
}
