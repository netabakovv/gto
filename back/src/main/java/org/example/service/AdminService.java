package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Event;
import org.example.entity.Normative;
import org.example.entity.User;
import org.example.repository.EventRepository;
import org.example.repository.NormativeRepository;
import org.example.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NormativeRepository normativeRepository;

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public void assignJudgeToEvent(Long judgeId, Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User judge = userRepository.findById(judgeId)
                .orElseThrow(() -> new RuntimeException("Judge not found"));

        event.getJudges().add(judge);
        eventRepository.save(event);
    }

    public Normative createNormative(Normative normative) {
        return normativeRepository.save(normative);
    }

    public List<Normative> getAllNormative() {
        return normativeRepository.findAll();
    }

    public void deleteNormative(Long id) {
        normativeRepository.deleteById(id);
    }
}