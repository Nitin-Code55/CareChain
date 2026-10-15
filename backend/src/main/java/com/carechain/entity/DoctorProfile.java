package com.carechain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctor_profiles")
public class DoctorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String specialization;

    @Column(length = 50)
    private String licenseNumber;

    @Column(length = 150)
    private String hospitalAffiliation;

    @Column(columnDefinition = "TEXT")
    private String bio;

    public DoctorProfile() {}

    public DoctorProfile(User user, String specialization, String licenseNumber, String hospitalAffiliation) {
        this.user = user;
        this.specialization = specialization;
        this.licenseNumber = licenseNumber;
        this.hospitalAffiliation = hospitalAffiliation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getHospitalAffiliation() {
        return hospitalAffiliation;
    }

    public void setHospitalAffiliation(String hospitalAffiliation) {
        this.hospitalAffiliation = hospitalAffiliation;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
