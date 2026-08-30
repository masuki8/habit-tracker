package com.rina.habit_tracker.dto.response;

import java.time.LocalDateTime;

public record TemplateResponse(
        Long id,
        Long habitId,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
