package com.carechain.controller;

import com.carechain.dto.LoginRequest;
import com.carechain.dto.RegisterRequest;
import com.carechain.entity.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Valid login should return JWT token and user info")
    void testSuccessfulLogin() throws Exception {
        LoginRequest req = new LoginRequest("patient@carechain.test", "Patient123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.email").value("patient@carechain.test"))
                .andExpect(jsonPath("$.user.role").value("PATIENT"));
    }

    @Test
    @DisplayName("Invalid password should return 401 Unauthorized")
    void testFailedLogin() throws Exception {
        LoginRequest req = new LoginRequest("patient@carechain.test", "WrongPassword!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Public registration as ADMIN must be rejected with 400 Bad Request")
    void testAdminRegistrationRejected() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("hacker@malicious.test");
        req.setPassword("Secret123!");
        req.setFullName("Fake Admin");
        req.setRole(Role.ADMIN);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Public registration as PATIENT should succeed")
    void testPatientRegistration() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("newpatient@test.com");
        req.setPassword("SecurePass123!");
        req.setFullName("John Doe");
        req.setRole(Role.PATIENT);
        req.setBloodGroup("B+");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.email").value("newpatient@test.com"));
    }
}
