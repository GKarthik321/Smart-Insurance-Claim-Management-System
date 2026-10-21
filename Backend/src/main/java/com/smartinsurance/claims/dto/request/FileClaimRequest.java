package com.smartinsurance.claims.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FileClaimRequest(
        @NotNull Long policyId,
        @NotNull @PastOrPresent LocalDate incidentDate,
        @NotBlank String claimType,
        String claimDescription,
        @NotNull @DecimalMin("0.01") BigDecimal claimAmount
) {
}
