package com.carechain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_blocks", indexes = {
    @Index(name = "idx_block_index", columnList = "blockIndex", unique = true),
    @Index(name = "idx_block_hash", columnList = "currentHash", unique = true)
})
public class BlockchainBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long blockIndex;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false, length = 50)
    private String transactionType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String transactionPayload;

    @Column(nullable = false, length = 64)
    private String previousHash;

    @Column(nullable = false, unique = true, length = 64)
    private String currentHash;

    @Column(nullable = false)
    private Long nonce = 0L;

    public BlockchainBlock() {}

    public BlockchainBlock(Long blockIndex, LocalDateTime timestamp, String transactionType,
                           String transactionPayload, String previousHash, String currentHash, Long nonce) {
        this.blockIndex = blockIndex;
        this.timestamp = timestamp;
        this.transactionType = transactionType;
        this.transactionPayload = transactionPayload;
        this.previousHash = previousHash;
        this.currentHash = currentHash;
        this.nonce = nonce;
    }

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
}
