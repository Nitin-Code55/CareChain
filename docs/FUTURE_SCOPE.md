# CareChain — Academic Prototype Future Scope & 8th-Semester Roadmap

This document outlines the planned expansion roadmap for the final 8th-semester B.Tech capstone project.

---

## 1. Enterprise Blockchain Network Migration
- **Current State:** Local deterministic cryptographic blockchain ledger running in-memory/relational persistence with proof-of-concept nonces and SHA-256 block linking.
- **Future Target:**
  - Deployment onto a permissioned **Hyperledger Fabric** consortium network or Ethereum Layer-2 (Arbitrum/Optimism Sepolia testnet).
  - Implementation of Solidity / Chaincode smart contracts for consent state transitions and patient proxy re-encryption keys.

## 2. Distributed Peer-to-Peer Storage (IPFS)
- **Current State:** File storage resides in off-chain isolated server volumes with UUID anonymization.
- **Future Target:**
  - Integration with **InterPlanetary File System (IPFS)** / Filecoin via Pinata or local Kubo daemon.
  - Off-chain storage transforms into content-addressed distributed hash nodes (`ipfs://Qm...`), eliminating single-point-of-failure storage servers.

## 3. Zero-Knowledge Proofs (ZKP) for Patient Anonymity
- **Current State:** Role-based access control enforces that administrators cannot read medical records; physicians require active consent.
- **Future Target:**
  - Implementation of **zk-SNARKs** (using Circom / SnarkJS) to allow patients to prove medical compliance (e.g., vaccination status, negative blood screen, insurance eligibility) without disclosing their identity or underlying medical report content.

## 4. HL7 / FHIR Standards Compliance
- **Current State:** JSON-based schema storing metadata, record types, and file specs.
- **Future Target:**
  - Compliance with **HL7 FHIR Release 4** (Fast Healthcare Interoperability Resources).
  - Conversion of uploaded medical attachments into standard FHIR `DiagnosticReport`, `Observation`, and `DocumentReference` resources for direct hospital EMR interoperability (Epic, Cerner).

## 5. Mobile Companion App
- **Current State:** Responsive React 18 web application tailored for mobile and desktop viewports.
- **Future Target:**
  - Native mobile application built with **React Native / Expo** with biometric authentication (TouchID / FaceID) for instant biometric consent approval and QR-code emergency record sharing.
