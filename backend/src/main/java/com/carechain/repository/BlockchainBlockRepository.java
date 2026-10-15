package com.carechain.repository;

import com.carechain.entity.BlockchainBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockchainBlockRepository extends JpaRepository<BlockchainBlock, Long> {
    List<BlockchainBlock> findAllByOrderByBlockIndexAsc();
    List<BlockchainBlock> findAllByOrderByBlockIndexDesc();
    Optional<BlockchainBlock> findTopByOrderByBlockIndexDesc();
    Optional<BlockchainBlock> findByBlockIndex(Long blockIndex);
    Optional<BlockchainBlock> findByCurrentHash(String currentHash);
}
