package com.rina.habit_tracker.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateHabitRequest {

    private String title;

    private String description;

    private Long userId;
}