package com.araiedh.rh_absenteisme.repository;

import com.araiedh.rh_absenteisme.entity.Role;
import com.araiedh.rh_absenteisme.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name) ;
}
