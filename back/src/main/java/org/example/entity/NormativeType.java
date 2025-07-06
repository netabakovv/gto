package org.example.entity;

public enum NormativeType {
    RUNNING("Бег"),
    SWIMMING("Плавание"),
    PUSH_UPS("Отжимания"),
    PULL_UPS("Подтягивания"),
    SHOOTING("Стрельба"),
    JUMP("Прыжки"),
    SKIING("Лыжи"),
    FLEXIBILITY("Гибкость"),
    TOURISM("Туризм");

    private final String displayName;

    NormativeType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
