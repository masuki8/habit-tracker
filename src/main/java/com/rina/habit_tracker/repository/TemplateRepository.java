package com.rina.habit_tracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rina.habit_tracker.entity.Template;

public interface TemplateRepository extends JpaRepository<Template, Long> {

    Optional<Template> findByHabitIdAndHabitUserId(Long habitId, Long userId);

    boolean existsByHabitId(Long habitId);
}
