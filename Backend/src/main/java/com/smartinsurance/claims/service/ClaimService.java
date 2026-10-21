package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.request.ClaimDecisionRequest;
import com.smartinsurance.claims.dto.request.FileClaimRequest;
import com.smartinsurance.claims.dto.response.ClaimResponse;
import com.smartinsurance.claims.entity.*;
import com.smartinsurance.claims.exception.BadRequestException;
import com.smartinsurance.claims.exception.ResourceNotFoundException;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.ClaimReviewRepository;
import com.smartinsurance.claims.repository.ClaimStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClaimService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final ClaimRepository claimRepository;
    private final ClaimStatusHistoryRepository historyRepository;
    private final ClaimReviewRepository reviewRepository;
    private final CustomerService customerService;
    private final PolicyService policyService;
    private final AuditService auditService;

    public List<ClaimResponse> getClaimsForCustomer(String username) {
        Customer customer = customerService.findByUsername(username);
        return claimRepository.findByCustomerId(customer.getId()).stream().map(this::toResponse).toList();
    }

    public List<ClaimResponse> getQueue(ClaimStatus status) {
        List<Claim> claims = status == null ? claimRepository.findAll() : claimRepository.findByStatus(status);
        return claims.stream().map(this::toResponse).toList();
    }

    public ClaimResponse getByNumber(String claimNumber) {
        return toResponse(findByNumber(claimNumber));
    }

    public Claim findByNumber(String claimNumber) {
        return claimRepository.findByClaimNumber(claimNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + claimNumber));
    }

    public Claim findById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + id));
    }

    @Transactional
    public ClaimResponse fileClaim(String username, FileClaimRequest request) {
        Policy policy = policyService.findById(request.policyId());
        if (!policy.getCustomer().getUser().getUsername().equals(username)) {
            throw new BadRequestException("This policy does not belong to the current customer");
        }
        if (policy.getStatus() != PolicyStatus.ACTIVE) {
            throw new BadRequestException("Claims can only be filed against an active policy");
        }

        Claim claim = Claim.builder()
                .claimNumber(generateClaimNumber())
                .policy(policy)
                .incidentDate(request.incidentDate())
                .claimType(request.claimType())
                .claimDescription(request.claimDescription())
                .claimAmount(request.claimAmount())
                .status(ClaimStatus.SUBMITTED)
                .build();
        claim = claimRepository.save(claim);

        recordHistory(claim, null, ClaimStatus.SUBMITTED, username, "Claim submitted by customer");
        auditService.log(username, "FILE_CLAIM", "Claim", claim.getClaimNumber(), "Claim amount: " + claim.getClaimAmount());
        return toResponse(claim);
    }

    @Transactional
    public ClaimResponse updateStatus(Long claimId, ClaimStatus newStatus, String changedBy, String remarks) {
        Claim claim = findById(claimId);
        ClaimStatus oldStatus = claim.getStatus();
        claim.setStatus(newStatus);
        recordHistory(claim, oldStatus, newStatus, changedBy, remarks);
        return toResponse(claim);
    }

    @Transactional
    public ClaimResponse approve(Long claimId, String officer, ClaimDecisionRequest request) {
        Claim claim = findById(claimId);
        if (claim.getStatus() == ClaimStatus.SETTLED || claim.getStatus() == ClaimStatus.REJECTED) {
            throw new BadRequestException("Claim is already finalized");
        }
        ClaimStatus oldStatus = claim.getStatus();
        BigDecimal settled = request.settledAmount() != null ? request.settledAmount() : claim.getClaimAmount();
        claim.setStatus(ClaimStatus.APPROVED);
        claim.setSettledAmount(settled);

        recordHistory(claim, oldStatus, ClaimStatus.APPROVED, officer, request.comments());
        reviewRepository.save(ClaimReview.builder()
                .claim(claim).reviewedBy(officer).decision("APPROVED").comments(request.comments()).build());
        auditService.log(officer, "APPROVE_CLAIM", "Claim", claim.getClaimNumber(), request.comments());
        return toResponse(claim);
    }

    @Transactional
    public ClaimResponse reject(Long claimId, String officer, ClaimDecisionRequest request) {
        Claim claim = findById(claimId);
        if (claim.getStatus() == ClaimStatus.SETTLED || claim.getStatus() == ClaimStatus.REJECTED) {
            throw new BadRequestException("Claim is already finalized");
        }
        ClaimStatus oldStatus = claim.getStatus();
        claim.setStatus(ClaimStatus.REJECTED);

        recordHistory(claim, oldStatus, ClaimStatus.REJECTED, officer, request.comments());
        reviewRepository.save(ClaimReview.builder()
                .claim(claim).reviewedBy(officer).decision("REJECTED").comments(request.comments()).build());
        auditService.log(officer, "REJECT_CLAIM", "Claim", claim.getClaimNumber(), request.comments());
        return toResponse(claim);
    }

    @Transactional
    public ClaimResponse settle(Long claimId, String officer, ClaimDecisionRequest request) {
        Claim claim = findById(claimId);
        if (claim.getStatus() != ClaimStatus.APPROVED) {
            throw new BadRequestException("Only approved claims can be settled");
        }
        ClaimStatus oldStatus = claim.getStatus();
        claim.setStatus(ClaimStatus.SETTLED);
        claim.setSettledDate(LocalDateTime.now());
        if (request.settledAmount() != null) {
            claim.setSettledAmount(request.settledAmount());
        }

        recordHistory(claim, oldStatus, ClaimStatus.SETTLED, officer, request.comments());
        auditService.log(officer, "SETTLE_CLAIM", "Claim", claim.getClaimNumber(), request.comments());
        return toResponse(claim);
    }

    private void recordHistory(Claim claim, ClaimStatus oldStatus, ClaimStatus newStatus, String changedBy, String remarks) {
        historyRepository.save(ClaimStatusHistory.builder()
                .claim(claim).oldStatus(oldStatus).newStatus(newStatus).changedBy(changedBy).remarks(remarks).build());
    }

    private String generateClaimNumber() {
        return "CLM-" + System.currentTimeMillis() + "-" + (100 + RANDOM.nextInt(900));
    }

    private ClaimResponse toResponse(Claim c) {
        return new ClaimResponse(
                c.getId(), c.getClaimNumber(), c.getPolicy().getId(), c.getPolicy().getPolicyNumber(),
                c.getIncidentDate(), c.getClaimType(), c.getClaimDescription(), c.getClaimAmount(),
                c.getStatus().name(), c.getSubmittedDate(), c.getSettledAmount(), c.getSettledDate());
    }
}
