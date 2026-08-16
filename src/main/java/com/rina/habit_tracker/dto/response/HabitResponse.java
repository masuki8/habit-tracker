package com.rina.habit_tracker.dto.response;

import java.util.List;

public record HabitResponse(
        Long id,
        String title,
        String description,
        Long userId,
        int recordsCount,
        List<DailyRecordsResponse> twoWeekRecords
) {
}
