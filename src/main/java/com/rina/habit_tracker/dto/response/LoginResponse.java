package com.rina.habit_tracker.dto.response;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn) {
}
