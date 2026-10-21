package com.smartinsurance.claims.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PolicyResponse(
        Long id,
        String policyNumber,
        Long customerId,
        String customerName,
        Long productId,
        String productName,
        String nomineeName,
        String nomineeRelation,
        LocalDate startDate,
        LocalDate endDate,
        String status,
        BigDecimal premiumAmount
) {
}
