package com.smartinsurance.claims.service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartinsurance.claims.dto.request.PurchasePolicyRequest;
import com.smartinsurance.claims.dto.response.PolicyResponse;
import com.smartinsurance.claims.entity.Customer;
import com.smartinsurance.claims.entity.Policy;
import com.smartinsurance.claims.entity.PolicyStatus;
import com.smartinsurance.claims.entity.Product;
import com.smartinsurance.claims.exception.BadRequestException;
import com.smartinsurance.claims.exception.ResourceNotFoundException;
import com.smartinsurance.claims.repository.PolicyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PolicyService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final PolicyRepository policyRepository;
    private final CustomerService customerService;
    private final ProductService productService;

    public List<PolicyResponse> getPoliciesForCustomer(String username) {
        Customer customer = customerService.findByUsername(username);
        return policyRepository.findByCustomerId(customer.getId()).stream().map(this::toResponse).toList();
    }

    public List<PolicyResponse> getAll() {
        return policyRepository.findAll().stream().map(this::toResponse).toList();
    }

    public PolicyResponse getByNumber(String policyNumber) {
        return toResponse(findByNumber(policyNumber));
    }

    public Policy findByNumber(String policyNumber) {
        return policyRepository.findByPolicyNumber(policyNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + policyNumber));
    }

    public Policy findById(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + id));
    }

    @Transactional
    public PolicyResponse purchase(String username, PurchasePolicyRequest request) {
        Customer customer = customerService.findByUsername(username);
        Product product = productService.findEntity(request.productId());

        LocalDate start = LocalDate.now();
        LocalDate end = start.plusMonths(product.getPolicyTenureMonths());

        Policy policy = Policy.builder()
                .policyNumber(generatePolicyNumber())
                .customer(customer)
                .product(product)
                .nomineeName(request.nomineeName())
                .nomineeRelation(request.nomineeRelation())
                .startDate(start)
                .endDate(end)
                .status(PolicyStatus.PENDING)
                .premiumAmount(product.getPremiumAmount())
                .build();

        return toResponse(policyRepository.save(policy));
    }

    @Transactional
    public PolicyResponse renew(String username, Long policyId) {
        Policy policy = findById(policyId);
        assertOwnership(policy, username);
        if (policy.getStatus() != PolicyStatus.ACTIVE && policy.getStatus() != PolicyStatus.EXPIRED) {
            throw new BadRequestException("Only active or expired policies can be renewed");
        }
        policy.setStartDate(LocalDate.now());
        policy.setEndDate(LocalDate.now().plusMonths(policy.getProduct().getPolicyTenureMonths()));
        policy.setStatus(PolicyStatus.ACTIVE);
        return toResponse(policy);
    }

    @Transactional
    public PolicyResponse requestCancellation(String username, Long policyId) {
        Policy policy = findById(policyId);
        assertOwnership(policy, username);
        if (policy.getStatus() != PolicyStatus.ACTIVE) {
            throw new BadRequestException("Only active policies can be cancelled");
        }
        policy.setStatus(PolicyStatus.CANCELLATION_REQUESTED);
        return toResponse(policy);
    }

    @Transactional
    public PolicyResponse approve(Long policyId) {
        Policy policy = findById(policyId);
        if (policy.getStatus() != PolicyStatus.PENDING) {
            throw new BadRequestException("Only pending policies can be approved");
        }
        policy.setStatus(PolicyStatus.ACTIVE);
        return toResponse(policy);
    }

    @Transactional
    public PolicyResponse reject(Long policyId) {
        Policy policy = findById(policyId);
        if (policy.getStatus() != PolicyStatus.PENDING) {
            throw new BadRequestException("Only pending policies can be rejected");
        }
        policy.setStatus(PolicyStatus.REJECTED);
        return toResponse(policy);
    }

    @Transactional
    public PolicyResponse approveCancellation(Long policyId) {
        Policy policy = findById(policyId);
        if (policy.getStatus() != PolicyStatus.CANCELLATION_REQUESTED) {
            throw new BadRequestException("Policy is not pending cancellation approval");
        }
        policy.setStatus(PolicyStatus.CANCELLED);
        return toResponse(policy);
    }

    private void assertOwnership(Policy policy, String username) {
        if (!policy.getCustomer().getUser().getUsername().equals(username)) {
            throw new BadRequestException("This policy does not belong to the current customer");
        }
    }

    private String generatePolicyNumber() {
        return "POL-" + System.currentTimeMillis() + "-" + (100 + RANDOM.nextInt(900));
    }

    private PolicyResponse toResponse(Policy p) {
        return new PolicyResponse(
                p.getId(), p.getPolicyNumber(), p.getCustomer().getId(),
                p.getCustomer().getFirstName() + " " + p.getCustomer().getLastName(),
                p.getProduct().getId(), p.getProduct().getProductName(),
                p.getNomineeName(), p.getNomineeRelation(),
                p.getStartDate(), p.getEndDate(), p.getStatus().name(), p.getPremiumAmount());
    }
}
