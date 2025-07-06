package org.example.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import org.example.trash.RusPhone;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String middleName;

    @Past
    private LocalDate birthDate;

    private String gender; // Изменили boolean на String

   //@Pattern(regexp = "^\\+?[0-9]{10,15}$")
    @RusPhone
    private String phone;
}