package com.cricket.management.model;

import java.util.ArrayList;
import java.util.List;

public class LeaderboardStats {
    private List<Player> topRunScorers = new ArrayList<>();
    private List<Player> topWicketTakers = new ArrayList<>();
    private List<Player> highestStrikeRates = new ArrayList<>();
    private List<Player> bestEconomyRates = new ArrayList<>();

    public LeaderboardStats() {}

    public List<Player> getTopRunScorers() { return topRunScorers; }
    public void setTopRunScorers(List<Player> topRunScorers) { this.topRunScorers = topRunScorers; }

    public List<Player> getTopWicketTakers() { return topWicketTakers; }
    public void setTopWicketTakers(List<Player> topWicketTakers) { this.topWicketTakers = topWicketTakers; }

    public List<Player> getHighestStrikeRates() { return highestStrikeRates; }
    public void setHighestStrikeRates(List<Player> highestStrikeRates) { this.highestStrikeRates = highestStrikeRates; }

    public List<Player> getBestEconomyRates() { return bestEconomyRates; }
    public void setBestEconomyRates(List<Player> bestEconomyRates) { this.bestEconomyRates = bestEconomyRates; }
}
