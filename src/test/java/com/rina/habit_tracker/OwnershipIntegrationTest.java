package com.rina.habit_tracker;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.rina.habit_tracker.dto.request.UpdateHabitRequest;
import com.rina.habit_tracker.dto.request.UpdateRecordRequest;
import com.rina.habit_tracker.dto.request.UpdateTemplateRequest;
import com.rina.habit_tracker.dto.request.UpdateUserRequest;
import com.rina.habit_tracker.entity.Habit;
import com.rina.habit_tracker.entity.Record;
import com.rina.habit_tracker.entity.Template;
import com.rina.habit_tracker.entity.User;
import com.rina.habit_tracker.repository.HabitRepository;
import com.rina.habit_tracker.repository.RecordRepository;
import com.rina.habit_tracker.repository.TemplateRepository;
import com.rina.habit_tracker.repository.UserRepository;
import com.rina.habit_tracker.service.HabitService;
import com.rina.habit_tracker.service.RecordService;
import com.rina.habit_tracker.service.TemplateService;
import com.rina.habit_tracker.service.UserService;

@SpringBootTest
@Transactional
class OwnershipIntegrationTest {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HabitRepository habitRepository;
    @Autowired
    private RecordRepository recordRepository;
    @Autowired
    private TemplateRepository templateRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private HabitService habitService;
    @Autowired
    private RecordService recordService;
    @Autowired
    private TemplateService templateService;

    private User owner;
    private User otherUser;
    private Habit habit;
    private Record record;

    @BeforeEach
    void setUp() {
        owner = saveUser("owner@example.com", "owner_user");
        otherUser = saveUser("other@example.com", "other_user");

        habit = new Habit();
        habit.setTitle("Owner habit");
        habit.setUser(owner);
        habit = habitRepository.saveAndFlush(habit);

        record = new Record();
        record.setHabit(habit);
        record.setContent("Owner record");
        record.setRecordDate(LocalDate.now());
        record.setLevel(3);
        record = recordRepository.saveAndFlush(record);

        Template template = new Template();
        template.setHabit(habit);
        template.setContent("Owner template");
        templateRepository.saveAndFlush(template);
    }

    @Test
    void shouldRejectAccessToAnotherUsersHabit() {
        assertThatThrownBy(() -> habitService.getHabitById(habit.getId(), otherUser.getId()))
                .isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> habitService.updateHabit(
                habit.getId(), otherUser.getId(), new UpdateHabitRequest("Changed", null)))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> habitService.deleteHabit(habit.getId(), otherUser.getId()))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void shouldRejectAccessToAnotherUsersRecord() {
        assertThatThrownBy(() -> recordService.getRecordById(record.getId(), otherUser.getId()))
                .isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> recordService.updateRecord(
                record.getId(), otherUser.getId(), new UpdateRecordRequest(null, "Changed", null, null, null)))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> recordService.deleteRecord(record.getId(), otherUser.getId()))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void shouldRejectAccessToAnotherUsersTemplate() {
        assertThatThrownBy(() -> templateService.getTemplate(habit.getId(), otherUser.getId()))
                .isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> templateService.updateTemplate(
                habit.getId(), otherUser.getId(), new UpdateTemplateRequest("Changed")))
                .isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> templateService.deleteTemplate(habit.getId(), otherUser.getId()))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void shouldRejectUpdatingOrDeletingAnotherUser() {
        assertThatThrownBy(() -> userService.updateUser(
                owner.getId(), otherUser.getId(), new UpdateUserRequest(null, "Changed", null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("You cannot update this user");
        assertThatThrownBy(() -> userService.deleteUser(owner.getId(), otherUser.getId()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("You cannot delete this user");
    }

    private User saveUser(String email, String accountId) {
        User user = new User();
        user.setName("Test User");
        user.setEmail(email);
        user.setAccountId(accountId);
        user.setPassword("encoded-password");
        return userRepository.saveAndFlush(user);
    }
}
