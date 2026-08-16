package com.rina.habit_tracker.dto.response;

import java.time.LocalDate;

public record DailyRecordsResponse(
    LocalDate recordDate,
    int level
) {
}
