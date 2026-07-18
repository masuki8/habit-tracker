package com.rina.habit_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rina.habit_tracker.entity.Habit;

public interface HabitRepository extends JpaRepository<Habit, Long> {
}
