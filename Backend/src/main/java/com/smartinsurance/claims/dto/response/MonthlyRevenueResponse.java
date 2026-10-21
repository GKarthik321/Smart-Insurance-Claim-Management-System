package com.smartinsurance.claims.dto.response;

import java.math.BigDecimal;

public record MonthlyRevenueResponse(String month, BigDecimal revenue) {
}
