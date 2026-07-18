package com.rina.habit_tracker;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.rina.habit_tracker.entity.Habit;
import com.rina.habit_tracker.entity.User;
import com.rina.habit_tracker.repository.HabitRepository;
import com.rina.habit_tracker.repository.UserRepository;

@SpringBootTest
@Transactional
class HabitRepositoryTest{

    @Autowired
    private HabitRepository habitRepository;
    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldPersistHabitWithTimestampColumns() {
        User user = new User();
        user.setName("Mission User");
        user.setEmail("mission-user@example.com");
        user.setPassword("password123");
        User savedUser = userRepository.saveAndFlush(user);

        var title = "go to the gym";
        var description = "go to the gym to improve health";
        Habit habit = new Habit();
        habit.setTitle(title);
        habit.setDescription(description);
        habit.setUser(savedUser);
        Habit savedHabit = habitRepository.saveAndFlush(habit);

        assertThat(savedHabit.getId()).isNotNull();
        assertThat(savedHabit.getTitle()).isNotNull();
        assertThat(savedHabit.getTitle()).isEqualTo(title);
        assertThat(savedHabit.getDescription()).isEqualTo(description);
        assertThat(savedHabit.getUser()).isNotNull();
        assertThat(savedHabit.getUser().getId()).isEqualTo(savedUser.getId());
        assertThat(savedHabit.getCreatedAt()).isNotNull();
        assertThat(savedHabit.getUpdatedAt()).isNotNull();

    }
}
