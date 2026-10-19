package com.cricket.management.model;

public class CareerStats {
    private int matches;
    private int runs;
    private int highestScore;
    private double strikeRate;
    private double average;
    private int wickets;
    private String bestBowling;
    private double economy;
    private int fifties;
    private int hundreds;

    public CareerStats() {}

    public CareerStats(int matches, int runs, int highestScore, double strikeRate, double average,
                       int wickets, String bestBowling, double economy, int fifties, int hundreds) {
        this.matches = matches;
        this.runs = runs;
        this.highestScore = highestScore;
        this.strikeRate = strikeRate;
        this.average = average;
        this.wickets = wickets;
        this.bestBowling = bestBowling;
        this.economy = economy;
        this.fifties = fifties;
        this.hundreds = hundreds;
    }

    // Getters and Setters
    public int getMatches() { return matches; }
    public void setMatches(int matches) { this.matches = matches; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public int getHighestScore() { return highestScore; }
    public void setHighestScore(int highestScore) { this.highestScore = highestScore; }

    public double getStrikeRate() { return strikeRate; }
    public void setStrikeRate(double strikeRate) { this.strikeRate = strikeRate; }

    public double getAverage() { return average; }
    public void setAverage(double average) { this.average = average; }

    public int getWickets() { return wickets; }
    public void setWickets(int wickets) { this.wickets = wickets; }

    public String getBestBowling() { return bestBowling; }
    public void setBestBowling(String bestBowling) { this.bestBowling = bestBowling; }

    public double getEconomy() { return economy; }
    public void setEconomy(double economy) { this.economy = economy; }

    public int getFifties() { return fifties; }
    public void setFifties(int fifties) { this.fifties = fifties; }

    public int getHundreds() { return hundreds; }
    public void setHundreds(int hundreds) { this.hundreds = hundreds; }
}
