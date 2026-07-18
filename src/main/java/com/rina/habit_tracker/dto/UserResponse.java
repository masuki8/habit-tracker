package com.rina.habit_tracker.dto;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Instant createdAt;
    private Instant updatedAt;
}
