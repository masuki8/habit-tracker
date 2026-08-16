package com.rina.habit_tracker.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateRecordRequest(
        @NotNull Long habitId,
        String content,
        String imageUrl,
        LocalDate recordDate,
        @Min(1) @Max(5) Integer level) {
}
