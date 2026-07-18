package com.rina.habit_tracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    @Email(message = "Email must be valid")
    private String email;

    @Size(min = 2, message = "name must be at least 2 characters")
    private String name;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
}