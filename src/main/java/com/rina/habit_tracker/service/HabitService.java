package com.rina.habit_tracker.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public HabitResponse createHabit(Long userId, CreateHabitRequest request) {
        User user = userRepository.findById(userId)
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

    public List<HabitResponse> getUserHabits(Long userId) {
        return habitRepository.findByUserId(userId)
                .stream()
                .map(this::mapToHabitResponse)
                .collect(Collectors.toList());
    }

    public HabitResponse getHabitById(Long id) {
        return habitRepository.findById(id)
                .map(this::mapToHabitResponse)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
    }

    public HabitResponse updateHabit(Long id, Long userId, UpdateHabitRequest request) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot update this habit");
        }

        if (request.title() != null) {
            habit.setTitle(request.title());
        }
        if (request.description() != null) {
            habit.setDescription(request.description());
        }
        return mapToHabitResponse(habitRepository.save(habit));
    }

    public void deleteHabit(Long id, Long userId) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete this habit");
        }

        habitRepository.delete(habit);
    }

    private HabitResponse mapToHabitResponse(Habit habit) {
        int recordsCount = habit.getRecords().size();
        return new HabitResponse(
            habit.getId(),
            habit.getTitle(),
            habit.getDescription(),
            habit.getUser().getId(),
            recordsCount
        );
    }
}
