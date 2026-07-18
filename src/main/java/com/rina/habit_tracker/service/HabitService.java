package com.rina.habit_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rina.habit_tracker.dto.CreateHabitRequest;
import com.rina.habit_tracker.dto.UpdateHabitRequest;
import com.rina.habit_tracker.entity.Habit;
import com.rina.habit_tracker.entity.User;
import com.rina.habit_tracker.repository.HabitRepository;
import com.rina.habit_tracker.repository.UserRepository;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    public HabitService(HabitRepository habitRepository, UserRepository userRepository) {
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
    }

    public Habit createHabit(CreateHabitRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Habit habit = new Habit();
        habit.setTitle(request.getTitle());
        habit.setDescription(request.getDescription());
        habit.setUser(user);
        return habitRepository.save(habit);
    }

    public List<Habit> getAllHabits() {
        return habitRepository.findAll();
    }

    public Habit getHabitById(Long id) {
        return habitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
    }

    public Habit updateHabit(Long id, UpdateHabitRequest request) {
        Habit habit = getHabitById(id);
        if (request.getTitle() != null) {
            habit.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            habit.setDescription(request.getDescription());
        }
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            habit.setUser(user);
        }
        return habitRepository.save(habit);
    }

    public void deleteHabit(Long id) {
        Habit habit = getHabitById(id);
        habitRepository.delete(habit);
    }
}
