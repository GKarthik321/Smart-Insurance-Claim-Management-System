package com.smartinsurance.claims.dto.response;

import java.math.BigDecimal;

public record TopCustomerResponse(Long customerId, String customerName, BigDecimal totalPremiumPaid) {
}
