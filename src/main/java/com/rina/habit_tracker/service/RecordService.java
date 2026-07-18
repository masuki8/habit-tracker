package com.rina.habit_tracker.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rina.habit_tracker.dto.CreateRecordRequest;
import com.rina.habit_tracker.dto.RecordResponse;
import com.rina.habit_tracker.dto.UpdateRecordRequest;
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

    public RecordResponse createRecord(CreateRecordRequest request) {
        Habit habit = habitRepository.findById(request.getHabitId())
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        Record record = new Record();
        record.setHabit(habit);
        record.setContent(request.getContent());
        record.setImageUrl(request.getImageUrl());
        return mapToRecordResponse(recordRepository.save(record));
    }

    public List<RecordResponse> getAllRecords() {
        return recordRepository.findAll().stream()
                .map(this::mapToRecordResponse)
                .collect(Collectors.toList());
    }

    public RecordResponse getRecordById(Long id) {
        return recordRepository.findById(id)
                .map(this::mapToRecordResponse)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));
    }

    public RecordResponse updateRecord(Long id, UpdateRecordRequest request) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        if (request.getContent() != null) {
            record.setContent(request.getContent());
        }
        if (request.getImageUrl() != null) {
            record.setImageUrl(request.getImageUrl());
        }
        if (request.getHabitId() != null) {
            Habit habit = habitRepository.findById(request.getHabitId())
                    .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
            record.setHabit(habit);
        }
        return mapToRecordResponse(recordRepository.save(record));
    }

    public void deleteRecord(Long id) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
        recordRepository.delete(record);
    }

    private RecordResponse mapToRecordResponse(Record record) {
        RecordResponse response = new RecordResponse();
        response.setId(record.getId());
        response.setHabit(record.getHabit());
        response.setContent(record.getContent());
        response.setImageUrl(record.getImageUrl());
        response.setCreatedAt(record.getCreatedAt());
        response.setUpdatedAt(record.getUpdatedAt());
        return response;
    }
}
