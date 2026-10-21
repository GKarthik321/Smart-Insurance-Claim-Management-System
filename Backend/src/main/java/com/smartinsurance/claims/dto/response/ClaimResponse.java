package com.smartinsurance.claims.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ClaimResponse(
        Long id,
        String claimNumber,
        Long policyId,
        String policyNumber,
        LocalDate incidentDate,
        String claimType,
        String claimDescription,
        BigDecimal claimAmount,
        String status,
        LocalDateTime submittedDate,
        BigDecimal settledAmount,
        LocalDateTime settledDate
) {
}
