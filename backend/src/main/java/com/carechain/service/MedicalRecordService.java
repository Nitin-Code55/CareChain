package com.carechain.service;

import com.carechain.dto.MedicalRecordDto;
import com.carechain.entity.*;
import com.carechain.exception.BadRequestException;
import com.carechain.exception.ResourceNotFoundException;
import com.carechain.repository.MedicalRecordRepository;
import com.carechain.repository.RecordPermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository recordRepository;

    @Autowired
    private RecordPermissionRepository permissionRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private AuditService auditService;

    @Transactional
    public MedicalRecordDto uploadRecord(MultipartFile file, String title, RecordType recordType,
                                        String description, User currentUser, String ipAddress) {
        if (currentUser.getRole() != Role.PATIENT) {
            throw new AccessDeniedException("Only patients can upload their own medical records");
        }

        if (title == null || title.trim().isEmpty()) {
            throw new BadRequestException("Record title is required");
        }
        if (recordType == null) {
            throw new BadRequestException("Record type is required");
        }

        FileStorageService.StoredFileResult fileResult = fileStorageService.storeFile(file);

        MedicalRecord record = new MedicalRecord();
        record.setPatient(currentUser);
        record.setTitle(title.trim());
        record.setRecordType(recordType);
        record.setDescription(description != null ? description.trim() : "");
        record.setFileOriginalName(fileResult.originalFilename());
        record.setFileStorageName(fileResult.storageFilename());
        record.setFileContentType(fileResult.contentType());
        record.setFileSize(fileResult.fileSize());
        record.setSha256Hash(fileResult.sha256Hash());

        MedicalRecord savedRecord = recordRepository.save(record);

        String blockPayload = String.format(
                "{\"action\":\"RECORD_REGISTERED\",\"recordId\":%d,\"patientId\":%d,\"filename\":\"%s\",\"recordType\":\"%s\",\"sha256\":\"%s\",\"size\":%d}",
                savedRecord.getId(),
                currentUser.getId(),
                savedRecord.getFileOriginalName(),
                savedRecord.getRecordType().name(),
                savedRecord.getSha256Hash(),
                savedRecord.getFileSize()
        );

        BlockchainBlock block = blockchainService.addBlock("RECORD_HASH", blockPayload);
        savedRecord.setBlockchainBlockIndex(block.getBlockIndex());
        savedRecord = recordRepository.save(savedRecord);

        auditService.logEvent(
                AuditEventType.RECORD_UPLOAD,
                currentUser,
                savedRecord,
                AuditOutcome.SUCCESS,
                ipAddress,
                String.format("Uploaded '%s' (%s). SHA-256: %s, Anchored in Block #%d",
                        savedRecord.getTitle(), savedRecord.getFileOriginalName(), savedRecord.getSha256Hash(), block.getBlockIndex())
        );

        return mapToDto(savedRecord);
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordDto> getPatientRecords(User patient) {
        return recordRepository.findByPatientOrderByCreatedAtDesc(patient)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordDto> getDoctorAuthorizedRecords(User doctor) {
        if (doctor.getRole() != Role.DOCTOR) {
            throw new AccessDeniedException("Only doctors can access authorized patient records");
        }

        List<RecordPermission> permissions = permissionRepository.findByDoctorAndActiveTrue(doctor);
        List<User> accessiblePatients = permissions.stream()
                .map(RecordPermission::getPatient)
                .distinct()
                .collect(Collectors.toList());

        if (accessiblePatients.isEmpty()) {
            return Collections.emptyList();
        }

        return recordRepository.findByPatientInOrderByCreatedAtDesc(accessiblePatients)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MedicalRecordDto getRecordDetails(Long recordId, User currentUser, String ipAddress) {
        MedicalRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id " + recordId));

        validateAccess(record, currentUser);

        auditService.logEvent(
                AuditEventType.RECORD_ACCESS,
                currentUser,
                record,
                AuditOutcome.SUCCESS,
                ipAddress,
                "Viewed details for record: " + record.getTitle()
        );

        return mapToDto(record);
    }

    @Transactional(readOnly = true)
    public DownloadFileResult downloadRecord(Long recordId, User currentUser, String ipAddress) {
        MedicalRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id " + recordId));

        validateAccess(record, currentUser);

        Resource resource = fileStorageService.loadFileAsResource(record.getFileStorageName());

        auditService.logEvent(
                AuditEventType.RECORD_ACCESS,
                currentUser,
                record,
                AuditOutcome.SUCCESS,
                ipAddress,
                "Downloaded file: " + record.getFileOriginalName()
        );

        return new DownloadFileResult(resource, record.getFileOriginalName(), record.getFileContentType());
    }

    private void validateAccess(MedicalRecord record, User currentUser) {
        if (currentUser.getRole() == Role.PATIENT) {
            if (!record.getPatient().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Access denied: You do not own this medical record");
            }
            return;
        }

        if (currentUser.getRole() == Role.DOCTOR) {
            boolean hasPermission = permissionRepository.existsByPatientAndDoctorAndActiveTrue(
                    record.getPatient(), currentUser
            );
            if (!hasPermission) {
                throw new AccessDeniedException("Access denied: Patient has not granted you active permission for their records");
            }
            return;
        }

        throw new AccessDeniedException("Access denied: Administrators cannot inspect confidential patient medical records");
    }

    public MedicalRecordDto mapToDto(MedicalRecord record) {
        MedicalRecordDto dto = new MedicalRecordDto();
        dto.setId(record.getId());
        dto.setPatientId(record.getPatient().getId());
        dto.setPatientName(record.getPatient().getFullName());
        dto.setPatientEmail(record.getPatient().getEmail());
        dto.setTitle(record.getTitle());
        dto.setRecordType(record.getRecordType());
        dto.setFileOriginalName(record.getFileOriginalName());
        dto.setFileContentType(record.getFileContentType());
        dto.setFileSize(record.getFileSize());
        dto.setSha256Hash(record.getSha256Hash());
        dto.setDescription(record.getDescription());
        dto.setBlockchainBlockIndex(record.getBlockchainBlockIndex());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }

    public record DownloadFileResult(Resource resource, String originalFilename, String contentType) {}
}
