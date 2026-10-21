package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.request.MakePaymentRequest;
import com.smartinsurance.claims.dto.response.PaymentResponse;
import com.smartinsurance.claims.entity.Customer;
import com.smartinsurance.claims.entity.Payment;
import com.smartinsurance.claims.entity.PaymentStatus;
import com.smartinsurance.claims.entity.Policy;
import com.smartinsurance.claims.exception.BadRequestException;
import com.smartinsurance.claims.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final PaymentRepository paymentRepository;
    private final CustomerService customerService;
    private final PolicyService policyService;

    public List<PaymentResponse> getHistoryForCustomer(String username) {
        Customer customer = customerService.findByUsername(username);
        return paymentRepository.findByCustomerId(customer.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public PaymentResponse makePayment(String username, MakePaymentRequest request) {
        Policy policy = policyService.findById(request.policyId());
        if (!policy.getCustomer().getUser().getUsername().equals(username)) {
            throw new BadRequestException("This policy does not belong to the current customer");
        }

        Payment payment = Payment.builder()
                .policy(policy)
                .amount(request.amount())
                .status(PaymentStatus.SUCCESS)
                .paymentMethod(request.paymentMethod())
                .transactionRef(generateRef("TXN"))
                .invoiceNumber(generateRef("INV"))
                .build();

        return toResponse(paymentRepository.save(payment));
    }

    private String generateRef(String prefix) {
        return prefix + "-" + System.currentTimeMillis() + "-" + (100 + RANDOM.nextInt(900));
    }

    private PaymentResponse toResponse(Payment p) {
        return new PaymentResponse(p.getId(), p.getPolicy().getId(), p.getPolicy().getPolicyNumber(),
                p.getAmount(), p.getPaymentDate(), p.getStatus().name(), p.getPaymentMethod(),
                p.getTransactionRef(), p.getInvoiceNumber());
    }
}
