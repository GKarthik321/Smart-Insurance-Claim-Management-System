package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.Claim;
import com.smartinsurance.claims.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Optional<Claim> findByClaimNumber(String claimNumber);
    List<Claim> findByStatus(ClaimStatus status);

    @Query("select c from Claim c where c.policy.customer.id = :customerId")
    List<Claim> findByCustomerId(@Param("customerId") Long customerId);

    List<Claim> findByPolicyId(Long policyId);
}
