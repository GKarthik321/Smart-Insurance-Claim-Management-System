package com.smartinsurance.claims.controller.api;

import com.smartinsurance.claims.dto.request.ClaimDecisionRequest;
import com.smartinsurance.claims.dto.request.FileClaimRequest;
import com.smartinsurance.claims.dto.response.ClaimResponse;
import com.smartinsurance.claims.entity.ClaimStatus;
import com.smartinsurance.claims.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @GetMapping("/me")
    public ResponseEntity<List<ClaimResponse>> myClaims(Authentication authentication) {
        return ResponseEntity.ok(claimService.getClaimsForCustomer(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<ClaimResponse> fileClaim(Authentication authentication,
                                                    @Valid @RequestBody FileClaimRequest request) {
        return ResponseEntity.ok(claimService.fileClaim(authentication.getName(), request));
    }

    @GetMapping("/{claimNumber}")
    public ResponseEntity<ClaimResponse> getByNumber(@PathVariable String claimNumber) {
        return ResponseEntity.ok(claimService.getByNumber(claimNumber));
    }

    @GetMapping("/review/queue")
    @PreAuthorize("hasAnyRole('CLAIMS_OFFICER','ADMIN')")
    public ResponseEntity<List<ClaimResponse>> queue(@RequestParam(required = false) ClaimStatus status) {
        return ResponseEntity.ok(claimService.getQueue(status));
    }

    @PostMapping("/review/{id}/under-review")
    @PreAuthorize("hasAnyRole('CLAIMS_OFFICER','ADMIN')")
    public ResponseEntity<ClaimResponse> markUnderReview(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(claimService.updateStatus(id, ClaimStatus.UNDER_REVIEW, authentication.getName(), "Marked under review"));
    }

    @PostMapping("/review/{id}/request-documents")
    @PreAuthorize("hasAnyRole('CLAIMS_OFFICER','ADMIN')")
    public ResponseEntity<ClaimResponse> requestDocuments(Authentication authentication, @PathVariable Long id,
                                                           @RequestBody(required = false) ClaimDecisionRequest request) {
        String remarks = request != null ? request.comments() : "Additional documents requested";
        return ResponseEntity.ok(claimService.updateStatus(id, ClaimStatus.DOCUMENTS_REQUIRED, authentication.getName(), remarks));
    }

    @PostMapping("/review/{id}/approve")
    @PreAuthorize("hasAnyRole('CLAIMS_OFFICER','ADMIN')")
    public ResponseEntity<ClaimResponse> approve(Authentication authentication, @PathVariable Long id,
                                                  @Valid @RequestBody ClaimDecisionRequest request) {
        return ResponseEntity.ok(claimService.approve(id, authentication.getName(), request));
    }

    @PostMapping("/review/{id}/reject")
    @PreAuthorize("hasAnyRole('CLAIMS_OFFICER','ADMIN')")
    public ResponseEntity<ClaimResponse> reject(Authentication authentication, @PathVariable Long id,
                                                 @Valid @RequestBody ClaimDecisionRequest request) {
        return ResponseEntity.ok(claimService.reject(id, authentication.getName(), request));
    }

    @PostMapping("/review/{id}/settle")
    @PreAuthorize("hasAnyRole('CLAIMS_OFFICER','ADMIN')")
    public ResponseEntity<ClaimResponse> settle(Authentication authentication, @PathVariable Long id,
                                                 @Valid @RequestBody ClaimDecisionRequest request) {
        return ResponseEntity.ok(claimService.settle(id, authentication.getName(), request));
    }
}
