package org.example.entity;

public enum Role {
    USER("Пользователь"),
    JUDGE("Судья"),
    ADMIN("Администратор");

    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}