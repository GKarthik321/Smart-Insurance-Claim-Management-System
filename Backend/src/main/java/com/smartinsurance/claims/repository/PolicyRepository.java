package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.Policy;
import com.smartinsurance.claims.entity.PolicyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    Optional<Policy> findByPolicyNumber(String policyNumber);
    List<Policy> findByCustomerId(Long customerId);
    List<Policy> findByCustomerIdAndStatus(Long customerId, PolicyStatus status);
    List<Policy> findByStatus(PolicyStatus status);
}
