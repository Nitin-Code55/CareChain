package com.carechain.service;

import com.carechain.dto.IntegrityVerificationResponse;
import com.carechain.entity.*;
import com.carechain.exception.BadRequestException;
import com.carechain.exception.ResourceNotFoundException;
import com.carechain.repository.BlockchainBlockRepository;
import com.carechain.repository.MedicalRecordRepository;
import com.carechain.repository.RecordPermissionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class IntegrityVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(IntegrityVerificationService.class);

    @Autowired
    private MedicalRecordRepository recordRepository;

    @Autowired
    private RecordPermissionRepository permissionRepository;

    @Autowired
    private BlockchainBlockRepository blockRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AuditService auditService;

    @Transactional
    public IntegrityVerificationResponse verifyRecordIntegrity(Long recordId, User currentUser, String ipAddress) {
        MedicalRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id " + recordId));

        boolean isOwner = record.getPatient().getId().equals(currentUser.getId());
        boolean isAuthorizedDoctor = false;

        if (!isOwner && currentUser.getRole() == Role.DOCTOR) {
            isAuthorizedDoctor = permissionRepository.existsByPatientAndDoctorAndActiveTrue(record.getPatient(), currentUser);
        }

        if (!isOwner && !isAuthorizedDoctor) {
            throw new AccessDeniedException("You are not authorized to verify or view this medical record.");
        }

        IntegrityVerificationResponse response = new IntegrityVerificationResponse();
        response.setRecordId(record.getId());
        response.setRecordTitle(record.getTitle());
        response.setFilename(record.getFileOriginalName());
        response.setOriginalHash(record.getSha256Hash());
        response.setVerifiedAt(LocalDateTime.now());

        String blockchainRegisteredHash = record.getSha256Hash();
        if (record.getBlockchainBlockIndex() != null) {
            Optional<BlockchainBlock> blockOpt = blockRepository.findByBlockIndex(record.getBlockchainBlockIndex());
            if (blockOpt.isPresent()) {
                String payload = blockOpt.get().getTransactionPayload();
                if (payload.contains("\"sha256\":\"")) {
                    int start = payload.indexOf("\"sha256\":\"") + 10;
                    int end = payload.indexOf("\"", start);
                    if (end > start) {
                        blockchainRegisteredHash = payload.substring(start, end);
                    }
                }
            }
        }
        response.setBlockchainHash(blockchainRegisteredHash);

        try {
            byte[] physicalBytes = fileStorageService.loadFileBytes(record.getFileStorageName());

            if (physicalBytes == null) {
                response.setResult(VerificationResult.FILE_MISSING);
                response.setMatch(false);
                response.setCurrentFileHash(null);
                response.setMessage("Physical file is missing from server storage location");

                auditService.logEvent(
                        AuditEventType.INTEGRITY_VERIFY,
                        currentUser,
                        record,
                        AuditOutcome.FAILURE,
                        ipAddress,
                        "Integrity verification failed: Physical file missing on disk"
                );
                return response;
            }

            String currentLiveHash = fileStorageService.calculateSha256(physicalBytes);
            response.setCurrentFileHash(currentLiveHash);

            boolean matchesDb = currentLiveHash.equalsIgnoreCase(record.getSha256Hash());
            boolean matchesBlockchain = currentLiveHash.equalsIgnoreCase(blockchainRegisteredHash);

            if (matchesDb && matchesBlockchain) {
                response.setResult(VerificationResult.VERIFIED);
                response.setMatch(true);
                response.setMessage("Document authentic. Live physical file hash matches database and blockchain ledger.");

                auditService.logEvent(
                        AuditEventType.INTEGRITY_VERIFY,
                        currentUser,
                        record,
                        AuditOutcome.SUCCESS,
                        ipAddress,
                        "SHA-256 integrity verified successfully. Hash: " + currentLiveHash
                );
            } else {
                response.setResult(VerificationResult.MISMATCH);
                response.setMatch(false);
                response.setMessage("TAMPERING DETECTED! Physical file hash does not match original blockchain record.");

                auditService.logEvent(
                        AuditEventType.INTEGRITY_VERIFY,
                        currentUser,
                        record,
                        AuditOutcome.MISMATCH,
                        ipAddress,
                        String.format("TAMPER ALERT: Expected [%s], calculated [%s]", record.getSha256Hash(), currentLiveHash)
                );
            }

            return response;

        } catch (IOException e) {
            logger.error("IO error reading record file for verification", e);
            throw new BadRequestException("Error reading file during integrity verification: " + e.getMessage());
        }
    }
}
