package com.rina.habit_tracker.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Email(message = "Email must be valid") String email,
        @Size(min = 2, message = "name must be at least 2 characters") String name,
        @Size(min = 6, message = "Password must be at least 6 characters") String password) {
}
