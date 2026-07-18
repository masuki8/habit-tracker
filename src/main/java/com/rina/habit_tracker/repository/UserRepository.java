package com.rina.habit_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rina.habit_tracker.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
