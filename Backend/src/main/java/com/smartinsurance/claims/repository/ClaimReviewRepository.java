package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.ClaimReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimReviewRepository extends JpaRepository<ClaimReview, Long> {
    List<ClaimReview> findByClaimId(Long claimId);
}
