package com.araiedh.rh_absenteisme.repository;

import com.araiedh.rh_absenteisme.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
