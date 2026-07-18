package com.rina.habit_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateHabitRequest {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    private String description;

    private Long userId;
}
