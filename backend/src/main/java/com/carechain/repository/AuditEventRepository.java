package com.carechain.repository;

import com.carechain.entity.AuditEvent;
import com.carechain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findAllByOrderByTimestampDesc();
    List<AuditEvent> findTop50ByOrderByTimestampDesc();
    List<AuditEvent> findByPerformedByOrderByTimestampDesc(User performedBy);
    List<AuditEvent> findTop20ByPerformedByOrderByTimestampDesc(User performedBy);
}
