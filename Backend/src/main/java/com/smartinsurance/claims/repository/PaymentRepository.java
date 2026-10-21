package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPolicyId(Long policyId);

    @org.springframework.data.jpa.repository.Query("select p from Payment p where p.policy.customer.id = :customerId order by p.paymentDate desc")
    List<Payment> findByCustomerId(@org.springframework.data.repository.query.Param("customerId") Long customerId);
}
