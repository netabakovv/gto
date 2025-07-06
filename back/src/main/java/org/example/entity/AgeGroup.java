package org.example.entity;

public enum AgeGroup {
    GROUP_6_8("6-8 лет"),
    GROUP_9_10("9-10 лет"),
    GROUP_11_12("11-12 лет"),
    GROUP_13_15("13-15 лет"),
    GROUP_16_18("16-18 лет"),
    GROUP_19_25("19-25 года"),
    GROUP_26_29("26-29 лет"),
    GROUP_30_34("30-34 года"),
    GROUP_35_39("35-39 лет"),
    GROUP_40_44("40-44 года"),
    GROUP_45_49("45-49 лет"),
    GROUP_50_54("50-54 года"),
    GROUP_55_59("55-59 лет"),
    GROUP_60_64("60-64 года"),
    GROUP_65_69("65-69 лет"),
    GROUP_70_PLUS("70+ лет");

    private final String displayName;

    AgeGroup(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
