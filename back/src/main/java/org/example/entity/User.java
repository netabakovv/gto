package org.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, name = "first_name")
    @NotBlank
    private String firstName;

    @Column(nullable = false, name = "last_name")
    @NotBlank
    private String lastName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(nullable = false, name = "birth_date")
    @Past
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Связи
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Registration> registrations;

    @OneToMany(mappedBy = "judge", fetch = FetchType.LAZY)
    private List<EventJudge> judgedEvents;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Certificate> certificates;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Result> results;

    // Вычисляемые поля
    @Transient
    public String getFullName() {
        return lastName + " " + firstName +
                (middleName != null ? " " + middleName : "");
    }

    @Transient
    public int getAge() {
        return LocalDate.now().getYear() - birthDate.getYear();
    }

    @Transient
    public AgeGroup getAgeGroup() {
        int age = getAge();
        if (age >= 6 && age <= 8) return AgeGroup.GROUP_6_8;
        if (age >= 9 && age <= 10) return AgeGroup.GROUP_9_10;
        if (age >= 11 && age <= 12) return AgeGroup.GROUP_11_12;
        if (age >= 13 && age <= 15) return AgeGroup.GROUP_13_15;
        if (age >= 16 && age <= 17) return AgeGroup.GROUP_16_18;
        if (age >= 18 && age <= 24) return AgeGroup.GROUP_19_25;
        if (age >= 25 && age <= 29) return AgeGroup.GROUP_26_29;
        if (age >= 30 && age <= 34) return AgeGroup.GROUP_30_34;
        if (age >= 35 && age <= 39) return AgeGroup.GROUP_35_39;
        if (age >= 40 && age <= 44) return AgeGroup.GROUP_40_44;
        if (age >= 45 && age <= 49) return AgeGroup.GROUP_45_49;
        if (age >= 50 && age <= 54) return AgeGroup.GROUP_50_54;
        if (age >= 55 && age <= 59) return AgeGroup.GROUP_55_59;
        if (age >= 60 && age <= 64) return AgeGroup.GROUP_60_64;
        if (age >= 65 && age <= 69) return AgeGroup.GROUP_65_69;
        return AgeGroup.GROUP_70_PLUS;
    }
}