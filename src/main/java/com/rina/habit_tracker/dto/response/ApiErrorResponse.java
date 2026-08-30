package com.rina.habit_tracker.dto.response;

import com.rina.habit_tracker.exception.ApiErrorCode;

public record ApiErrorResponse(ApiErrorCode code, String message) {
}
