package com.carechain.repository;

import com.carechain.entity.DoctorProfile;
import com.carechain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUser(User user);
    Optional<DoctorProfile> findByUserId(Long userId);
}
