package com.rina.habit_tracker.controller.Me;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.rina.habit_tracker.dto.request.CreateRecordRequest;
import com.rina.habit_tracker.dto.request.UpdateRecordRequest;
import com.rina.habit_tracker.dto.response.RecordResponse;
import com.rina.habit_tracker.security.AuthenticatedUser;
import com.rina.habit_tracker.service.RecordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/me/records")
public class MeRecordController {

    private final RecordService recordService;

    public MeRecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping("/{recordId}")
    public RecordResponse getMyRecordById(@PathVariable Long recordId) {
        return recordService.getRecordById(recordId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecordResponse createRecord(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody CreateRecordRequest request) {
        return recordService.createRecord(authenticatedUser.id(), request);
    }

    @PutMapping("/{recordId}")
    public RecordResponse updateRecord(
            @PathVariable Long recordId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody UpdateRecordRequest request) {
        return recordService.updateRecord(recordId, authenticatedUser.id(),request);
    }

    @DeleteMapping("/{recordId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecord(
            @PathVariable Long recordId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        recordService.deleteRecord(recordId, authenticatedUser.id());
    }
}
