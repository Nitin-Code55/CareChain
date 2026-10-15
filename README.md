# CareChain: Blockchain-Based Patient-Centric Electronic Health Record Management System

> **Academic Prototype Notice:**  
> This project is a functional 7th-semester B.Tech Computer Science and Engineering Capstone Prototype. It demonstrates genuinely working decentralized cryptographic concepts, off-chain medical document storage, patient-controlled consent management, and forensic audit logging without relying on paid or production-only third-party blockchain services.

---

## 🏛️ Project Overview & Architecture

Modern healthcare platforms face a dual challenge: centralized electronic health record (EHR) databases are vulnerable to unauthorized internal tampering and ransomware, while completely public blockchains risk severe privacy violations under HIPAA and GDPR if sensitive patient records are stored on-chain.

**CareChain solves this through a Hybrid Off-Chain / Cryptographic Ledger Architecture:**
1. **Zero Clinical Data on the Ledger:** Sensitive medical documents (PDFs, lab reports, radiology scans) are stored strictly off-chain in isolated server storage with UUID obfuscation.
2. **Byte-Level SHA-256 Block Anchoring:** On upload, the exact binary digest (SHA-256) of each file is calculated and permanently anchored inside a deterministic chained block.
3. **Patient Sovereign Consent Registry:** Physicians cannot query, view, or download patient records unless the patient has explicitly granted active consent. Patients can revoke physician access at any time with immediate backend enforcement.
4. **Three-Way Integrity Reconciliation:** Patients and physicians can execute live cryptographic verifications that recalculate physical disk bytes and reconcile them against database records and blockchain block payloads.
5. **Zero-Knowledge Clinical Privacy for Administrators:** System administrators can audit ledger health, review security events, and inspect blocks, but are barred by Spring Security filters from reading or downloading patient clinical files.

---

## 👥 Pre-Seeded Academic Demo Accounts

For faculty evaluation and live demonstration, the system automatically initializes with pre-configured accounts, real clinical files, and anchored ledger blocks:

| Role | Email Address | Password | Functionality |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@carechain.test` | `Patient123!` | Upload records, grant/revoke doctor consent, verify SHA-256 byte integrity |
| **Doctor** | `doctor@carechain.test` | `Doctor123!` | View authorized patient histories, download verified records, audit access |
| **Admin** | `admin@carechain.test` | `Admin123!` | Inspect blockchain ledger blocks, audit trails, system telemetry (Zero-Knowledge) |

*Additional accounts:* `doctor2@carechain.test` (`Doctor123!`), `patient2@carechain.test` (`Patient123!`).

---

## 🖥️ Complete 22-View Map

### Public Portal
- `/`: **Landing Page** — Architectural pillars, system design overview, and quick-access credentials.
- `/login`: **Login Portal** — Role-based authentication with 1-click test account fill buttons.
- `/register`: **Registration** — Patient and Doctor registration with role-specific credentialing.

### Patient Portal (`/patient/*`)
- `/patient/dashboard`: Health overview, document counts, authorized doctor status.
- `/patient/records`: Filterable medical record repository with search, download, and inspection.
- `/patient/records/:id`: Detailed record view, blockchain anchor breakdown, and live byte verification.
- `/patient/upload`: Secure off-chain upload dropzone (PDF/PNG/JPG) with automatic block mining.
- `/patient/permissions`: Physician access consent management with instant revoke dialog.
- `/patient/verify`: System-wide cryptographic three-way hash integrity verification console.
- `/patient/activity`: Personal chronological audit logs with event type and outcome filters.
- `/patient/profile`: Demographics, blood group, allergies, and emergency contact editor.

### Doctor Portal (`/doctor/*`)
- `/doctor/dashboard`: Clinical workspace showing authorized patients and accessible records.
- `/doctor/patients`: Directory of consenting patients with clinical demographics and active grants.
- `/doctor/records`: Cross-patient authorized record repository with category filtering and downloads.
- `/doctor/records/:id`: Clinical record inspection with diagnostic SHA-256 integrity check.
- `/doctor/verify`: Physician diagnostic verification harness to validate clinical records before use.
- `/doctor/activity`: Physician clinical access audit trail logging every view and download.

### Admin Portal (`/admin/*`)
- `/admin/dashboard`: System operations overview, chain health widget, zero-knowledge privacy notice.
- `/admin/users`: User directory governance with role filtering (Patients, Doctors, Admins).
- `/admin/stats`: Telemetry dashboard with role distribution bars and blockchain parameters.
- `/admin/blockchain`: Visual Ledger Explorer displaying all chained blocks and whole-chain verification.
- `/admin/audit`: Institutional security audit trail with forensic event and outcome filtering.

---

## 🛠️ Technology Stack

- **Backend:** Spring Boot 3.3.4, Java 21 LTS, Spring Security 6 (Stateless JWT + BCrypt), Spring Data JPA, H2 Database (In-Memory with persistent seeding), JJWT 0.12.5.
- **Frontend:** React 18, Vite 6, Tailwind CSS, React Router v6, Axios (with auth interceptors), Lucide React.
- **Off-Chain Storage:** Secure disk virtualization with UUID path anonymization and byte-level digest recalculation.
- **Blockchain Simulation:** Cryptographic block sequence with previous-hash chaining, deterministic SHA-256 hashing, and proof nonces.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Java 21 LTS**
- **Apache Maven 3.9+**
- **Node.js 18+ & npm**

### 2. Start Spring Boot Backend (Port 8080)
```bash
cd backend
mvn spring-boot:run
```
*The backend starts at `http://localhost:8080`. Genesis Block #0 and demo records will be automatically created.*

### 3. Start React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*The frontend opens at `http://localhost:5173` with full reverse-proxying of `/api` requests to port 8080.*

---

## 🧪 Step-by-Step Viva & Demo Walkthrough Script

Follow these steps during project presentation to demonstrate all core features:

1. **Public Showcase:**
   - Open `http://localhost:5173`.
   - Scroll through the architectural pillars (Off-chain storage, SHA-256 block anchoring, Patient consent).
2. **Patient Upload & Block Mining:**
   - Click **Patient** on the quick-demo credentials box (or log in with `patient@carechain.test` / `Patient123!`).
   - Navigate to **Upload Record**.
   - Attach any sample PDF or image, enter a title, and click **Upload & Mine Ledger Block**.
   - Show the newly assigned block index and computed SHA-256 hash.
3. **Cryptographic Three-Way Verification:**
   - Navigate to **Integrity Verification**.
   - Click **Check Now** on the uploaded record.
   - Point out that the server reads the actual file bytes off physical disk, recalculates the SHA-256 digest, and matches it 100% against the blockchain block payload.
4. **Consent Control & Instant Revocation:**
   - Navigate to **Manage Doctor Access**.
   - Note that `Dr. Sarah Mitchell` has active access.
   - Open an incognito browser window, log in as `doctor@carechain.test` / `Doctor123!`.
   - In Doctor portal, show that the patient's records are visible in **Authorized Records**.
   - In the Patient window, click **Revoke Access** on Dr. Mitchell.
   - In the Doctor window, refresh **Authorized Records** — the records are immediately inaccessible (0 records returned).
5. **Blockchain Ledger Inspection:**
   - Log in as `admin@carechain.test` / `Admin123!`.
   - Go to **Blockchain Ledger**.
   - Review Genesis Block #0 and each subsequent block (`RECORD_HASH`, `PERMISSION_GRANT`, `PERMISSION_REVOCATION`).
   - Click **Verify Entire Ledger Chain** to demonstrate continuous mathematical link verification.
6. **Zero-Knowledge Privacy Enforcement:**
   - Point out that the Admin portal has zero pages or endpoints to view or download patient private clinical files.

---

## 📚 Supplementary Documentation

- [REST API Specification](docs/API_DOCUMENTATION.md)
- [Future Scope & 8th-Semester Roadmap](docs/FUTURE_SCOPE.md)
