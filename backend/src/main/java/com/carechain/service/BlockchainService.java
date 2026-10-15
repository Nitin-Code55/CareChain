package com.carechain.service;

import com.carechain.dto.BlockchainBlockDto;
import com.carechain.dto.ChainVerificationResponse;
import com.carechain.entity.BlockchainBlock;
import com.carechain.repository.BlockchainBlockRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Local Java-based Blockchain Simulation.
 * Persists blocks in the database so the ledger survives application restarts.
 * Links each block to the previous block hash via SHA-256.
 * Note: Academic simulation representing distributed ledger concepts.
 */
@Service
public class BlockchainService {

    private static final Logger logger = LoggerFactory.getLogger(BlockchainService.class);
    private static final String GENESIS_PREV_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Autowired
    private BlockchainBlockRepository blockRepository;

    @PostConstruct
    public void initialize() {
        if (blockRepository.count() == 0) {
            createGenesisBlock();
        }
    }

    @Transactional
    public synchronized BlockchainBlock createGenesisBlock() {
        if (blockRepository.count() > 0) {
            return blockRepository.findAllByOrderByBlockIndexAsc().get(0);
        }

        LocalDateTime timestamp = LocalDateTime.now();
        String transactionType = "GENESIS";
        String payload = "{\"message\":\"CareChain Genesis Block - Decentralized Healthcare EHR Ledger Initialized\",\"version\":\"1.0\"}";
        Long nonce = 0L;

        String hash = calculateHash(0L, timestamp, transactionType, payload, GENESIS_PREV_HASH, nonce);

        BlockchainBlock genesis = new BlockchainBlock(
                0L,
                timestamp,
                transactionType,
                payload,
                GENESIS_PREV_HASH,
                hash,
                nonce
        );

        BlockchainBlock saved = blockRepository.save(genesis);
        logger.info("Genesis block #0 created with hash: {}", saved.getCurrentHash());
        return saved;
    }

    @Transactional
    public synchronized BlockchainBlock addBlock(String transactionType, String transactionPayload) {
        BlockchainBlock latestBlock = blockRepository.findTopByOrderByBlockIndexDesc()
                .orElseGet(this::createGenesisBlock);

        Long newIndex = latestBlock.getBlockIndex() + 1;
        LocalDateTime timestamp = LocalDateTime.now();
        String prevHash = latestBlock.getCurrentHash();
        Long nonce = 0L;

        String currentHash = calculateHash(newIndex, timestamp, transactionType, transactionPayload, prevHash, nonce);

        BlockchainBlock newBlock = new BlockchainBlock(
                newIndex,
                timestamp,
                transactionType,
                transactionPayload,
                prevHash,
                currentHash,
                nonce
        );

        BlockchainBlock saved = blockRepository.save(newBlock);
        logger.info("New block #{} [{}] appended to blockchain ledger with hash: {}",
                saved.getBlockIndex(), saved.getTransactionType(), saved.getCurrentHash());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<BlockchainBlockDto> getAllBlocks() {
        List<BlockchainBlock> blocks = blockRepository.findAllByOrderByBlockIndexAsc();
        return blocks.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChainVerificationResponse verifyChain() {
        List<BlockchainBlock> chain = blockRepository.findAllByOrderByBlockIndexAsc();

        if (chain.isEmpty()) {
            return new ChainVerificationResponse(
                    true, 0, "Blockchain ledger is empty (no blocks to verify).", null, null, null
            );
        }

        // Verify Genesis Block (#0)
        BlockchainBlock genesis = chain.get(0);
        if (genesis.getBlockIndex() != 0L) {
            return new ChainVerificationResponse(
                    false, chain.size(), "Genesis block index must be 0", genesis.getCurrentHash(), 0L, "Invalid index"
            );
        }
        if (!GENESIS_PREV_HASH.equals(genesis.getPreviousHash())) {
            return new ChainVerificationResponse(
                    false, chain.size(), "Genesis previous hash mismatch", genesis.getCurrentHash(), 0L, "Invalid genesis previous hash"
            );
        }

        String calculatedGenesisHash = calculateHash(
                genesis.getBlockIndex(),
                genesis.getTimestamp(),
                genesis.getTransactionType(),
                genesis.getTransactionPayload(),
                genesis.getPreviousHash(),
                genesis.getNonce()
        );
        if (!calculatedGenesisHash.equals(genesis.getCurrentHash())) {
            return new ChainVerificationResponse(
                    false, chain.size(), "Genesis block data has been altered/tampered with",
                    genesis.getCurrentHash(), 0L, "Genesis hash mismatch"
            );
        }

        // Verify subsequent blocks
        for (int i = 1; i < chain.size(); i++) {
            BlockchainBlock current = chain.get(i);
            BlockchainBlock previous = chain.get(i - 1);

            // 1. Verify previous hash pointer
            if (!current.getPreviousHash().equals(previous.getCurrentHash())) {
                return new ChainVerificationResponse(
                        false, chain.size(),
                        String.format("Chain link broken between Block #%d and Block #%d. Expected prevHash [%s] but found [%s]",
                                previous.getBlockIndex(), current.getBlockIndex(), previous.getCurrentHash(), current.getPreviousHash()),
                        current.getCurrentHash(), current.getBlockIndex(), "Broken previous hash pointer"
                );
            }

            // 2. Recalculate and verify current block hash
            String recomputedHash = calculateHash(
                    current.getBlockIndex(),
                    current.getTimestamp(),
                    current.getTransactionType(),
                    current.getTransactionPayload(),
                    current.getPreviousHash(),
                    current.getNonce()
            );

            if (!recomputedHash.equals(current.getCurrentHash())) {
                return new ChainVerificationResponse(
                        false, chain.size(),
                        String.format("Block #%d content has been modified or corrupted. Expected hash [%s] but recomputed [%s]",
                                current.getBlockIndex(), current.getCurrentHash(), recomputedHash),
                        current.getCurrentHash(), current.getBlockIndex(), "Recomputed hash mismatch"
                );
            }
        }

        String latestHash = chain.get(chain.size() - 1).getCurrentHash();
        return new ChainVerificationResponse(
                true, chain.size(),
                String.format("All %d blocks cryptographically verified. Previous hash links and SHA-256 signatures are intact.", chain.size()),
                latestHash, null, null
        );
    }

    public String calculateHash(Long index, LocalDateTime timestamp, String transactionType,
                                String payload, String prevHash, Long nonce) {
        try {
            String dataToHash = index + ":" +
                    timestamp.format(ISO_FORMATTER) + ":" +
                    transactionType + ":" +
                    payload + ":" +
                    prevHash + ":" +
                    nonce;

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(dataToHash.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public BlockchainBlockDto mapToDto(BlockchainBlock block) {
        BlockchainBlockDto dto = new BlockchainBlockDto();
        dto.setId(block.getId());
        dto.setBlockIndex(block.getBlockIndex());
        dto.setTimestamp(block.getTimestamp());
        dto.setTransactionType(block.getTransactionType());
        dto.setTransactionPayload(block.getTransactionPayload());
        dto.setPreviousHash(block.getPreviousHash());
        dto.setCurrentHash(block.getCurrentHash());
        dto.setNonce(block.getNonce());

        String recomputed = calculateHash(
                block.getBlockIndex(),
                block.getTimestamp(),
                block.getTransactionType(),
                block.getTransactionPayload(),
                block.getPreviousHash(),
                block.getNonce()
        );
        dto.setValid(recomputed.equals(block.getCurrentHash()));
        return dto;
    }
}
