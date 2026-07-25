package com.rina.habit_tracker.controller;

import java.time.YearMonth;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.rina.habit_tracker.dto.response.MonthlyRecordsResponse;
import com.rina.habit_tracker.service.RecordService;

@RestController
public class MonthlyRecordsController {

    private final RecordService recordService;

    public MonthlyRecordsController(RecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping("/habits/{habitId}/month/{month}")
    public MonthlyRecordsResponse getMonthlyRecords(
            @PathVariable Long habitId,
            @PathVariable String month) {
        try {
            return recordService.getMonthlyRecords(habitId, YearMonth.parse(month));
        } catch (java.time.format.DateTimeParseException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Month must use YYYY-MM format", exception);
        }
    }
}
