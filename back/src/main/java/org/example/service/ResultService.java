package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.*;
import org.example.entity.Event;
import org.example.entity.Normative;
import org.example.entity.Result;
import org.example.entity.User;
import org.example.repository.ResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final UserService userService;
    private final NormativeService normativeService;
    private final EventService eventService;

    @Transactional
    public Result createOrUpdateResult(ResultRequest request) {
        User user = userService.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Event event = eventService.findById(request.getEventId());

        NormativeDto normative = normativeService.getNormativeById(request.getNormativeId());

        // Проверяем существование результата
        Result result = resultRepository
                .findByUserIdAndEventIdAndNormativeId(request.getUserId(), request.getEventId(), request.getNormativeId())
                .orElse(new Result());

        // Устанавливаем значения
        result.setUser(user);
        result.setEvent(event);
        result.setNormative(NormativeMapper.toEntity(normative));
        result.setValue(request.getValue());

        // Автоматически рассчитывается achievedLevel и passed благодаря @PrePersist/@PreUpdate
        return resultRepository.save(result);
    }

    public List<ResultDto> getResultsByNormativeId(Long normativeId) {
        return resultRepository.findByNormativeId(normativeId).stream()
                .map(ResultMapper::toDto)
                .toList();
    }

    @Transactional
    public List<Result> createMultipleResults(List<ResultRequest> requests) {
        return requests.stream()
                .map(this::createOrUpdateResult)
                .toList();
    }

    public List<ResultDto> getResultsByEventId(Long eventId) {
        return resultRepository.findByEventId(eventId).stream()
                .map(ResultMapper::toDto)
                .toList();
    }

    public List<Result> getResultsByUserAndEvent(Long userId, Long eventId) {
        return resultRepository.findByUserIdAndEventId(userId, eventId);
    }

    public List<Integer> getDistinctYearsByUserId(Long userId) {
        return resultRepository.findDistinctYearsByUserId(userId);
    }
}