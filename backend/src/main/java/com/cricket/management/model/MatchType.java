package com.cricket.management.model;

public enum MatchType {
    T20(20),
    ODI(50),
    TEST(90);

    private final int defaultOvers;

    MatchType(int defaultOvers) {
        this.defaultOvers = defaultOvers;
    }

    public int getDefaultOvers() {
        return defaultOvers;
    }
}
