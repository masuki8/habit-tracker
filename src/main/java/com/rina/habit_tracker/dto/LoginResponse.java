package com.rina.habit_tracker.dto;

public record LoginResponse(String accessToken, String tokenType, long expiresIn) {
}
