package com.smartinsurance.claims.dto.response;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String productName,
        String productCategory,
        BigDecimal coverageAmount,
        BigDecimal premiumAmount,
        Integer policyTenureMonths,
        String description,
        boolean active
) {
}
