package org.example.entity;

public enum RegistrationStatus {
    ACTIVE("Активная"),
    CANCELLED("Отменена"),
    COMPLETED("Завершена");

    private final String displayName;

    RegistrationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}