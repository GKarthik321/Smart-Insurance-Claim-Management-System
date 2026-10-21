package com.smartinsurance.claims.controller.api;

import com.smartinsurance.claims.dto.request.PurchasePolicyRequest;
import com.smartinsurance.claims.dto.response.PolicyResponse;
import com.smartinsurance.claims.service.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @GetMapping("/me")
    public ResponseEntity<List<PolicyResponse>> myPolicies(Authentication authentication) {
        return ResponseEntity.ok(policyService.getPoliciesForCustomer(authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','AGENT','CLAIMS_OFFICER')")
    public ResponseEntity<List<PolicyResponse>> all() {
        return ResponseEntity.ok(policyService.getAll());
    }

    @GetMapping("/{policyNumber}")
    public ResponseEntity<PolicyResponse> getByNumber(@PathVariable String policyNumber) {
        return ResponseEntity.ok(policyService.getByNumber(policyNumber));
    }

    @PostMapping("/purchase")
    public ResponseEntity<PolicyResponse> purchase(Authentication authentication,
                                                    @Valid @RequestBody PurchasePolicyRequest request) {
        return ResponseEntity.ok(policyService.purchase(authentication.getName(), request));
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<PolicyResponse> renew(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(policyService.renew(authentication.getName(), id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<PolicyResponse> requestCancellation(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(policyService.requestCancellation(authentication.getName(), id));
    }

    @PostMapping("/{id}/approve-cancellation")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyResponse> approveCancellation(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.approveCancellation(id));
    }
}
