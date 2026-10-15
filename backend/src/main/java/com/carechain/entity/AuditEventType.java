package com.carechain.entity;

public enum AuditEventType {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    RECORD_UPLOAD,
    RECORD_ACCESS,
    PERMISSION_GRANT,
    PERMISSION_REVOKE,
    INTEGRITY_VERIFY,
    BLOCKCHAIN_VERIFY
}
