package com.carechain.controller;

import com.carechain.dto.BlockchainBlockDto;
import com.carechain.dto.ChainVerificationResponse;
import com.carechain.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainController {

    @Autowired
    private BlockchainService blockchainService;

    @GetMapping("/blocks")
    public ResponseEntity<List<BlockchainBlockDto>> getBlocks() {
        return ResponseEntity.ok(blockchainService.getAllBlocks());
    }

    @GetMapping("/verify")
    public ResponseEntity<ChainVerificationResponse> verifyChain() {
        return ResponseEntity.ok(blockchainService.verifyChain());
    }
}
