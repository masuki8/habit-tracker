package com.rina.habit_tracker.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rina.habit_tracker.dto.request.CreateRecordRequest;
import com.rina.habit_tracker.dto.request.UpdateRecordRequest;
import com.rina.habit_tracker.dto.response.DailyRecordsResponse;
import com.rina.habit_tracker.dto.response.MonthlyRecordsResponse;
import com.rina.habit_tracker.dto.response.RecordResponse;
import com.rina.habit_tracker.entity.Habit;
import com.rina.habit_tracker.entity.Record;
import com.rina.habit_tracker.repository.HabitRepository;
import com.rina.habit_tracker.repository.RecordRepository;

@Service
public class RecordService {

    private final RecordRepository recordRepository;
    private final HabitRepository habitRepository;

    public RecordService(RecordRepository recordRepository, HabitRepository habitRepository) {
        this.recordRepository = recordRepository;
        this.habitRepository = habitRepository;
    }

    public List<RecordResponse> getAllRecords() {
        return recordRepository.findAll().stream()
                .map(this::mapToRecordResponse)
                .collect(Collectors.toList());
    }

    public List<RecordResponse> getHabitRecords(Long habitId, Long userId) {
        if (habitRepository.findByIdAndUserId(habitId, userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Habit not found");
        }

        return recordRepository.findByHabitId(habitId)
                .stream()
                .map(this::mapToRecordResponse)
                .collect(Collectors.toList());
    }

    public RecordResponse getRecordById(Long recordId, Long userId) {
        return recordRepository.findByIdAndHabitUserId(recordId, userId)
                .map(this::mapToRecordResponse)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));
    }

    public RecordResponse createRecord(Long userId, CreateRecordRequest request) {
        Habit habit = habitRepository.findByIdAndUserId(request.habitId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        LocalDate recordDate = request.recordDate() != null ? request.recordDate() : LocalDate.now();
        validateRecordDate(habit, recordDate);

        Record record = new Record();
        record.setHabit(habit);
        record.setContent(request.content());
        record.setImageUrl(request.imageUrl());
        record.setRecordDate(recordDate);
        record.setLevel(request.level() != null ? request.level() : 3);
        return mapToRecordResponse(recordRepository.save(record));
    }

    public RecordResponse updateRecord(Long recordId, Long userId, UpdateRecordRequest request) {
        Record record = recordRepository.findByIdAndHabitUserId(recordId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        Long habitId = request.habitId() != null
                ? request.habitId()
                : record.getHabit().getId();

        Habit habit = habitRepository.findByIdAndUserId(habitId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        if (request.content() != null) {
            record.setContent(request.content());
        }
        if (request.imageUrl() != null) {
            record.setImageUrl(request.imageUrl());
        }
        if (request.level() > 0) {
            record.setLevel(request.level());
        }
        if (request.recordDate() != null) {
            validateRecordDate(habit, request.recordDate());
            record.setRecordDate(request.recordDate());
        }
        record.setHabit(habit);
        return mapToRecordResponse(recordRepository.save(record));
    }

    public void deleteRecord(Long recordId, Long userId) {
        Record record = recordRepository.findByIdAndHabitUserId(recordId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
        recordRepository.delete(record);
    }

    public MonthlyRecordsResponse getMonthlyRecords(Long habitId, YearMonth month) {
        List<Record> periodRecords = recordRepository
                .findByHabitIdAndRecordDateBetweenOrderByRecordDateAsc(
                        habitId, month.atDay(1), month.atEndOfMonth());
        List<DailyRecordsResponse> records = getHighestLevelByDate(periodRecords);
        return new MonthlyRecordsResponse(month, records);
    }

    public List<DailyRecordsResponse> getRecordsByDateRange(Long habitId, LocalDate fromDate, LocalDate toDate) {
        List<Record> periodRecords = recordRepository
                .findByHabitIdAndRecordDateBetweenOrderByRecordDateAsc(habitId, fromDate, toDate);
        return getHighestLevelByDate(periodRecords);
    }

    // 1日に複数レコードがある場合は一番高いlevelを返す
    private List<DailyRecordsResponse> getHighestLevelByDate(List<Record> records) {
        Map<LocalDate, Integer> highestLevelByDate = records.stream()
                .collect(Collectors.toMap(
                        Record::getRecordDate,
                        record -> record.getLevel() != null ? record.getLevel() : 0,
                        Math::max,
                        LinkedHashMap::new));

        return highestLevelByDate.entrySet().stream()
                .map(entry -> new DailyRecordsResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    private void validateRecordDate(Habit habit, LocalDate recordDate) {
        LocalDate habitCreatedDate = habit.getCreatedAt().toLocalDate();
        if (recordDate.isBefore(habitCreatedDate) || recordDate.isAfter(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Record date must be between the habit creation date and today");
        }
    }

    private RecordResponse mapToRecordResponse(Record record) {
        return new RecordResponse(
            record.getId(),
            record.getHabit().getId(),
            record.getContent(),
            record.getImageUrl(),
            record.getRecordDate(),
            record.getLevel());
    }
}
