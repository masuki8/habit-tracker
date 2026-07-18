package com.rina.habit_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rina.habit_tracker.dto.CreateUserRequest;
import com.rina.habit_tracker.dto.UpdateUserRequest;
import com.rina.habit_tracker.entity.User;
import com.rina.habit_tracker.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(CreateUserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User updateUser(Long id, UpdateUserRequest request) {
        User user = getUserById(id);
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
