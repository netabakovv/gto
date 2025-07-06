package org.example.entity;

public enum EventStatus {
    UPCOMING("Предстоящее"),
    IN_PROGRESS("В процессе"),
    COMPLETED("Завершено"),
    CANCELLED("Отменено");

    private final String displayName;

    EventStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
