package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.request.LoginRequest;
import com.smartinsurance.claims.dto.request.RegisterRequest;
import com.smartinsurance.claims.dto.response.AuthResponse;
import com.smartinsurance.claims.entity.Customer;
import com.smartinsurance.claims.entity.RoleType;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.exception.BadRequestException;
import com.smartinsurance.claims.repository.CustomerRepository;
import com.smartinsurance.claims.repository.UserRepository;
import com.smartinsurance.claims.security.JwtService;
import com.smartinsurance.claims.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("Username already taken: " + request.username());
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered: " + request.email());
        }

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .email(request.email())
                .role(RoleType.CUSTOMER)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        Customer customer = Customer.builder()
                .user(user)
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .address(request.address())
                .build();
        customerRepository.save(customer);

        String token = jwtService.generateToken(new UserPrincipal(user));
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), expirationMs);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        String token = jwtService.generateToken(new UserPrincipal(user));
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), expirationMs);
    }
}
