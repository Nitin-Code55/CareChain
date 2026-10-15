package com.carechain.dto;

import com.carechain.entity.Role;
import java.time.LocalDateTime;

public class UserDto {

    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;
    private PatientProfileDto patientProfile;
    private DoctorProfileDto doctorProfile;

    public UserDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public PatientProfileDto getPatientProfile() {
        return patientProfile;
    }

    public void setPatientProfile(PatientProfileDto patientProfile) {
        this.patientProfile = patientProfile;
    }

    public DoctorProfileDto getDoctorProfile() {
        return doctorProfile;
    }

    public void setDoctorProfile(DoctorProfileDto doctorProfile) {
        this.doctorProfile = doctorProfile;
    }
}
