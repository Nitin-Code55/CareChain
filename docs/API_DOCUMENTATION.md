# CareChain REST API Documentation

**Project:** CareChain — Blockchain-Based Patient-Centric Electronic Health Record Management System  
**Academic Context:** 7th Semester B.Tech Computer Science and Engineering  
**Base URL:** `http://localhost:8080/api` (or `/api` via Vite dev proxy on port 5173)  
**Security Scheme:** Bearer JWT (`Authorization: Bearer <token>`)

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Registers a new user (Patient or Doctor). Public registration for Admin is disallowed.
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "role": "PATIENT",
    "bloodGroup": "O+",
    "gender": "Female",
    "emergencyContact": "+1-555-0199"
  }
  ```
  *(For Doctors, include `specialization`, `licenseNumber`, `hospitalAffiliation`)*
- **Response (200 OK):**
  ```json
  {
    "message": "User registered successfully",
    "userId": 5,
    "email": "jane@example.com",
    "role": "PATIENT"
  }
  ```

### `POST /api/auth/login`
Authenticates a user and issues a signed JSON Web Token (24-hour expiration).
- **Request Body:**
  ```json
  {
    "email": "patient@carechain.test",
    "password": "Patient123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 4,
      "email": "patient@carechain.test",
      "fullName": "Alex Johnson",
      "role": "PATIENT",
      "patientProfile": { ... },
      "doctorProfile": null
    }
  }
  ```

---

## 2. User & Profile Endpoints (`/api/users`)

### `GET /api/users/me`
Retrieves authenticated user details and profile.
- **Headers:** `Authorization: Bearer <JWT>`
- **Response (200 OK):** `UserDto`

### `PUT /api/users/patient/profile`
Updates patient health and demographic attributes.
- **Headers:** `Authorization: Bearer <PATIENT_JWT>`
- **Request Body:**
  ```json
  {
    "bloodGroup": "O+",
    "gender": "Male",
    "emergencyContact": "Sarah +1-555-0192",
    "allergies": "Penicillin",
    "chronicConditions": "Hypertension"
  }
  ```

### `PUT /api/users/doctor/profile`
Updates physician professional credentials.
- **Headers:** `Authorization: Bearer <DOCTOR_JWT>`
- **Request Body:**
  ```json
  {
    "specialization": "Interventional Cardiology",
    "licenseNumber": "MD-NY-84920",
    "hospitalAffiliation": "Metropolitan Health System",
    "bio": "Cardiologist with 14 years experience"
  }
  ```

---

## 3. Medical Records Endpoints (`/api/records`)

### `POST /api/records`
Uploads a new off-chain medical file, computes SHA-256 byte digest, and mines a new blockchain block.
- **Headers:** `Authorization: Bearer <PATIENT_JWT>`, `Content-Type: multipart/form-data`
- **Form Data:**
  - `file`: Binary file (PDF, PNG, JPG; max 15MB)
  - `title`: String
  - `recordType`: `PRESCRIPTION | LAB_REPORT | SCAN_IMAGE | DISCHARGE_SUMMARY | OTHER`
  - `description`: String (optional)
- **Response (201 Created):** `MedicalRecordDto`

### `GET /api/records`
Returns all medical records owned by the authenticated patient.
- **Headers:** `Authorization: Bearer <PATIENT_JWT>`
- **Response (200 OK):** `List<MedicalRecordDto>`

### `GET /api/records/doctor`
Returns clinical records of patients who have currently granted active consent to the calling doctor.
- **Headers:** `Authorization: Bearer <DOCTOR_JWT>`
- **Response (200 OK):** `List<MedicalRecordDto>`

### `GET /api/records/{id}`
Returns details for a specific record. Strict access checks:
- Patient can access if owner.
- Doctor can access only if patient granted active consent.
- Administrator is barred (Zero-Knowledge rule).
- **Response (200 OK):** `MedicalRecordDto`

### `GET /api/records/{id}/download`
Downloads the original off-chain clinical file byte stream.
- **Headers:** `Authorization: Bearer <PATIENT_or_DOCTOR_JWT>`
- **Response (200 OK):** File octet stream with Content-Disposition attachment header.

### `POST /api/records/{id}/verify`
Executes real-time 3-way cryptographic hash reconciliation between physical disk bytes, DB metadata, and blockchain block.
- **Response (200 OK):**
  ```json
  {
    "recordId": 1,
    "recordTitle": "Comprehensive Metabolic Panel (CMP-14)",
    "filename": "CMP_Lab_Results_Oct2026.pdf",
    "result": "VERIFIED",
    "match": true,
    "originalHash": "89ae6a38...",
    "currentFileHash": "89ae6a38...",
    "blockchainHash": "89ae6a38...",
    "verifiedAt": "2026-10-15T16:01:16.390549",
    "message": "Document authentic. Live physical file hash matches database and blockchain ledger."
  }
  ```

---

## 4. Consent & Permissions Endpoints (`/api/permissions`)

### `GET /api/permissions/doctors`
Returns list of registered doctors available for patient consent granting.
- **Headers:** `Authorization: Bearer <PATIENT_JWT>`
- **Response (200 OK):** `List<DoctorProfileDto>`

### `GET /api/permissions`
Returns active and revoked permissions granted by the authenticated patient.
- **Headers:** `Authorization: Bearer <PATIENT_JWT>`
- **Response (200 OK):** `List<RecordPermissionDto>`

### `POST /api/permissions`
Grants clinical access to a doctor and mines an on-chain `PERMISSION_GRANT` block.
- **Headers:** `Authorization: Bearer <PATIENT_JWT>`
- **Request Body:**
  ```json
  {
    "doctorId": 2,
    "notes": "Cardiology second opinion"
  }
  ```
- **Response (201 Created):** `RecordPermissionDto`

### `DELETE /api/permissions/{id}`
Immediately revokes doctor access and mines an on-chain `PERMISSION_REVOCATION` block.
- **Headers:** `Authorization: Bearer <PATIENT_JWT>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Permission revoked successfully"
  }
  ```

### `GET /api/permissions/patients`
Returns list of consenting patients for the authenticated doctor.
- **Headers:** `Authorization: Bearer <DOCTOR_JWT>`
- **Response (200 OK):** `List<RecordPermissionDto>`

---

## 5. Blockchain Ledger Endpoints (`/api/blockchain`)

### `GET /api/blockchain/blocks`
Returns the complete chain of blocks from Genesis #0 to latest head block.
- **Headers:** `Authorization: Bearer <JWT>`
- **Response (200 OK):** `List<BlockchainBlockDto>`

### `GET /api/blockchain/verify`
Performs cryptographic chain verification: recomputes all block hashes, validates continuous previous-hash linking, and confirms ledger integrity.
- **Headers:** `Authorization: Bearer <JWT>`
- **Response (200 OK):**
  ```json
  {
    "valid": true,
    "totalBlocks": 5,
    "message": "All 5 blocks cryptographically verified. Previous hash links and SHA-256 signatures are intact.",
    "verifiedAt": "2026-10-15T16:01:16.650391",
    "latestBlockHash": "7c745ee390216ac4c10abd25e4a7776e6aa8f242e146d3c44d7a8ddcfb6c52a8",
    "brokenBlockIndex": null,
    "brokenReason": null
  }
  ```

---

## 6. Audit & Admin Endpoints (`/api/audit` & `/api/admin`)

### `GET /api/audit/my`
Returns personal audit trail for the authenticated patient or doctor.
- **Headers:** `Authorization: Bearer <JWT>`
- **Response (200 OK):** `List<AuditEventDto>`

### `GET /api/audit`
Returns institutional audit trails (Administrator only).
- **Headers:** `Authorization: Bearer <ADMIN_JWT>`
- **Response (200 OK):** `List<AuditEventDto>`

### `GET /api/admin/statistics`
Returns quantitative system telemetry: total patients, doctors, records, blocks, and audit events.
- **Headers:** `Authorization: Bearer <ADMIN_JWT>`
- **Response (200 OK):** `AdminStatsResponse`

### `GET /api/admin/users`
Returns directory of all registered system users (Administrator only).
- **Headers:** `Authorization: Bearer <ADMIN_JWT>`
- **Response (200 OK):** `List<UserDto>`
