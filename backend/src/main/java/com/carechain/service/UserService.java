package com.carechain.service;

import com.carechain.dto.*;
import com.carechain.entity.*;
import com.carechain.repository.DoctorProfileRepository;
import com.carechain.repository.PatientProfileRepository;
import com.carechain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Transactional(readOnly = true)
    public UserDto getUserProfile(User user) {
        return mapToDto(user);
    }

    @Transactional
    public UserDto updatePatientProfile(User user, UpdatePatientProfileRequest request) {
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        PatientProfile profile = patientProfileRepository.findByUser(user)
                .orElseGet(() -> new PatientProfile(user));

        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getBloodGroup() != null) profile.setBloodGroup(request.getBloodGroup());
        if (request.getEmergencyContact() != null) profile.setEmergencyContact(request.getEmergencyContact());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getAllergyNotes() != null) profile.setAllergyNotes(request.getAllergyNotes());

        patientProfileRepository.save(profile);
        return mapToDto(user);
    }

    @Transactional
    public UserDto updateDoctorProfile(User user, UpdateDoctorProfileRequest request) {
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        DoctorProfile profile = doctorProfileRepository.findByUser(user)
                .orElseGet(() -> new DoctorProfile(user, "General Practice", "LIC-000", "General Hospital"));

        if (request.getSpecialization() != null) profile.setSpecialization(request.getSpecialization());
        if (request.getLicenseNumber() != null) profile.setLicenseNumber(request.getLicenseNumber());
        if (request.getHospitalAffiliation() != null) profile.setHospitalAffiliation(request.getHospitalAffiliation());
        if (request.getBio() != null) profile.setBio(request.getBio());

        doctorProfileRepository.save(profile);
        return mapToDto(user);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getRole() == Role.PATIENT) {
            patientProfileRepository.findByUser(user).ifPresent(p -> {
                PatientProfileDto pDto = new PatientProfileDto();
                pDto.setId(p.getId());
                pDto.setDateOfBirth(p.getDateOfBirth());
                pDto.setGender(p.getGender());
                pDto.setBloodGroup(p.getBloodGroup());
                pDto.setEmergencyContact(p.getEmergencyContact());
                pDto.setAddress(p.getAddress());
                pDto.setAllergyNotes(p.getAllergyNotes());
                dto.setPatientProfile(pDto);
            });
        } else if (user.getRole() == Role.DOCTOR) {
            doctorProfileRepository.findByUser(user).ifPresent(d -> {
                DoctorProfileDto dDto = new DoctorProfileDto();
                dDto.setId(d.getId());
                dDto.setSpecialization(d.getSpecialization());
                dDto.setLicenseNumber(d.getLicenseNumber());
                dDto.setHospitalAffiliation(d.getHospitalAffiliation());
                dDto.setBio(d.getBio());
                dto.setDoctorProfile(dDto);
            });
        }

        return dto;
    }
}
