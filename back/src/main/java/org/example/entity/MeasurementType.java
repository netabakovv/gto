package org.example.entity;

public enum MeasurementType {
    LESS_IS_BETTER("Меньше лучше"), // время
    MORE_IS_BETTER("Больше лучше"); // расстояние, количество

    private final String displayName;

    MeasurementType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
