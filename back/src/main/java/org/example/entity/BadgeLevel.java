package org.example.entity;

public enum BadgeLevel {
    BRONZE("Бронза", 1),
    SILVER("Серебро", 2),
    GOLD("Золото", 3);

    private final String displayName;
    private final int level;

    BadgeLevel(String displayName, int level) {
        this.displayName = displayName;
        this.level = level;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getLevel() {
        return level;
    }
}
