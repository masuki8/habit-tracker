package com.rina.habit_tracker.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.rina.habit_tracker.entity.Habit;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecordResponse {
    private Long id;
    private Habit habit;
    private String content;
    private String imageUrl;
    private LocalDate recordDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
