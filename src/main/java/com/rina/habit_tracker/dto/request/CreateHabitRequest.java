package com.rina.habit_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateHabitRequest(
        @NotBlank(message = "Title cannot be blank")
        String title,
        String description,
        Long userId){
}
