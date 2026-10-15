package com.carechain.dto;

import jakarta.validation.constraints.NotNull;

public class GrantPermissionRequest {

    @NotNull(message = "Doctor ID must be provided")
    private Long doctorId;

    private String notes;

    public GrantPermissionRequest() {}

    public GrantPermissionRequest(Long doctorId, String notes) {
        this.doctorId = doctorId;
        this.notes = notes;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
