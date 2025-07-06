package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.AgeGroup;
import org.example.entity.BadgeLevel;
import org.example.entity.Certificate;
import org.example.trash.RusPhone;
import org.springframework.context.annotation.Bean;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDto {
    private Long id;
    private String role;
    private String firstName;
    private String lastName;
    private String middleName;
    private String birthDate;
    private String gender;
    private int age;
    private String ageGroup;
    private String email;
    @RusPhone
    private String phone;
    private List<ResultDto> results;
    private BadgeLevel currentBadge;
    private Certificate certificate;
    private List<EventShortDto> availableEvents;
}