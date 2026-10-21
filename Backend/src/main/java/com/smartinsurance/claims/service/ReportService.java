package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.response.AdminReportResponse;
import com.smartinsurance.claims.entity.Claim;
import com.smartinsurance.claims.entity.ClaimStatus;
import com.smartinsurance.claims.entity.Payment;
import com.smartinsurance.claims.repository.ClaimRepository;
import com.smartinsurance.claims.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ClaimRepository claimRepository;
    private final PaymentRepository paymentRepository;

    public AdminReportResponse adminSummary() {
        List<Claim> claims = claimRepository.findAll();
        List<Payment> payments = paymentRepository.findAll();

        BigDecimal premiumCollection = payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long total = claims.size();
        long approved = claims.stream().filter(c -> c.getStatus() == ClaimStatus.APPROVED).count();
        long rejected = claims.stream().filter(c -> c.getStatus() == ClaimStatus.REJECTED).count();
        long settled = claims.stream().filter(c -> c.getStatus() == ClaimStatus.SETTLED).count();
        long pending = claims.stream().filter(c -> c.getStatus() == ClaimStatus.SUBMITTED
                || c.getStatus() == ClaimStatus.UNDER_REVIEW
                || c.getStatus() == ClaimStatus.DOCUMENTS_REQUIRED).count();

        BigDecimal settlementRatio = total == 0 ? BigDecimal.ZERO :
                BigDecimal.valueOf(settled).divide(BigDecimal.valueOf(total), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));

        return new AdminReportResponse(premiumCollection, settlementRatio, total, approved, rejected, pending, settled);
    }
}
