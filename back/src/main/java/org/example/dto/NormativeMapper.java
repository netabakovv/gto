package org.example.dto;

import org.example.entity.Normative;

public class NormativeMapper {
    public static NormativeDto toDto(Normative normative) {
        return NormativeDto.builder()
                .id(normative.getId())
                .name(normative.getName())
                .description(normative.getDescription())
                .type(normative.getType())
                .ageGroup(normative.getAgeGroup())
                .gender(normative.getGender())
                .unit(normative.getUnit())
                .bronzeStandard(normative.getBronzeStandard())
                .silverStandard(normative.getSilverStandard())
                .goldStandard(normative.getGoldStandard())
                .measurementType(normative.getMeasurementType())
                .build();
    }

    public static Normative toEntity(NormativeDto dto) {
        return Normative.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .type(dto.getType())
                .ageGroup(dto.getAgeGroup())
                .gender(dto.getGender())
                .unit(dto.getUnit())
                .bronzeStandard(dto.getBronzeStandard())
                .silverStandard(dto.getSilverStandard())
                .goldStandard(dto.getGoldStandard())
                .measurementType(dto.getMeasurementType())
                .build();
    }
}
