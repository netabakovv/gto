package org.example.service;


import lombok.RequiredArgsConstructor;
import org.example.dto.NormativeDto;
import org.example.dto.NormativeMapper;
import org.example.entity.Normative;
import org.example.repository.NormativeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NormativeService {
    private final NormativeRepository normativeRepository;

    public List<NormativeDto> getAll() {
        return normativeRepository.findAll().stream()
                .map(NormativeMapper::toDto)
                .toList();
    }

    public NormativeDto getNormativeById(Long id) {
        Normative normative = normativeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Normative not found"));
        return NormativeMapper.toDto(normative);
    }

    public NormativeDto createNormative(NormativeDto dto) {
        Normative normative = NormativeMapper.toEntity(dto);
        return NormativeMapper.toDto(normativeRepository.save(normative));
    }

    public NormativeDto updateNormative(Long id, NormativeDto dto) {
        Normative existing = normativeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Normative not found"));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setType(dto.getType());
        existing.setAgeGroup(dto.getAgeGroup());
        existing.setGender(dto.getGender());
        existing.setUnit(dto.getUnit());
        existing.setBronzeStandard(dto.getBronzeStandard());
        existing.setSilverStandard(dto.getSilverStandard());
        existing.setGoldStandard(dto.getGoldStandard());
        existing.setMeasurementType(dto.getMeasurementType());

        return NormativeMapper.toDto(normativeRepository.save(existing));
    }

    public void deleteNormative(Long id) {
        if (!normativeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Normative not found");
        }
        normativeRepository.deleteById(id);
    }
}
