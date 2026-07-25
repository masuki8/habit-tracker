package com.rina.habit_tracker.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rina.habit_tracker.dto.request.CreateHabitRequest;
import com.rina.habit_tracker.dto.request.UpdateHabitRequest;
import com.rina.habit_tracker.dto.response.HabitResponse;
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

    public HabitResponse createHabit(CreateHabitRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Habit habit = new Habit();
        habit.setTitle(request.title());
        habit.setDescription(request.description());
        habit.setUser(user);
        return mapToHabitResponse(habitRepository.save(habit));
    }

    public List<HabitResponse> getAllHabits() {
        return habitRepository.findAll().stream()
                .map(this::mapToHabitResponse)
                .collect(Collectors.toList());
    }

    public HabitResponse getHabitById(Long id) {
        return habitRepository.findById(id)
                .map(this::mapToHabitResponse)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
    }

    public HabitResponse updateHabit(Long id, UpdateHabitRequest request) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        if (request.title() != null) {
            habit.setTitle(request.title());
        }
        if (request.description() != null) {
            habit.setDescription(request.description());
        }
        if (request.userId() != null) {
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            habit.setUser(user);
        }
        return mapToHabitResponse(habitRepository.save(habit));
    }

    public void deleteHabit(Long id) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
        habitRepository.delete(habit);
    }

    private HabitResponse mapToHabitResponse(Habit habit) {
        return new HabitResponse(
            habit.getId(),
            habit.getTitle(),
            habit.getDescription(),
            habit.getUser().getId());
    }
}
