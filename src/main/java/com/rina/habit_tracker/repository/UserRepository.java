package com.rina.habit_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import com.rina.habit_tracker.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
