package com.rina.habit_tracker.dto.response;

public record UserResponse(
        Long id,
        String accountId,
        String name,
        String email) {
}
