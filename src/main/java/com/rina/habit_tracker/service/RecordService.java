package com.rina.habit_tracker.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rina.habit_tracker.dto.request.CreateRecordRequest;
import com.rina.habit_tracker.dto.request.UpdateRecordRequest;
import com.rina.habit_tracker.dto.response.RecordResponse;
import com.rina.habit_tracker.dto.response.DailyRecordsResponse;
import com.rina.habit_tracker.dto.response.MonthlyRecordsResponse;
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

    public RecordResponse createRecord(Long userId, CreateRecordRequest request) {
        Habit habit = habitRepository.findById(request.habitId())
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You cannot create a record for this habit");
        }

        Record record = new Record();
        record.setHabit(habit);
        record.setContent(request.content());
        record.setImageUrl(request.imageUrl());
        return mapToRecordResponse(recordRepository.save(record));
    }

    public List<RecordResponse> getAllRecords() {
        return recordRepository.findAll().stream()
                .map(this::mapToRecordResponse)
                .collect(Collectors.toList());
    }

    public List<RecordResponse> getHabitRecords(Long habitId) {
        return recordRepository.findByHabitId(habitId)
                .stream()
                .map(this::mapToRecordResponse)
                .collect(Collectors.toList());
    }

    public RecordResponse getRecordById(Long id) {
        return recordRepository.findById(id)
                .map(this::mapToRecordResponse)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));
    }

    public RecordResponse updateRecord(Long id, Long userId, UpdateRecordRequest request) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        if (!record.getHabit().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You cannot update this record");
        }
        if (request.content() != null) {
            record.setContent(request.content());
        }
        if (request.imageUrl() != null) {
            record.setImageUrl(request.imageUrl());
        }
        Habit habit = habitRepository.findById(request.habitId())
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
        record.setHabit(habit);
        return mapToRecordResponse(recordRepository.save(record));
    }

    public void deleteRecord(Long id, Long userId) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
        if (!record.getHabit().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You cannot delete this record");
        }
        recordRepository.delete(record);
    }

    public MonthlyRecordsResponse getMonthlyRecords(Long habitId, YearMonth month) {
        Map<LocalDate, Long> recordsByDate = recordRepository
                .findByHabitIdAndRecodeDateBetweenOrderByRecodeDateAsc(habitId, month.atDay(1), month.atEndOfMonth())
                .stream()
                .collect(Collectors.groupingBy(
                        Record::getRecodeDate,
                        LinkedHashMap::new,
                        Collectors.counting()));

        List<DailyRecordsResponse> records = recordsByDate.entrySet().stream()
                .map(entry -> new DailyRecordsResponse(entry.getKey(), Math.toIntExact(entry.getValue())))
                .toList();
        return new MonthlyRecordsResponse(month, records);
    }

    private RecordResponse mapToRecordResponse(Record record) {
        return new RecordResponse(
            record.getId(),
            record.getHabit().getId(),
            record.getContent(),
            record.getImageUrl(),
            record.getCreatedAt().toLocalDate());
    }
}
