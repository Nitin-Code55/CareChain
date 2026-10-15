package com.carechain.dto;

public class AdminStatsResponse {

    private long totalPatients;
    private long totalDoctors;
    private long totalRecords;
    private long totalBlocks;
    private long totalPermissions;
    private long totalAuditEvents;
    private boolean chainValid;

    public AdminStatsResponse() {}

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(long totalRecords) {
        this.totalRecords = totalRecords;
    }

    public long getTotalBlocks() {
        return totalBlocks;
    }

    public void setTotalBlocks(long totalBlocks) {
        this.totalBlocks = totalBlocks;
    }

    public long getTotalPermissions() {
        return totalPermissions;
    }

    public void setTotalPermissions(long totalPermissions) {
        this.totalPermissions = totalPermissions;
    }

    public long getTotalAuditEvents() {
        return totalAuditEvents;
    }

    public void setTotalAuditEvents(long totalAuditEvents) {
        this.totalAuditEvents = totalAuditEvents;
    }

    public boolean isChainValid() {
        return chainValid;
    }

    public void setChainValid(boolean chainValid) {
        this.chainValid = chainValid;
    }
}
