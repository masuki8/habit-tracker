package com.rina.habit_tracker.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "Email cannot be blank") @Email(message = "Email must be valid") String email,
        @NotBlank(message = "name cannot be blank") @Size(min = 2, message = "name must be at least 2 characters") String name,
        @NotBlank(message = "Password cannot be blank") @Size(min = 6, message = "Password must be at least 6 characters") String password) {
}
