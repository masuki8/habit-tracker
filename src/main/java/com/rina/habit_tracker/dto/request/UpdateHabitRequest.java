package com.rina.habit_tracker.dto.request;

public record UpdateHabitRequest(
        String title,
        String description,
        Long userId) {
}
