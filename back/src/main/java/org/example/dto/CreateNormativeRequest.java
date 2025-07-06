package org.example.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateNormativeRequest {
    private String name;
    private String category;
    private String gender;
    private String description;
    private int ageFrom;
    private int ageTo;
    private BigDecimal gold;
    private BigDecimal silver;
    private BigDecimal bronze;
    private String unit; // например: "секунды", "повторы"
}