package com.rina.habit_tracker.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rina.habit_tracker.dto.request.CreateHabitRequest;
import com.rina.habit_tracker.dto.request.UpdateHabitRequest;
import com.rina.habit_tracker.dto.response.DailyRecordsResponse;
import com.rina.habit_tracker.dto.response.HabitResponse;
import com.rina.habit_tracker.entity.Habit;
import com.rina.habit_tracker.entity.User;
import com.rina.habit_tracker.repository.HabitRepository;
import com.rina.habit_tracker.repository.UserRepository;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final RecordService recordService;

    public HabitService(HabitRepository habitRepository, UserRepository userRepository, RecordService recordService) {
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
        this.recordService = recordService;
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

    public HabitResponse getHabitById(Long id, Long userId) {
        return habitRepository.findByIdAndUserId(id, userId)
                .map(this::mapToHabitResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habit not found"));
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
        LocalDate currentWeekStart = LocalDate.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate twoWeekStart = currentWeekStart.minusWeeks(1);
        LocalDate twoWeekEnd = currentWeekStart.plusDays(6);
        List<DailyRecordsResponse> twoWeekRecords = recordService.getRecordsByDateRange(
                habit.getId(), twoWeekStart, twoWeekEnd);

        return new HabitResponse(
            habit.getId(),
            habit.getTitle(),
            habit.getDescription(),
            habit.getUser().getId(),
            recordsCount,
            twoWeekRecords
        );
    }
}
