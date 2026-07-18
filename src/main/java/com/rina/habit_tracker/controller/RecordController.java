package com.rina.habit_tracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.rina.habit_tracker.dto.CreateHabitRequest;
import com.rina.habit_tracker.dto.CreateRecordRequest;
import com.rina.habit_tracker.dto.HabitResponse;
import com.rina.habit_tracker.dto.RecordResponse;
import com.rina.habit_tracker.dto.UpdateHabitRequest;
import com.rina.habit_tracker.dto.UpdateRecordRequest;
import com.rina.habit_tracker.service.RecordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("records")
public class RecordController {

    private final RecordService recordService;

    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping
    public List<RecordResponse> getAllRecords() {
        return recordService.getAllRecords();
    }

    @GetMapping("/{id}")
    public RecordResponse getRecordById(@PathVariable Long id) {
        return recordService.getRecordById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecordResponse createRecord(@Valid @RequestBody CreateRecordRequest request) {
        return recordService.createRecord(request);
    }

    @PutMapping("/{id}")
    public RecordResponse updateRecord(@PathVariable Long id, @Valid @RequestBody UpdateRecordRequest request) {
        return recordService.updateRecord(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecord(@PathVariable Long id) {
        recordService.deleteRecord(id);
    }
}
