package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.*;
import org.example.entity.*;
import org.example.repository.CertificateRepository;
import org.example.repository.EventRepository;
import org.example.repository.ResultRepository;
import org.example.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ResultRepository resultRepository;
    private final EventRepository eventRepository;
    private final CertificateRepository certificateRepository;

    public UserProfileDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ResultDto> results = resultRepository.findByUserId(userId).stream()
                .map(r -> new ResultDto(
                        r.getEvent().getId(),
                        r.getNormative().getId(),
                        r.getValue(),
                        r.getAchievedLevel(),
                        r.getPassed(),
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());

        Certificate certificate = certificateRepository.findLatestByUserId(userId);
        CertificateDto certificateDto = certificate != null ? new CertificateDto(
                certificate.getCertificateNumber(),
                certificate.getBadgeLevel(),
                certificate.getAgeGroup(),
                certificate.getYear(),
                certificate.getIssuedAt()
        ) : null;

        BadgeLevel maxBadge = results.stream()
                .filter(ResultDto::isPassed)
                .map(ResultDto::getAchievedLevel)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null);

        List<EventShortDto> events = eventRepository.findAll().stream()
                .filter(Event::isRegistrationOpen)
                .map(e -> new EventShortDto(
                        e.getId(),
                        e.getName(),
                        e.getEventDate(),
                        e.getLocation()
                ))
                .collect(Collectors.toList());

        // Добавляем недостающие поля
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
                .results(results)
                .currentBadge(maxBadge)
                .certificate(certificate)
                .availableEvents(events)
                .build();
    }

    public List<Result> getResultHistory(Long userId) {
        return resultRepository.findByUserId(userId);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Certificate getCertificate(Long userId) {
        return (Certificate) certificateRepository.findLatestByUserId(userId);
    }
//  !!!!!!!!!!!     ПЕРЕРАБОТАТЬ !!!!!!!!!!!!!!!!!
    public BadgeLevel calculateBadge(Long userId) {
        List<Result> results = resultRepository.findByUserId(userId);
        long passed = results.stream().filter(Result::getPassed).count();

        if (passed >= 6) return BadgeLevel.GOLD;
        if (passed >= 4) return BadgeLevel.SILVER;
        if (passed >= 2) return BadgeLevel.BRONZE;
        return null;
    }

    public List<User> findJudges() {
        List<User> judges = userRepository.findJudges();
        return judges;
    }

    public void updateProfile(String email, UserProfileDto profileDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(profileDto.getFirstName());
        user.setLastName(profileDto.getLastName());
        user.setMiddleName(profileDto.getMiddleName());
        user.setBirthDate(LocalDate.parse(profileDto.getBirthDate()));
        user.setGender(Gender.valueOf(profileDto.getGender()));
        user.setPhone(profileDto.getPhone());

        userRepository.save(user);
    }

    public List<UserProfileDto> findAll() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDto)
                .toList();
    }

    @Transactional
    public void updateUserRole(Long userId, String roleStr) {
        try {
            Role role = Role.valueOf(roleStr.toUpperCase());
            userRepository.updateUserRole(userId, role);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleStr);
        }
    }
}

