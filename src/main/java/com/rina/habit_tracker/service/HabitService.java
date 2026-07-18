package com.rina.habit_tracker.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rina.habit_tracker.dto.CreateHabitRequest;
import com.rina.habit_tracker.dto.HabitResponse;
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

    public HabitResponse createHabit(CreateHabitRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Habit habit = new Habit();
        habit.setTitle(request.getTitle());
        habit.setDescription(request.getDescription());
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
        return mapToHabitResponse(habitRepository.save(habit));
    }

    public void deleteHabit(Long id) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
        habitRepository.delete(habit);
    }

    private HabitResponse mapToHabitResponse(Habit habit) {
        HabitResponse response = new HabitResponse();
        response.setId(habit.getId());
        response.setTitle(habit.getTitle());
        response.setDescription(habit.getDescription());
        response.setCreatedAt(habit.getCreatedAt());
        response.setUpdatedAt(habit.getUpdatedAt());
        response.setUser(habit.getUser());
        response.setUserName(habit.getUser().getName());
        return response;
    }
}
