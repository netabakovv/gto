package org.example.repository;

import org.example.entity.AgeGroup;
import org.example.entity.Gender;
import org.example.entity.Normative;
import org.example.entity.NormativeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NormativeRepository extends JpaRepository<Normative, Long> {
    // Поиск по возрастной группе и полу
    List<Normative> findByAgeGroupAndGender(AgeGroup ageGroup, Gender gender);
}
