package com.rina.habit_tracker;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.rina.habit_tracker.dto.request.CreateHabitRequest;
import com.rina.habit_tracker.dto.request.CreateRecordRequest;
import com.rina.habit_tracker.dto.request.CreateTemplateRequest;
import com.rina.habit_tracker.dto.request.CreateUserRequest;
import com.rina.habit_tracker.dto.response.HabitResponse;
import com.rina.habit_tracker.dto.response.RecordResponse;
import com.rina.habit_tracker.dto.response.TemplateResponse;
import com.rina.habit_tracker.dto.response.UserResponse;
import com.rina.habit_tracker.repository.HabitRepository;
import com.rina.habit_tracker.repository.RecordRepository;
import com.rina.habit_tracker.repository.TemplateRepository;
import com.rina.habit_tracker.repository.UserRepository;
import com.rina.habit_tracker.service.HabitService;
import com.rina.habit_tracker.service.RecordService;
import com.rina.habit_tracker.service.TemplateService;
import com.rina.habit_tracker.service.UserService;

import jakarta.persistence.EntityManager;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;
    @Autowired
    private HabitService habitService;
    @Autowired
    private RecordService recordService;
    @Autowired
    private TemplateService templateService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HabitRepository habitRepository;
    @Autowired
    private RecordRepository recordRepository;
    @Autowired
    private TemplateRepository templateRepository;
    @Autowired
    private EntityManager entityManager;

    @Test
    void shouldPersistNameWhenCreatingUser() {
        CreateUserRequest request = new CreateUserRequest(
            "service@example.com",
            "service_user",
            "Test User",
            "password123"
        );

        UserResponse createdUser = userService.createUser(request);

        assertThat(createdUser.id()).isNotNull();
        assertThat(createdUser.name()).isEqualTo("Test User");
    }

    @Test
    void shouldDeleteRelatedDataWhenDeletingUser() {
        UserResponse createdUser = userService.createUser(new CreateUserRequest(
            "service@example.com",
            "service_user",
            "Test User",
            "password123"
        ));

        HabitResponse createdHabit = habitService.createHabit(
            createdUser.id(),
            new CreateHabitRequest("title", "description")
        );

        RecordResponse createdRecord = recordService.createRecord(
            createdUser.id(),
            new CreateRecordRequest(createdHabit.id(), "content", null, LocalDate.now(), 3)
        );

        TemplateResponse createdTemplate = templateService.createTemplate(
            createdHabit.id(),
            createdUser.id(),
            new CreateTemplateRequest("template")
        );

        userService.deleteUser(createdUser.id(), createdUser.id());
        userRepository.flush();
        entityManager.clear();

        assertThat(userRepository.findById(createdUser.id())).isEmpty();
        assertThat(habitRepository.findById(createdHabit.id())).isEmpty();
        assertThat(recordRepository.findById(createdRecord.id())).isEmpty();
        assertThat(templateRepository.findById(createdTemplate.id())).isEmpty();
    }
}
