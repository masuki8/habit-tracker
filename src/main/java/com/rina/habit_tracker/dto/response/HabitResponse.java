package com.rina.habit_tracker.dto.response;

public record HabitResponse(
        Long id,
        String title,
        String description,
        Long userId) {
}
