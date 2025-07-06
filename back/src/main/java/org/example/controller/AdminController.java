package org.example.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.dto.CreateNormativeRequest;
import org.example.dto.NormativeDto;
import org.example.dto.UserProfileDto;
import org.example.entity.Normative;
import org.example.entity.Role;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.example.service.AdminService;
import org.example.service.JwtService;
import org.example.service.NormativeService;
import org.example.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final JwtService jwtService;
    private final UserService userService;
    private final NormativeService normativeService;


    private boolean isAdmin(String token) {
        String email = jwtService.extractEmail(token.replace("Bearer ", ""));
        User user = userService.findByEmail(email).orElseThrow(()->new EntityNotFoundException("Пользователь не найден"));
        return user.getRole().equals(Role.ADMIN);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable("userId") Long userId,
            @RequestBody Map<String, String> request) {
        String role = request.get("role");
        if (role == null || role.isBlank()) {
            return ResponseEntity.badRequest().body("Role cannot be empty");
        }

        userService.updateUserRole(userId, role);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/normative")
    public ResponseEntity<String> createNormative(@RequestBody CreateNormativeRequest request,
                                                  @RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        Normative normative = new Normative();
        normative.builder()
                .name(request.getName())
                .description(request.getDescription())
                .goldStandard(request.getGold())
                .silverStandard(request.getSilver())
                .bronzeStandard(request.getBronze())
                .build();
        return ResponseEntity.ok("Normative created");
    }

    @GetMapping("/normatives")
    public ResponseEntity<List<NormativeDto>> getAllNormatives(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return ResponseEntity.ok(normativeService.getAll());
    }

//    @PostMapping("/event")
//    public ResponseEntity<String> createEvent(@RequestBody EventRequest request,
//                                              @RequestHeader("Authorization") String token) {
//        if (!isAdmin(token)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        adminService.createEvent(request);
//        return ResponseEntity.ok("Event created");
//    }
}
