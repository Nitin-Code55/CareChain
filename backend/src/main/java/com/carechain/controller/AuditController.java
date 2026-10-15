package com.carechain.controller;

import com.carechain.dto.AuditEventDto;
import com.carechain.entity.User;
import com.carechain.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditEventDto>> getAllAuditLogs() {
        return ResponseEntity.ok(auditService.getAllAuditLogs());
    }

    @GetMapping("/my")
    public ResponseEntity<List<AuditEventDto>> getMyActivity(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(auditService.getUserActivity(currentUser));
    }
}
