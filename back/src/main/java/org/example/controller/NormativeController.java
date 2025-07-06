package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.NormativeDto;
import org.example.dto.NormativeMapper;
import org.example.entity.Normative;
import org.example.service.AdminService;
import org.example.service.JwtService;
import org.example.service.NormativeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/normatives")
@RequiredArgsConstructor
public class NormativeController {
    private final AdminService adminService;
    private final NormativeService normativeService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<NormativeDto>> getAll() {
        return ResponseEntity.ok(normativeService.getAll());
    }

    @GetMapping("/{id}")
    public NormativeDto getById(@PathVariable("id") Long id) {
        return normativeService.getNormativeById(id);
    }

    @PostMapping
    public ResponseEntity<NormativeDto> create(@RequestHeader("Authorization") String auth,
                                            @RequestBody Normative normative) {
        String token = auth.replace("Bearer ", "");
        if (!jwtService.extractRole(token).equals("ADMIN")) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(normativeService.createNormative(NormativeMapper.toDto(normative)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NormativeDto> update(@RequestHeader("Authorization") String auth,
                                            @PathVariable("id") Long id,
                                            @RequestBody NormativeDto dto) {
        String token = auth.replace("Bearer ", "");
        if (!jwtService.extractRole(token).equals("ADMIN")) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(normativeService.updateNormative(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("Authorization") String auth,
                                       @PathVariable("id") Long id) {
        String token = auth.replace("Bearer ", "");
        if (!jwtService.extractRole(token).equals("ADMIN")) return ResponseEntity.status(403).build();
        normativeService.deleteNormative(id);
        return ResponseEntity.ok().build();
    }
}

