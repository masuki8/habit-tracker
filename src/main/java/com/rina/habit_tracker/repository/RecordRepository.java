package com.rina.habit_tracker.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rina.habit_tracker.entity.Record;

public interface RecordRepository extends JpaRepository<Record, Long> {

    List<Record> findByHabitId(Long habitId);
    List<Record> findByHabitIdAndRecodeDateBetweenOrderByRecodeDateAsc(
            Long habitId, LocalDate startDate, LocalDate endDate);
}
