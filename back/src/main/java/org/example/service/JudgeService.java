package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Registration;
import org.example.entity.Result;
import org.example.repository.RegistrationRepository;
import org.example.repository.ResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JudgeService {

    private final ResultRepository resultRepository;
    private final RegistrationRepository registrationRepository;

    public List<Result> getResultsByJudgeAndEvent(Long judgeId, Long eventId) {
        // Допиши фильтрацию по назначенному судье, если реализована в БД
        return resultRepository.findByEventId(eventId);
    }
}

