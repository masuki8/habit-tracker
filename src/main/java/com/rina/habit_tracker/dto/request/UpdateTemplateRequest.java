package com.rina.habit_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateTemplateRequest(
        @NotBlank(message = "Content cannot be blank")
        String content) {
}
