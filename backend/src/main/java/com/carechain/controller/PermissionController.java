package com.carechain.controller;

import com.carechain.dto.GrantPermissionRequest;
import com.carechain.dto.RecordPermissionDto;
import com.carechain.dto.UserDto;
import com.carechain.entity.User;
import com.carechain.service.PermissionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @GetMapping("/doctors")
    public ResponseEntity<List<UserDto>> getAvailableDoctors() {
        return ResponseEntity.ok(permissionService.getAvailableDoctors());
    }

    @GetMapping
    public ResponseEntity<List<RecordPermissionDto>> getMyPermissions(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(permissionService.getPatientPermissions(currentUser));
    }

    @PostMapping
    public ResponseEntity<RecordPermissionDto> grantPermission(@Valid @RequestBody GrantPermissionRequest request,
                                                               @AuthenticationPrincipal User currentUser,
                                                               HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        RecordPermissionDto dto = permissionService.grantPermission(
                request.getDoctorId(), request.getNotes(), currentUser, ip
        );
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> revokePermission(@PathVariable Long id,
                                                                @AuthenticationPrincipal User currentUser,
                                                                HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        permissionService.revokePermission(id, currentUser, ip);
        return ResponseEntity.ok(Map.of("success", true, "message", "Permission revoked successfully"));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<UserDto>> getAccessiblePatients(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(permissionService.getAccessiblePatients(currentUser));
    }
}
