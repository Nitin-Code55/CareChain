package com.carechain.controller;

import com.carechain.dto.UpdateDoctorProfileRequest;
import com.carechain.dto.UpdatePatientProfileRequest;
import com.carechain.dto.UserDto;
import com.carechain.entity.User;
import com.carechain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getUserProfile(currentUser));
    }

    @PutMapping("/patient/profile")
    public ResponseEntity<UserDto> updatePatientProfile(@AuthenticationPrincipal User currentUser,
                                                        @RequestBody UpdatePatientProfileRequest request) {
        return ResponseEntity.ok(userService.updatePatientProfile(currentUser, request));
    }

    @PutMapping("/doctor/profile")
    public ResponseEntity<UserDto> updateDoctorProfile(@AuthenticationPrincipal User currentUser,
                                                       @RequestBody UpdateDoctorProfileRequest request) {
        return ResponseEntity.ok(userService.updateDoctorProfile(currentUser, request));
    }
}
