package com.carechain.controller;

import com.carechain.dto.AuthResponse;
import com.carechain.dto.LoginRequest;
import com.carechain.dto.RegisterRequest;
import com.carechain.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                              HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        AuthResponse response = authService.login(request, ip);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                                 HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        AuthResponse response = authService.register(request, ip);
        return ResponseEntity.ok(response);
    }
}
