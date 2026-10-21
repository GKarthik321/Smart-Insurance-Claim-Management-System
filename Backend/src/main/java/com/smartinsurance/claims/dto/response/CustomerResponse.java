package com.smartinsurance.claims.dto.response;

public record CustomerResponse(
        Long id,
        Long userId,
        String username,
        String email,
        String firstName,
        String lastName,
        String phone,
        String address
) {
}
