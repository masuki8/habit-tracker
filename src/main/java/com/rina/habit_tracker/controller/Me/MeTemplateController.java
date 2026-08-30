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

import com.rina.habit_tracker.dto.request.CreateTemplateRequest;
import com.rina.habit_tracker.dto.request.UpdateTemplateRequest;
import com.rina.habit_tracker.dto.response.TemplateResponse;
import com.rina.habit_tracker.security.AuthenticatedUser;
import com.rina.habit_tracker.service.TemplateService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/me/habits/{habitId}/template")
public class MeTemplateController {

    private final TemplateService templateService;

    public MeTemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping
    public TemplateResponse getTemplate(
            @PathVariable Long habitId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return templateService.getTemplate(habitId, authenticatedUser.id());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TemplateResponse createTemplate(
            @PathVariable Long habitId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody CreateTemplateRequest request) {
        return templateService.createTemplate(habitId, authenticatedUser.id(), request);
    }

    @PutMapping
    public TemplateResponse updateTemplate(
            @PathVariable Long habitId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody UpdateTemplateRequest request) {
        return templateService.updateTemplate(habitId, authenticatedUser.id(), request);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTemplate(
            @PathVariable Long habitId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        templateService.deleteTemplate(habitId, authenticatedUser.id());
    }
}
