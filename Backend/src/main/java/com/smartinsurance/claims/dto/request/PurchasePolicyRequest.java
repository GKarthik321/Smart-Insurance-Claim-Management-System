package com.smartinsurance.claims.dto.request;

import jakarta.validation.constraints.NotNull;

public record PurchasePolicyRequest(
        @NotNull Long productId,
        String nomineeName,
        String nomineeRelation
) {
}
