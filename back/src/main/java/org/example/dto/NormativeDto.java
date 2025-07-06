package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.AgeGroup;
import org.example.entity.Gender;
import org.example.entity.MeasurementType;
import org.example.entity.NormativeType;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NormativeDto {
    private Long id;
    private String name;
    private String description;
    private NormativeType type;
    private AgeGroup ageGroup;
    private Gender gender;
    private String unit;
    private BigDecimal bronzeStandard;
    private BigDecimal silverStandard;
    private BigDecimal goldStandard;
    private MeasurementType measurementType;
}
