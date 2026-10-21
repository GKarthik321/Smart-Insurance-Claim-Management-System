package com.smartinsurance.claims.dto.request;

import com.smartinsurance.claims.entity.ProductCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank String productName,
        @NotNull ProductCategory productCategory,
        @NotNull @DecimalMin("0.0") BigDecimal coverageAmount,
        @NotNull @DecimalMin("0.0") BigDecimal premiumAmount,
        @NotNull @Min(1) Integer policyTenureMonths,
        String description
) {
}
