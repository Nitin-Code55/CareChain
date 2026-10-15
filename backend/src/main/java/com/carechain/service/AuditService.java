package com.carechain.service;

import com.carechain.dto.AuditEventDto;
import com.carechain.entity.AuditEvent;
import com.carechain.entity.AuditEventType;
import com.carechain.entity.AuditOutcome;
import com.carechain.entity.MedicalRecord;
import com.carechain.entity.User;
import com.carechain.repository.AuditEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditService {

    @Autowired
    private AuditEventRepository auditRepository;

    @Transactional
    public AuditEvent logEvent(AuditEventType eventType, User performedBy, MedicalRecord record,
                              AuditOutcome outcome, String ipAddress, String details) {
        AuditEvent event = new AuditEvent(eventType, performedBy, record, outcome, ipAddress, details);
        return auditRepository.save(event);
    }

    @Transactional(readOnly = true)
    public List<AuditEventDto> getAllAuditLogs() {
        return auditRepository.findTop50ByOrderByTimestampDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuditEventDto> getUserActivity(User user) {
        return auditRepository.findTop20ByPerformedByOrderByTimestampDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AuditEventDto mapToDto(AuditEvent event) {
        AuditEventDto dto = new AuditEventDto();
        dto.setId(event.getId());
        dto.setEventType(event.getEventType());
        if (event.getPerformedBy() != null) {
            dto.setPerformedById(event.getPerformedBy().getId());
            dto.setPerformedByName(event.getPerformedBy().getFullName());
            dto.setPerformedByEmail(event.getPerformedBy().getEmail());
        }
        if (event.getTargetRecord() != null) {
            dto.setTargetRecordId(event.getTargetRecord().getId());
            dto.setTargetRecordTitle(event.getTargetRecord().getTitle());
        }
        dto.setOutcome(event.getOutcome());
        dto.setIpAddress(event.getIpAddress());
        dto.setDetails(event.getDetails());
        dto.setTimestamp(event.getTimestamp());
        return dto;
    }
}
