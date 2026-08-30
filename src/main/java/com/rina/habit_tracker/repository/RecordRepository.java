package com.rina.habit_tracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rina.habit_tracker.entity.Record;

public interface RecordRepository extends JpaRepository<Record, Long> {

    List<Record> findByHabitId(Long habitId);
    List<Record> findByHabitIdAndRecordDateBetweenOrderByRecordDateAsc(
            Long habitId, LocalDate startDate, LocalDate endDate);
    Optional<Record> findByIdAndHabitUserId(Long recordId, Long userId);
}
