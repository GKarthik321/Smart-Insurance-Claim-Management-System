package com.smartinsurance.claims.config;

import com.smartinsurance.claims.entity.RoleType;
import com.smartinsurance.claims.entity.User;
import com.smartinsurance.claims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default administrator and claims officer account on first startup
 * so the application is immediately usable after deployment.
 * Change these default passwords in production.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("admin", "Admin@123", "admin@smartinsurance.local", RoleType.ADMIN);
        seedUser("officer1", "Officer@123", "officer1@smartinsurance.local", RoleType.CLAIMS_OFFICER);
        seedUser("agent1", "Agent@123", "agent1@smartinsurance.local", RoleType.AGENT);
    }

    private void seedUser(String username, String rawPassword, String email, RoleType role) {
        if (userRepository.existsByUsername(username)) {
            return;
        }
        userRepository.save(User.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPassword))
                .email(email)
                .role(role)
                .enabled(true)
                .build());
        log.info("Seeded default {} account: username='{}'", role, username);
    }
}
