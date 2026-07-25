package com.rina.habit_tracker.dto.response;

import java.time.YearMonth;
import java.util.List;

public record MonthlyRecordsResponse(
        YearMonth month,
        List<DailyRecordsResponse> records
) {
}
