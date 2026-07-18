package com.rina.habit_tracker.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRecordRequest {

    @NotNull
    private Long habitId;

    private String content;
    private String imageUrl;
}
