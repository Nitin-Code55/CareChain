package com.carechain.controller;

import com.carechain.dto.IntegrityVerificationResponse;
import com.carechain.dto.MedicalRecordDto;
import com.carechain.entity.RecordType;
import com.carechain.entity.User;
import com.carechain.service.IntegrityVerificationService;
import com.carechain.service.MedicalRecordService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private IntegrityVerificationService integrityService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MedicalRecordDto> uploadRecord(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("recordType") RecordType recordType,
            @RequestParam(value = "description", required = false) String description,
            @AuthenticationPrincipal User currentUser,
            HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        MedicalRecordDto dto = medicalRecordService.uploadRecord(file, title, recordType, description, currentUser, ip);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecordDto>> getPatientRecords(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(medicalRecordService.getPatientRecords(currentUser));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<MedicalRecordDto>> getDoctorAuthorizedRecords(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(medicalRecordService.getDoctorAuthorizedRecords(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordDto> getRecordDetails(@PathVariable Long id,
                                                             @AuthenticationPrincipal User currentUser,
                                                             HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        return ResponseEntity.ok(medicalRecordService.getRecordDetails(id, currentUser, ip));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadRecord(@PathVariable Long id,
                                                   @AuthenticationPrincipal User currentUser,
                                                   HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        MedicalRecordService.DownloadFileResult result = medicalRecordService.downloadRecord(id, currentUser, ip);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(result.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + result.originalFilename() + "\"")
                .body(result.resource());
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<IntegrityVerificationResponse> verifyIntegrity(@PathVariable Long id,
                                                                         @AuthenticationPrincipal User currentUser,
                                                                         HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        return ResponseEntity.ok(integrityService.verifyRecordIntegrity(id, currentUser, ip));
    }
}
