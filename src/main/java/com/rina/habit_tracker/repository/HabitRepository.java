package com.rina.habit_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rina.habit_tracker.entity.Habit;

import java.util.List;
import java.util.Optional;


public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserId(Long userId);
    Optional<Habit> findByIdAndUserId(Long id, Long userId);
}
