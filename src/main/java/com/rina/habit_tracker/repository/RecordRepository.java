package com.rina.habit_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rina.habit_tracker.entity.Record;

public interface RecordRepository extends JpaRepository<Record, Long> {
}
