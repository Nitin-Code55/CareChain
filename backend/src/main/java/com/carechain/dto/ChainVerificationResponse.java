package com.carechain.dto;

import java.time.LocalDateTime;

public class ChainVerificationResponse {

    private boolean valid;
    private int totalBlocks;
    private String message;
    private LocalDateTime verifiedAt;
    private String latestBlockHash;
    private Long brokenBlockIndex;
    private String brokenReason;

    public ChainVerificationResponse() {}

    public ChainVerificationResponse(boolean valid, int totalBlocks, String message,
                                   String latestBlockHash, Long brokenBlockIndex, String brokenReason) {
        this.valid = valid;
        this.totalBlocks = totalBlocks;
        this.message = message;
        this.verifiedAt = LocalDateTime.now();
        this.latestBlockHash = latestBlockHash;
        this.brokenBlockIndex = brokenBlockIndex;
        this.brokenReason = brokenReason;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public int getTotalBlocks() {
        return totalBlocks;
    }

    public void setTotalBlocks(int totalBlocks) {
        this.totalBlocks = totalBlocks;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getLatestBlockHash() {
        return latestBlockHash;
    }

    public void setLatestBlockHash(String latestBlockHash) {
        this.latestBlockHash = latestBlockHash;
    }

    public Long getBrokenBlockIndex() {
        return brokenBlockIndex;
    }

    public void setBrokenBlockIndex(Long brokenBlockIndex) {
        this.brokenBlockIndex = brokenBlockIndex;
    }

    public String getBrokenReason() {
        return brokenReason;
    }

    public void setBrokenReason(String brokenReason) {
        this.brokenReason = brokenReason;
    }
}
