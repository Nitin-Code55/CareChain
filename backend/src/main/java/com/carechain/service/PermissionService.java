package com.carechain.service;

import com.carechain.dto.RecordPermissionDto;
import com.carechain.dto.UserDto;
import com.carechain.entity.*;
import com.carechain.exception.BadRequestException;
import com.carechain.exception.ResourceNotFoundException;
import com.carechain.repository.DoctorProfileRepository;
import com.carechain.repository.RecordPermissionRepository;
import com.carechain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PermissionService {

    @Autowired
    private RecordPermissionRepository permissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private UserService userService;

    @Transactional(readOnly = true)
    public List<UserDto> getAvailableDoctors() {
        return userRepository.findByRole(Role.DOCTOR)
                .stream()
                .filter(User::isActive)
                .map(userService::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecordPermissionDto> getPatientPermissions(User patient) {
        if (patient.getRole() != Role.PATIENT) {
            throw new AccessDeniedException("Only patients can inspect granted access permissions");
        }
        return permissionRepository.findByPatientOrderByGrantedAtDesc(patient)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RecordPermissionDto grantPermission(Long doctorId, String notes, User patient, String ipAddress) {
        if (patient.getRole() != Role.PATIENT) {
            throw new AccessDeniedException("Only patients can grant access permissions");
        }

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id " + doctorId));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new BadRequestException("Target user is not registered as a doctor");
        }

        Optional<RecordPermission> existingOpt = permissionRepository.findByPatientAndDoctorAndActiveTrue(patient, doctor);
        if (existingOpt.isPresent()) {
            return mapToDto(existingOpt.get());
        }

        RecordPermission permission = new RecordPermission(patient, doctor, notes);
        RecordPermission saved = permissionRepository.save(permission);

        String blockPayload = String.format(
                "{\"action\":\"PERMISSION_GRANTED\",\"permissionId\":%d,\"patientId\":%d,\"doctorId\":%d,\"patientName\":\"%s\",\"doctorName\":\"%s\",\"timestamp\":\"%s\"}",
                saved.getId(),
                patient.getId(),
                doctor.getId(),
                patient.getFullName(),
                doctor.getFullName(),
                saved.getGrantedAt()
        );
        blockchainService.addBlock("PERMISSION_GRANT", blockPayload);

        auditService.logEvent(
                AuditEventType.PERMISSION_GRANT,
                patient,
                null,
                AuditOutcome.SUCCESS,
                ipAddress,
                String.format("Granted record access to Dr. %s (ID: %d)", doctor.getFullName(), doctor.getId())
        );

        return mapToDto(saved);
    }

    @Transactional
    public void revokePermission(Long permissionId, User patient, String ipAddress) {
        if (patient.getRole() != Role.PATIENT) {
            throw new AccessDeniedException("Only patients can revoke access permissions");
        }

        RecordPermission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission record not found with id " + permissionId));

        if (!permission.getPatient().getId().equals(patient.getId())) {
            throw new AccessDeniedException("You do not own this permission grant");
        }

        permission.setActive(false);
        permission.setRevokedAt(LocalDateTime.now());
        permissionRepository.save(permission);

        String blockPayload = String.format(
                "{\"action\":\"PERMISSION_REVOKED\",\"permissionId\":%d,\"patientId\":%d,\"doctorId\":%d,\"revokedAt\":\"%s\"}",
                permission.getId(),
                patient.getId(),
                permission.getDoctor().getId(),
                permission.getRevokedAt()
        );
        blockchainService.addBlock("PERMISSION_REVOCATION", blockPayload);

        auditService.logEvent(
                AuditEventType.PERMISSION_REVOKE,
                patient,
                null,
                AuditOutcome.SUCCESS,
                ipAddress,
                String.format("Revoked record access from Dr. %s (ID: %d)",
                        permission.getDoctor().getFullName(), permission.getDoctor().getId())
        );
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAccessiblePatients(User doctor) {
        if (doctor.getRole() != Role.DOCTOR) {
            throw new AccessDeniedException("Only doctors can inspect accessible patient lists");
        }

        List<RecordPermission> permissions = permissionRepository.findByDoctorAndActiveTrue(doctor);
        return permissions.stream()
                .map(RecordPermission::getPatient)
                .distinct()
                .map(userService::mapToDto)
                .collect(Collectors.toList());
    }

    public RecordPermissionDto mapToDto(RecordPermission perm) {
        RecordPermissionDto dto = new RecordPermissionDto();
        dto.setId(perm.getId());
        dto.setPatientId(perm.getPatient().getId());
        dto.setPatientName(perm.getPatient().getFullName());
        dto.setPatientEmail(perm.getPatient().getEmail());
        dto.setDoctorId(perm.getDoctor().getId());
        dto.setDoctorName(perm.getDoctor().getFullName());
        dto.setDoctorEmail(perm.getDoctor().getEmail());

        doctorProfileRepository.findByUser(perm.getDoctor()).ifPresent(dp -> {
            dto.setDoctorSpecialization(dp.getSpecialization());
            dto.setHospitalAffiliation(dp.getHospitalAffiliation());
        });

        dto.setActive(perm.isActive());
        dto.setGrantedAt(perm.getGrantedAt());
        dto.setRevokedAt(perm.getRevokedAt());
        dto.setNotes(perm.getNotes());
        return dto;
    }
}
