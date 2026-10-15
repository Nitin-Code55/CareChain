package com.carechain.service;

import com.carechain.dto.RecordPermissionDto;
import com.carechain.entity.User;
import com.carechain.repository.RecordPermissionRepository;
import com.carechain.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class PermissionServiceTest {

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private RecordPermissionRepository permissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Patient can grant and immediately revoke access to a doctor")
    void testGrantAndRevokePermission() {
        User patient = userRepository.findByEmail("patient2@carechain.test").orElseThrow();
        User doctor = userRepository.findByEmail("doctor2@carechain.test").orElseThrow();

        // 1. Grant permission
        RecordPermissionDto granted = permissionService.grantPermission(
                doctor.getId(), "Consultation for migraine", patient, "127.0.0.1"
        );
        assertNotNull(granted);
        assertTrue(granted.isActive());
        assertEquals(doctor.getId(), granted.getDoctorId());

        // Verify active in repository
        assertTrue(permissionRepository.existsByPatientAndDoctorAndActiveTrue(patient, doctor));

        // 2. Revoke permission
        permissionService.revokePermission(granted.getId(), patient, "127.0.0.1");

        // Verify immediately inactive
        assertFalse(permissionRepository.existsByPatientAndDoctorAndActiveTrue(patient, doctor));
    }

    @Test
    @DisplayName("Doctor cannot revoke patient's permission")
    void testDoctorCannotRevokePermission() {
        User patient = userRepository.findByEmail("patient@carechain.test").orElseThrow();
        User doctor = userRepository.findByEmail("doctor@carechain.test").orElseThrow();

        var permissions = permissionService.getPatientPermissions(patient);
        assertFalse(permissions.isEmpty());
        Long permId = permissions.get(0).getId();

        assertThrows(AccessDeniedException.class, () -> {
            permissionService.revokePermission(permId, doctor, "127.0.0.1");
        });
    }
}
