package com.araiedh.rh_absenteisme.controller;


import com.araiedh.rh_absenteisme.dto.UserRequestDto;
import com.araiedh.rh_absenteisme.dto.UserResponseDto;
import com.araiedh.rh_absenteisme.dto.UserUpdateRequestDto;
import com.araiedh.rh_absenteisme.entity.User;
import com.araiedh.rh_absenteisme.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService ;


    @GetMapping
    public List<UserResponseDto> getAllUser() {
        return userService.getAllUser() ;
    }

    @GetMapping("/{id}")
    public UserResponseDto getUser (@PathVariable Long id) {
        return userService.getUserById(id) ;
    }


    @PostMapping
    public UserResponseDto createUser(@RequestBody UserRequestDto dto) {
        return userService.createUser(dto) ;
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id) ;
    }

    @PatchMapping("/{id}")
    public UserResponseDto updateUser (@PathVariable Long id , @RequestBody UserUpdateRequestDto dto) {
        return userService.updateUser(id , dto) ;
    }
}
