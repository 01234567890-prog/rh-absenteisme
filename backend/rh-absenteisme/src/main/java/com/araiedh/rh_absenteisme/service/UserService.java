package com.araiedh.rh_absenteisme.service;


import com.araiedh.rh_absenteisme.dto.UserRequestDto;
import com.araiedh.rh_absenteisme.dto.UserResponseDto;
import com.araiedh.rh_absenteisme.dto.UserUpdateRequestDto;
import com.araiedh.rh_absenteisme.entity.Departement;
import com.araiedh.rh_absenteisme.entity.Position;
import com.araiedh.rh_absenteisme.entity.Role;
import com.araiedh.rh_absenteisme.entity.User;
import com.araiedh.rh_absenteisme.exception.OperationNotAllowedException;
import com.araiedh.rh_absenteisme.exception.ResourceNotFoundException;
import com.araiedh.rh_absenteisme.mapper.UserMapper;
import com.araiedh.rh_absenteisme.repository.DepartementRepository;
import com.araiedh.rh_absenteisme.repository.PositionRepository;
import com.araiedh.rh_absenteisme.repository.RoleRepository;
import com.araiedh.rh_absenteisme.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository ;
    private final DepartementRepository departementRepository ;
    private final RoleRepository roleRepository ;
    private final PositionRepository positionRepository ;
    private final UserMapper userMapper ;
    private final PasswordEncoder passwordEncoder;


    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER')")
    public List<UserResponseDto> getAllUser() {
        List<User> allUsers = userRepository.findAll() ;
        return allUsers.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList()) ;
    }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER','MANAGER')")
    public UserResponseDto getUserById (Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id : " + id)) ;
        return userMapper.toDto(user) ;
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Transactional
    public UserResponseDto createUser (UserRequestDto dto ) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new OperationNotAllowedException("Email already in use: " + dto.email());
        }
        if (userRepository.existsByPhoneNumber(dto.phoneNumber())) {
            throw new OperationNotAllowedException("Phone number already in use: " + dto.phoneNumber());
        }

        Departement departement = departementRepository.findById(dto.departementId())
                .orElseThrow(() -> new ResourceNotFoundException("departement not found with id : " + dto.departementId())) ;
        Role role = roleRepository.findById(dto.roleId())
                .orElseThrow(()-> new ResourceNotFoundException("role not found with id :" + dto.roleId()));
        Position position = positionRepository.findById(dto.positionId())
                .orElseThrow(()-> new ResourceNotFoundException("position not found with id : " +dto.positionId())) ;

        User manager = null;

        if (dto.managerId() != null) {
            manager = userRepository.findById(dto.managerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Manager not found with id : " + dto.managerId()
                    ));
        }

        User user = userMapper.toEntity(dto , departement , role , position) ;
        user.setManager(manager);
        user.setPassword(passwordEncoder.encode(dto.password()));
        User savedUser = userRepository.save(user) ;
        return userMapper.toDto(savedUser) ;

    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("user not found with id : " + id)) ;
        userRepository.delete(user);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RH_MANAGER')")
    @Transactional
    public UserResponseDto updateUser(Long id , UserUpdateRequestDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("user nit found with id :" + id)) ;
        if (dto.firstName() != null) user.setFirstName(dto.firstName());
        if (dto.lastName() != null) user.setLastName(dto.lastName());
        if (dto.phoneNumber() != null) user.setPhoneNumber(dto.phoneNumber());
        if (dto.status() != null) user.setStatus(dto.status());
        if (dto.departementId() != null) {
            Departement departement = departementRepository.findById(dto.departementId())
                    .orElseThrow(() -> new ResourceNotFoundException("depatement not found with id : "+ dto.departementId())) ;
            user.setDepartement(departement);
        }
        if (dto.roleId() != null) {
            Role role = roleRepository.findById(dto.roleId())
                    .orElseThrow(() -> new ResourceNotFoundException("role not found with id :" + dto.roleId())) ;
            user.setRole(role);
        }
        if (dto.positionId() != null) {
            Position position = positionRepository.findById(dto.positionId())
                    .orElseThrow(() -> new ResourceNotFoundException("position not found with id : " + dto.positionId())) ;
            user.setPosition(position);
        }
        if (dto.managerId() != null) {
            User manager = userRepository.findById(dto.managerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Manager not found with id " + dto.managerId()
                    ));

            user.setManager(manager);
        }

        User savedUser = userRepository.save(user) ;
        return userMapper.toDto(savedUser) ;
    }
}
