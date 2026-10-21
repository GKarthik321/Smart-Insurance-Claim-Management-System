package com.smartinsurance.claims.dto.response;

import java.math.BigDecimal;

public record AdminReportResponse(
        BigDecimal premiumCollection,
        BigDecimal claimsSettlementRatio,
        long totalClaims,
        long approvedClaims,
        long rejectedClaims,
        long pendingClaims,
        long settledClaims
) {
}
