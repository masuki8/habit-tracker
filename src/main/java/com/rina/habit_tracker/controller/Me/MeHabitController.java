package com.rina.habit_tracker.controller.Me;

import java.util.List;

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

import com.rina.habit_tracker.dto.request.CreateHabitRequest;
import com.rina.habit_tracker.dto.request.UpdateHabitRequest;
import com.rina.habit_tracker.dto.response.HabitResponse;
import com.rina.habit_tracker.dto.response.RecordResponse;
import com.rina.habit_tracker.security.AuthenticatedUser;
import com.rina.habit_tracker.service.HabitService;
import com.rina.habit_tracker.service.RecordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/me/habits")
public class MeHabitController {

    private final RecordService recordService;
    private final HabitService habitService;

    public MeHabitController(HabitService habitService, RecordService recordService) {
        this.habitService = habitService;
        this.recordService = recordService;
    }

    @GetMapping
    public List<HabitResponse> getMyHabits(@AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return habitService.getUserHabits(authenticatedUser.id());
    }

    @GetMapping("/{habitId}")
    public HabitResponse getMyHabitById(
            @PathVariable Long habitId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return habitService.getHabitById(habitId, authenticatedUser.id());
    }

    @GetMapping("/{habitId}/records")
    public List<RecordResponse> getHabitRecords(
            @PathVariable Long habitId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return recordService.getHabitRecords(habitId, authenticatedUser.id());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HabitResponse createHabit(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody CreateHabitRequest request) {
        return habitService.createHabit(authenticatedUser.id(), request);
    }

    @PutMapping("/{habitId}")
    public HabitResponse updateHabit(
            @PathVariable Long habitId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody UpdateHabitRequest request) {
        return habitService.updateHabit(habitId, authenticatedUser.id(), request);
    }

    @DeleteMapping("/{habitId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHabit(
            @PathVariable Long habitId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        habitService.deleteHabit(habitId, authenticatedUser.id());
    }
}
