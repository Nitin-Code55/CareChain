package com.carechain.dto;

import java.time.LocalDate;

public class UpdatePatientProfileRequest {

    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String emergencyContact;
    private String address;
    private String allergyNotes;

    public UpdatePatientProfileRequest() {}

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAllergyNotes() {
        return allergyNotes;
    }

    public void setAllergyNotes(String allergyNotes) {
        this.allergyNotes = allergyNotes;
    }
}
