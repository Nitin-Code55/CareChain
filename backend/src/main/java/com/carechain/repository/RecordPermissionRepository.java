package com.carechain.repository;

import com.carechain.entity.RecordPermission;
import com.carechain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecordPermissionRepository extends JpaRepository<RecordPermission, Long> {
    List<RecordPermission> findByPatientAndActiveTrue(User patient);
    List<RecordPermission> findByPatientOrderByGrantedAtDesc(User patient);
    List<RecordPermission> findByDoctorAndActiveTrue(User doctor);
    Optional<RecordPermission> findByPatientAndDoctorAndActiveTrue(User patient, User doctor);
    boolean existsByPatientAndDoctorAndActiveTrue(User patient, User doctor);
    long countByPatientAndActiveTrue(User patient);
    long countByDoctorAndActiveTrue(User doctor);
}
