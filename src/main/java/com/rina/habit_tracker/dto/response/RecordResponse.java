package com.rina.habit_tracker.dto.response;

import java.time.LocalDate;

public record RecordResponse(
        Long id,
        Long habitId,
        String content,
        String imageUrl,
        LocalDate recordDate,
        Integer level) {
}
