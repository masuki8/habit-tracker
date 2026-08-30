package com.rina.habit_tracker.dto.request;

import static com.rina.habit_tracker.validation.AccountIdPolicy.MAX_LENGTH;
import static com.rina.habit_tracker.validation.AccountIdPolicy.MIN_LENGTH;
import static com.rina.habit_tracker.validation.AccountIdPolicy.PATTERN;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "Email cannot be blank") @Email(message = "Email must be valid") String email,
        @NotBlank(message = "Account ID cannot be blank")
        @Size(min = MIN_LENGTH, max = MAX_LENGTH, message = "Account ID must be between 3 and 30 characters")
        @Pattern(regexp = PATTERN, message = "Account ID contains unsupported characters")
        String accountId,
        @NotBlank(message = "name cannot be blank") @Size(min = 2, message = "name must be at least 2 characters") String name,
        @NotBlank(message = "Password cannot be blank") @Size(min = 6, message = "Password must be at least 6 characters") String password) {
}
