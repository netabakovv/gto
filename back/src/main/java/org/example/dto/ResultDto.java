package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.BadgeLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultDto {
    private Long eventId;       // Изменили eventName на eventId
    private Long normativeId;  // Изменили normativeName на normativeId
    private BigDecimal value;
    private BadgeLevel achievedLevel;
    private boolean passed;
    private LocalDateTime date;
}
