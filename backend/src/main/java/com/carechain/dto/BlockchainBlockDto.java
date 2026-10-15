package com.carechain.dto;

import java.time.LocalDateTime;

public class BlockchainBlockDto {

    private Long id;
    private Long blockIndex;
    private LocalDateTime timestamp;
    private String transactionType;
    private String transactionPayload;
    private String previousHash;
    private String currentHash;
    private Long nonce;
    private boolean valid;

    public BlockchainBlockDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBlockIndex() {
        return blockIndex;
    }

    public void setBlockIndex(Long blockIndex) {
        this.blockIndex = blockIndex;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getTransactionPayload() {
        return transactionPayload;
    }

    public void setTransactionPayload(String transactionPayload) {
        this.transactionPayload = transactionPayload;
    }

    public String getPreviousHash() {
        return previousHash;
    }

    public void setPreviousHash(String previousHash) {
        this.previousHash = previousHash;
    }

    public String getCurrentHash() {
        return currentHash;
    }

    public void setCurrentHash(String currentHash) {
        this.currentHash = currentHash;
    }

    public Long getNonce() {
        return nonce;
    }

    public void setNonce(Long nonce) {
        this.nonce = nonce;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
