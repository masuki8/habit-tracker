package com.rina.habit_tracker.controller;

import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rina.habit_tracker.dto.request.CreateUserRequest;
import com.rina.habit_tracker.dto.request.LoginRequest;
import com.rina.habit_tracker.dto.response.LoginResponse;
import com.rina.habit_tracker.security.AuthenticatedUser;
import com.rina.habit_tracker.security.JwtService;
import com.rina.habit_tracker.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(request.email(), request.password()));
        AuthenticatedUser authenticatedUser = (AuthenticatedUser) authentication.getPrincipal();
        userService.recordSuccessfulLogin(authenticatedUser.id());
        String token = jwtService.generateToken(authenticatedUser.id());
        return new LoginResponse(token, "Bearer", jwtService.getExpirationSeconds());
    }
    
    @PostMapping("/login/demo")
    public LoginResponse demoLogin() {
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        CreateUserRequest demoUser = new CreateUserRequest("demo-"+ uuid +"@example.com", "demo-" + uuid, "ゲスト", "password");
        userService.createUser(demoUser);
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(demoUser.email(), demoUser.password()));
        AuthenticatedUser authenticatedUser = (AuthenticatedUser) authentication.getPrincipal();
        userService.recordSuccessfulLogin(authenticatedUser.id());
        String token = jwtService.generateToken(authenticatedUser.id());
        return new LoginResponse(token, "Bearer", jwtService.getExpirationSeconds());
    }
}
