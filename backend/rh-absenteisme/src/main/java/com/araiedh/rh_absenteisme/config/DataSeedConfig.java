package com.araiedh.rh_absenteisme.config;

import com.araiedh.rh_absenteisme.entity.Role;
import com.araiedh.rh_absenteisme.entity.RoleName;
import com.araiedh.rh_absenteisme.entity.User;
import com.araiedh.rh_absenteisme.entity.UserStatus;
import com.araiedh.rh_absenteisme.repository.RoleRepository;
import com.araiedh.rh_absenteisme.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataSeedConfig {
    private final UserRepository userRepository ;
    private final RoleRepository roleRepository ;
    private final PasswordEncoder passwordEncoder ;

    @Bean
    public CommandLineRunner seedAdmin() {
        return args -> {
            if (userRepository.existsByEmail("admin@gmail.com")) {
                return;
            }
            Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                    .orElseGet(() -> {
                        Role role = new Role() ;
                        role.setName(RoleName.ADMIN);
                        return  roleRepository.save(role) ;
                    }) ;

            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("Admin@12345"));
            admin.setStatus(UserStatus.ACTIVE);
            admin.setHireDate(LocalDate.now());
            admin.setRole(adminRole);

            userRepository.save(admin);
            System.out.println("Default admin created: admin@gmail.com / Admin@12345");

        } ;
    }

















}
