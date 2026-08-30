package com.rina.habit_tracker.controller.Me;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rina.habit_tracker.dto.request.UpdateUserRequest;
import com.rina.habit_tracker.dto.response.UserResponse;
import com.rina.habit_tracker.security.AuthenticatedUser;
import com.rina.habit_tracker.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/me")
public class MeUserController {

    private final UserService userService;

    public MeUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponse getMe(@AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return userService.getUserById(authenticatedUser.id());
    }

    @PutMapping
    public UserResponse updateMe(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody UpdateUserRequest request) {
        return userService.updateUser(authenticatedUser.id(), authenticatedUser.id(), request);
    }
}
