package com.smartinsurance.claims.controller.api;

import com.smartinsurance.claims.dto.request.MakePaymentRequest;
import com.smartinsurance.claims.dto.response.PaymentResponse;
import com.smartinsurance.claims.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/me")
    public ResponseEntity<List<PaymentResponse>> myPayments(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getHistoryForCustomer(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> makePayment(Authentication authentication,
                                                        @Valid @RequestBody MakePaymentRequest request) {
        return ResponseEntity.ok(paymentService.makePayment(authentication.getName(), request));
    }
}
