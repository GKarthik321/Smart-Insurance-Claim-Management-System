package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.response.CustomerResponse;
import com.smartinsurance.claims.entity.Customer;
import com.smartinsurance.claims.exception.ResourceNotFoundException;
import com.smartinsurance.claims.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerResponse getByUsername(String username) {
        return toResponse(findByUsername(username));
    }

    public Customer findByUsername(String username) {
        return customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user: " + username));
    }

    public CustomerResponse getById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
        return toResponse(customer);
    }

    @Transactional
    public CustomerResponse updateProfile(String username, String firstName, String lastName, String phone, String address) {
        Customer customer = findByUsername(username);
        if (firstName != null) customer.setFirstName(firstName);
        if (lastName != null) customer.setLastName(lastName);
        if (phone != null) customer.setPhone(phone);
        if (address != null) customer.setAddress(address);
        return toResponse(customer);
    }

    private CustomerResponse toResponse(Customer c) {
        return new CustomerResponse(
                c.getId(),
                c.getUser().getId(),
                c.getUser().getUsername(),
                c.getUser().getEmail(),
                c.getFirstName(),
                c.getLastName(),
                c.getPhone(),
                c.getAddress());
    }
}
