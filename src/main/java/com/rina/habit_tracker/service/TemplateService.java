package com.rina.habit_tracker.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.rina.habit_tracker.dto.request.CreateTemplateRequest;
import com.rina.habit_tracker.dto.request.UpdateTemplateRequest;
import com.rina.habit_tracker.dto.response.TemplateResponse;
import com.rina.habit_tracker.entity.Habit;
import com.rina.habit_tracker.entity.Template;
import com.rina.habit_tracker.repository.HabitRepository;
import com.rina.habit_tracker.repository.TemplateRepository;

@Service
@Transactional(readOnly = true)
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final HabitRepository habitRepository;

    public TemplateService(TemplateRepository templateRepository, HabitRepository habitRepository) {
        this.templateRepository = templateRepository;
        this.habitRepository = habitRepository;
    }

    public TemplateResponse getTemplate(Long habitId, Long userId) {
        return mapToResponse(findOwnedTemplate(habitId, userId));
    }

    @Transactional
    public TemplateResponse createTemplate(Long habitId, Long userId, CreateTemplateRequest request) {
        Habit habit = habitRepository.findByIdAndUserId(habitId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habit not found"));

        if (templateRepository.existsByHabitId(habitId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Template already exists");
        }

        Template template = new Template();
        template.setHabit(habit);
        template.setContent(request.content());
        return mapToResponse(templateRepository.save(template));
    }

    @Transactional
    public TemplateResponse updateTemplate(
            Long habitId,
            Long userId,
            UpdateTemplateRequest request) {
        Template template = findOwnedTemplate(habitId, userId);
        template.setContent(request.content());
        return mapToResponse(templateRepository.save(template));
    }

    @Transactional
    public void deleteTemplate(Long habitId, Long userId) {
        templateRepository.delete(findOwnedTemplate(habitId, userId));
    }

    private Template findOwnedTemplate(Long habitId, Long userId) {
        return templateRepository.findByHabitIdAndHabitUserId(habitId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Template not found"));
    }

    private TemplateResponse mapToResponse(Template template) {
        return new TemplateResponse(
                template.getId(),
                template.getHabit().getId(),
                template.getContent(),
                template.getCreatedAt(),
                template.getUpdatedAt());
    }
}
