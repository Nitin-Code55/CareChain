package com.carechain.controller;

import com.carechain.dto.AdminStatsResponse;
import com.carechain.dto.ChainVerificationResponse;
import com.carechain.dto.UserDto;
import com.carechain.entity.Role;
import com.carechain.repository.AuditEventRepository;
import com.carechain.repository.BlockchainBlockRepository;
import com.carechain.repository.MedicalRecordRepository;
import com.carechain.repository.RecordPermissionRepository;
import com.carechain.repository.UserRepository;
import com.carechain.service.BlockchainService;
import com.carechain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private BlockchainBlockRepository blockRepository;

    @Autowired
    private RecordPermissionRepository permissionRepository;

    @Autowired
    private AuditEventRepository auditEventRepository;

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private UserService userService;

    @GetMapping("/statistics")
    public ResponseEntity<AdminStatsResponse> getStatistics() {
        AdminStatsResponse stats = new AdminStatsResponse();
        stats.setTotalPatients(userRepository.countByRole(Role.PATIENT));
        stats.setTotalDoctors(userRepository.countByRole(Role.DOCTOR));
        stats.setTotalRecords(medicalRecordRepository.count());
        stats.setTotalBlocks(blockRepository.count());
        stats.setTotalPermissions(permissionRepository.count());
        stats.setTotalAuditEvents(auditEventRepository.count());

        ChainVerificationResponse chainCheck = blockchainService.verifyChain();
        stats.setChainValid(chainCheck.isValid());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
