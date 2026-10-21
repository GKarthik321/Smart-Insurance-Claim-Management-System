package com.smartinsurance.claims.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ClaimDecisionRequest(
        @NotBlank String comments,
        java.math.BigDecimal settledAmount
) {
}
