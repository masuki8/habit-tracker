package com.rina.habit_tracker.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rina.habit_tracker.dto.request.CreateUserRequest;
import com.rina.habit_tracker.dto.request.UpdateUserRequest;
import com.rina.habit_tracker.dto.response.UserResponse;
import com.rina.habit_tracker.entity.User;
import com.rina.habit_tracker.exception.ApiErrorCode;
import com.rina.habit_tracker.exception.ConflictException;
import com.rina.habit_tracker.repository.UserRepository;
import com.rina.habit_tracker.validation.AccountIdPolicy;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ConflictException(
                    ApiErrorCode.EMAIL_ALREADY_REGISTERED,
                    "Email is already registered");
        }
        String accountId = normalizeAccountId(request.accountId());
        if (userRepository.findByAccountId(accountId).isPresent()) {
            throw new ConflictException(
                    ApiErrorCode.ACCOUNT_ID_ALREADY_REGISTERED,
                    "Account ID is already registered");
        }

        User user = new User();
        user.setAccountId(accountId);
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        return mapToUserResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long userId) {
        return userRepository.findById(userId)
                .map(this::mapToUserResponse)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public boolean isAccountIdAvailable(String accountId) {
        return isAccountIdAvailable(accountId, null);
    }

    public boolean isAccountIdAvailable(String accountId, Long excludedUserId) {
        String normalizedAccountId = normalizeAccountId(accountId);
        if (!AccountIdPolicy.isValid(normalizedAccountId)) {
            return false;
        }
        return userRepository.findByAccountId(normalizedAccountId)
                .map(user -> user.getId().equals(excludedUserId))
                .orElse(true);
    }

    public UserResponse updateUser(Long userId, Long authenticatedUserId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.getId().equals(authenticatedUserId)) {
            throw new IllegalArgumentException("You cannot update this user");
        }

        if (request.name() != null) {
            user.setName(request.name());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
        }
        if (request.password() != null) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        return mapToUserResponse(userRepository.save(user));
    }

    public void deleteUser(Long userId, Long authenticatedUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!user.getId().equals(authenticatedUserId)) {
            throw new IllegalArgumentException("You cannot delete this user");
        }

        userRepository.delete(user);
    }

    public void recordSuccessfulLogin(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);
    }

    private String normalizeAccountId(String accountId) {
        return AccountIdPolicy.normalize(accountId);
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getAccountId(),
            user.getName(),
            user.getEmail()
        );
    }
}
