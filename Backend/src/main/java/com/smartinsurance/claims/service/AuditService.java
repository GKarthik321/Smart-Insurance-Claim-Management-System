package com.smartinsurance.claims.service;

import com.smartinsurance.claims.entity.AuditLog;
import com.smartinsurance.claims.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void log(String username, String action, String entityName, String entityId, String details) {
        auditLogRepository.save(AuditLog.builder()
                .username(username)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .build());
    }
}
