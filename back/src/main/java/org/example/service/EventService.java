package org.example.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.dto.*;
import org.example.entity.*;
import org.example.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final NormativeRepository normativeRepository;
    private final ResultRepository resultRepository;

    public Event findById(Long eventId) {
        return eventRepository.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Event not found"));
    }

    public Event create(Event event, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Админ не найден"));

        if (admin.getRole() != Role.ADMIN) throw new RuntimeException("Нет прав на создание события");

        return eventRepository.save(event);
    }

    public List<EventDto> getAll() {
        return eventRepository.findAll().stream()
                .map(EventMapper::toDto)
                .toList();
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByStatus(EventStatus.UPCOMING);
    }

    public void registerUserForEvent(Long eventId, String token) {
        if (!jwtService.extractRole(token).equals("USER"))
            throw new RuntimeException("Регистрироваться на события может только пользователь");
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Событие не найдено"));

        if (event.getRegistrationEnd() != null && LocalDateTime.now().isAfter(event.getRegistrationEnd())) {
            throw new RuntimeException("Регистрация закрыта");
        }

        boolean alreadyRegistered = registrationRepository.existsByUserAndEvent(user, event);
        if (alreadyRegistered) {
            throw new RuntimeException("Вы уже зарегистрированы");
        }

        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setUser(user);
        registrationRepository.save(registration);
    }

    public List<EventDto> getEventsForJudge(Long judgeId) {
        List<Event> events = eventRepository.findAllByJudges_Id(judgeId);
        return events.stream()
                .map(EventMapper::toDto)
                .toList();
    }

    public List<UserProfileDto> getUsersByEventId(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));

        List<User> users = eventRepository.findUsersByEventId(eventId);

        return users.stream()
                .map(UserMapper::toDto)
                .toList();
    }

    @Transactional
    public void submitResult(Long judgeId, Long eventId, ResultInputDto dto) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Событие не найдено"));

        // Проверка, что судья назначен на мероприятие
        boolean isJudgeAssigned = event.getJudges().stream()
                .anyMatch(j -> j.getId().equals(judgeId));
        if (!isJudgeAssigned) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Вы не курируете это событие");
        }

        // Проверка, что пользователь зарегистрирован на мероприятие
        boolean isUserRegistered = event.getRegistrations().stream()
                .anyMatch(r -> r.getUser().getId().equals(dto.getUserId()));
        if (!isUserRegistered) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Пользователь не зарегистрирован на этом событии");
        }

        // Получение сущностей
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));
        Normative normative = normativeRepository.findById(dto.getNormativeId())
                .orElseThrow(() -> new EntityNotFoundException("Норматив не найден"));

        // Сохранение результата
        Result result = new Result();
        result.setUser(user);
        result.setEvent(event);
        result.setNormative(normative);
        result.setValue(dto.getValue());
        resultRepository.save(result);
    }
    @Transactional
    public EventDto updateEvent(Long id, EventDto eventDto) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Не найдено событие с номером: " + id));

        // Обновляем поля
        existingEvent.setName(eventDto.getName());
        existingEvent.setDescription(eventDto.getDescription());
        existingEvent.setEventDate(eventDto.getEventDate());
        existingEvent.setLocation(eventDto.getLocation());
        existingEvent.setStatus(eventDto.getStatus());
        existingEvent.setRegistrationEnd(eventDto.getRegistrationEnd());

        Event updatedEvent = eventRepository.save(existingEvent);
        return EventMapper.toDto(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new EntityNotFoundException("Не найдено событие с номером: " + id);
        }
        eventRepository.deleteById(id);
    }
    public List<UserProfileDto> getJudgesByEventId(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return event.getJudges().stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

    public void assignJudgesToEvent(Long eventId, List<Long> judgeIds) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        List<User> judges = userRepository.findAllById(judgeIds);
        event.setJudges(judges);
        eventRepository.save(event);
    }
}

