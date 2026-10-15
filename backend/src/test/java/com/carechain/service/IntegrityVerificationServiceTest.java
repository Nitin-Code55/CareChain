package com.carechain.service;

import com.carechain.dto.IntegrityVerificationResponse;
import com.carechain.entity.*;
import com.carechain.repository.MedicalRecordRepository;
import com.carechain.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class IntegrityVerificationServiceTest {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private IntegrityVerificationService integrityService;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should return VERIFIED when stored file matches original upload hash")
    void testIntegrityVerificationSuccess() {
        User patient = userRepository.findByEmail("patient@carechain.test")
                .orElseThrow(() -> new IllegalStateException("Sample patient not found"));

        byte[] content = "CareChain Diagnostic Laboratory: Normal ECG Findings".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file", "ECG_Test.pdf", "application/pdf", content
        );

        var recordDto = medicalRecordService.uploadRecord(
                file, "Elective ECG Panel", RecordType.LAB_REPORT, "Routine screening", patient, "127.0.0.1"
        );

        IntegrityVerificationResponse result = integrityService.verifyRecordIntegrity(
                recordDto.getId(), patient, "127.0.0.1"
        );

        assertTrue(result.isMatch());
        assertEquals(VerificationResult.VERIFIED, result.getResult());
        assertNotNull(result.getCurrentFileHash());
        assertEquals(recordDto.getSha256Hash(), result.getCurrentFileHash());
    }

    @Test
    @DisplayName("Should return MISMATCH when stored physical file is tampered with on disk")
    void testIntegrityVerificationTamperMismatch() throws Exception {
        User patient = userRepository.findByEmail("patient@carechain.test")
                .orElseThrow(() -> new IllegalStateException("Sample patient not found"));

        byte[] content = "Original lab test values: Cholesterol 180 mg/dL".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file", "Lipid_Panel.pdf", "application/pdf", content
        );

        var recordDto = medicalRecordService.uploadRecord(
                file, "Lipid Panel", RecordType.LAB_REPORT, "Lipid profile", patient, "127.0.0.1"
        );

        MedicalRecord record = medicalRecordRepository.findById(recordDto.getId()).orElseThrow();

        // Tamper with physical file bytes on disk directly
        Path filePath = Paths.get("./uploads/medical-records").resolve(record.getFileStorageName());
        Files.write(filePath, "TAMPERED DATA: Cholesterol 350 mg/dL (Forged)".getBytes(),
                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

        IntegrityVerificationResponse result = integrityService.verifyRecordIntegrity(
                recordDto.getId(), patient, "127.0.0.1"
        );

        assertFalse(result.isMatch());
        assertEquals(VerificationResult.MISMATCH, result.getResult());
        assertNotEquals(recordDto.getSha256Hash(), result.getCurrentFileHash());
    }
}
