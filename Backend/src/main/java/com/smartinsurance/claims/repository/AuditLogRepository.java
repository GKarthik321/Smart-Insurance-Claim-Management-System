package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
