package com.smartinsurance.claims.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long policyId,
        String policyNumber,
        BigDecimal amount,
        LocalDateTime paymentDate,
        String status,
        String paymentMethod,
        String transactionRef,
        String invoiceNumber
) {
}
