package com.rina.habit_tracker.exception;

public class ConflictException extends RuntimeException {

    private final ApiErrorCode code;

    public ConflictException(ApiErrorCode code, String message) {
        super(message);
        this.code = code;
    }

    public ApiErrorCode getCode() {
        return code;
    }
}
