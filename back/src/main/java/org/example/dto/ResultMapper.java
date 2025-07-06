package org.example.dto;

import org.example.entity.*;

public class ResultMapper {
    public static ResultDto toDto(Result result) {
        return ResultDto.builder()
                .eventId(result.getEvent().getId())        // Используем ID события
                .normativeId(result.getNormative().getId()) // Используем ID норматива
                .value(result.getValue())
                .achievedLevel(result.getAchievedLevel())
                .passed(result.getPassed())
                .date(result.getCreatedAt())
                .build();
    }
}