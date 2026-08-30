package com.rina.habit_tracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.rina.habit_tracker.dto.request.CreateUserRequest;
import com.rina.habit_tracker.dto.response.AccountIdAvailabilityResponse;
import com.rina.habit_tracker.dto.response.HabitResponse;
import com.rina.habit_tracker.dto.response.RecordResponse;
import com.rina.habit_tracker.dto.response.UserResponse;
import com.rina.habit_tracker.service.HabitService;
import com.rina.habit_tracker.service.RecordService;
import com.rina.habit_tracker.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final HabitService habitService;
    private final RecordService recordService;

    public UserController(UserService userService, HabitService habitService, RecordService recordService) {
        this.userService = userService;
        this.habitService = habitService;
        this.recordService = recordService;
    }

    @GetMapping("/{userId}")
    public UserResponse getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @GetMapping("/account-id-availability")
    public AccountIdAvailabilityResponse getAccountIdAvailability(
            @RequestParam String accountId) {
        return new AccountIdAvailabilityResponse(userService.isAccountIdAvailable(accountId));
    }

    // PUBLIC DATA
    @GetMapping("/{userId}/habits")
    public List<HabitResponse> getUserHabits(@PathVariable Long userId) {
        return habitService.getUserHabits(userId);
    }

    // PUBLIC DATA
    @GetMapping("/{userId}/habits/{habitId}/records")
    public List<RecordResponse> getUserHabitRecords(@PathVariable Long userId, @PathVariable Long habitId) {
        return recordService.getHabitRecords(habitId, userId);
    }
}
