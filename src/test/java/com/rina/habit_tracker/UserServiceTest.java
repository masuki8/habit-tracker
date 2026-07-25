package com.rina.habit_tracker;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.rina.habit_tracker.dto.request.CreateUserRequest;
import com.rina.habit_tracker.dto.response.UserResponse;
import com.rina.habit_tracker.service.UserService;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void shouldPersistNameWhenCreatingUser() {
        CreateUserRequest request = new CreateUserRequest(
            "Test User",
            "service@example.com",
            "password123"
        );

        UserResponse createdUser = userService.createUser(request);

        assertThat(createdUser.id()).isNotNull();
        assertThat(createdUser.name()).isEqualTo("Test User");
    }
}
