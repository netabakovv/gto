package org.example.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ResultRequest {
    private Long userId;
    private Long eventId;
    private Long normativeId;
    private BigDecimal value;
}