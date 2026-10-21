package com.smartinsurance.claims.controller.api;

import com.smartinsurance.claims.dto.response.CustomerResponse;
import com.smartinsurance.claims.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/me")
    public ResponseEntity<CustomerResponse> getCurrent(Authentication authentication) {
        return ResponseEntity.ok(customerService.getByUsername(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<CustomerResponse> updateCurrent(Authentication authentication,
                                                           @RequestBody Map<String, String> fields) {
        CustomerResponse updated = customerService.updateProfile(authentication.getName(),
                fields.get("firstName"), fields.get("lastName"), fields.get("phone"), fields.get("address"));
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT','CLAIMS_OFFICER')")
    public ResponseEntity<CustomerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getById(id));
    }
}
