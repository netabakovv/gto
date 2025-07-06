package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Event;
import org.example.entity.Registration;
import org.example.entity.RegistrationStatus;
import org.example.entity.User;
import org.example.repository.EventRepository;
import org.example.repository.RegistrationRepository;
import org.example.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;


    public Registration registerToEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Registration reg = new Registration();
        reg.setUser(user);
        reg.setEvent(event);
        reg.setStatus(RegistrationStatus.ACTIVE);
        return registrationRepository.save(reg);
    }

    public List<Registration> getMyRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId);
    }
}


