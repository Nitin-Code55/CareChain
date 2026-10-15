package com.carechain.dto;

import com.carechain.entity.VerificationResult;
import java.time.LocalDateTime;

public class IntegrityVerificationResponse {

    private Long recordId;
    private String recordTitle;
    private String filename;
    private VerificationResult result;
    private boolean match;
    private String originalHash;
    private String currentFileHash;
    private String blockchainHash;
    private LocalDateTime verifiedAt;
    private String message;

    public IntegrityVerificationResponse() {}

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public String getRecordTitle() {
        return recordTitle;
    }

    public void setRecordTitle(String recordTitle) {
        this.recordTitle = recordTitle;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public VerificationResult getResult() {
        return result;
    }

    public void setResult(VerificationResult result) {
        this.result = result;
    }

    public boolean isMatch() {
        return match;
    }

    public void setMatch(boolean match) {
        this.match = match;
    }

    public String getOriginalHash() {
        return originalHash;
    }

    public void setOriginalHash(String originalHash) {
        this.originalHash = originalHash;
    }

    public String getCurrentFileHash() {
        return currentFileHash;
    }

    public void setCurrentFileHash(String currentFileHash) {
        this.currentFileHash = currentFileHash;
    }

    public String getBlockchainHash() {
        return blockchainHash;
    }

    public void setBlockchainHash(String blockchainHash) {
        this.blockchainHash = blockchainHash;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
