package com.carechain.service;

import com.carechain.dto.ChainVerificationResponse;
import com.carechain.entity.BlockchainBlock;
import com.carechain.repository.BlockchainBlockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class BlockchainServiceTest {

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private BlockchainBlockRepository blockRepository;

    @BeforeEach
    void setUp() {
        if (blockRepository.count() == 0) {
            blockchainService.createGenesisBlock();
        }
    }

    @Test
    @DisplayName("Should create valid Genesis Block at index 0")
    void testGenesisBlockCreation() {
        List<BlockchainBlock> blocks = blockRepository.findAllByOrderByBlockIndexAsc();
        assertFalse(blocks.isEmpty(), "Chain should contain at least Genesis block");

        BlockchainBlock genesis = blocks.get(0);
        assertEquals(0L, genesis.getBlockIndex());
        assertEquals("0000000000000000000000000000000000000000000000000000000000000000", genesis.getPreviousHash());
        assertNotNull(genesis.getCurrentHash());
        assertEquals(64, genesis.getCurrentHash().length());
    }

    @Test
    @DisplayName("Should append new block and link previous hash")
    void testAppendBlock() {
        BlockchainBlock block1 = blockchainService.addBlock("TEST_TRANSACTION", "{\"data\":\"test-payload-1\"}");

        assertNotNull(block1);
        assertTrue(block1.getBlockIndex() >= 1L);
        assertNotNull(block1.getPreviousHash());
        assertEquals(64, block1.getCurrentHash().length());

        ChainVerificationResponse check = blockchainService.verifyChain();
        assertTrue(check.isValid(), "Chain should be valid after appending a block");
    }

    @Test
    @DisplayName("Should detect tampering if a block's payload is modified")
    void testTamperDetectionOnPayloadChange() {
        BlockchainBlock block = blockchainService.addBlock("RECORD_HASH", "{\"recordId\":99,\"sha256\":\"original\"}");
        Long blockIndex = block.getBlockIndex();

        // Tamper with payload directly in database
        block.setTransactionPayload("{\"recordId\":99,\"sha256\":\"TAMPERED_MALICIOUS_HASH\"}");
        blockRepository.saveAndFlush(block);

        ChainVerificationResponse verification = blockchainService.verifyChain();
        assertFalse(verification.isValid(), "Verification should fail when a block payload is tampered with");
        assertEquals(blockIndex, verification.getBrokenBlockIndex());
    }

    @Test
    @DisplayName("Should detect broken chain if previousHash pointer is altered")
    void testTamperDetectionOnBrokenChainLink() {
        BlockchainBlock b1 = blockchainService.addBlock("TEST_A", "{\"key\":\"valA\"}");
        BlockchainBlock b2 = blockchainService.addBlock("TEST_B", "{\"key\":\"valB\"}");

        // Alter b2's previous hash link
        b2.setPreviousHash("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        blockRepository.saveAndFlush(b2);

        ChainVerificationResponse verification = blockchainService.verifyChain();
        assertFalse(verification.isValid(), "Verification should fail on broken link pointer");
    }
}
