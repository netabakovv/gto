package org.example.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ResultInputDto {
    private Long userId;
    private Long normativeId;
    private BigDecimal value;
}
