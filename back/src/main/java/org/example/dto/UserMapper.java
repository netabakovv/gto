package org.example.dto;

import org.example.entity.BadgeLevel;
import org.example.entity.User;
import org.example.repository.NormativeRepository;
import org.example.repository.ResultRepository;
import org.example.trash.RusPhone;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class UserMapper {
    public static UserProfileDto toDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .middleName(user.getMiddleName())
                .birthDate(user.getBirthDate().toString())
                .gender(user.getGender().name())
                .age(user.getAge())
                .ageGroup(user.getAgeGroup().name())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .build();
    }
}

