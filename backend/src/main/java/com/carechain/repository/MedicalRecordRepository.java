package com.carechain.repository;

import com.carechain.entity.MedicalRecord;
import com.carechain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientOrderByCreatedAtDesc(User patient);
    List<MedicalRecord> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<MedicalRecord> findByPatientInOrderByCreatedAtDesc(Collection<User> patients);
    long countByPatient(User patient);
    Optional<MedicalRecord> findBySha256Hash(String sha256Hash);
}
