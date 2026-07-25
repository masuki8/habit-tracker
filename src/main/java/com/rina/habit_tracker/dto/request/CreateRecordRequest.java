package com.rina.habit_tracker.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateRecordRequest(
        @NotNull Long habitId,
        String content,
        String imageUrl) {
}
