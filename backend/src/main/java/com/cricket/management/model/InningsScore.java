package com.cricket.management.model;

import java.util.ArrayList;
import java.util.List;

public class InningsScore {
    private int inningsNumber;
    private String battingTeamId;
    private String battingTeamName;
    private String bowlingTeamId;
    private String bowlingTeamName;
    private int runs;
    private int wickets;
    private int legalBalls;
    private String oversFormatted;
    private int wides;
    private int noBalls;
    private int byes;
    private int legByes;
    private int totalExtras;
    private double runRate;
    private int currentPartnershipRuns;
    private int currentPartnershipBalls;
    private boolean isCompleted;
    private List<BatsmanStats> batsmen = new ArrayList<>();
    private List<BowlerStats> bowlers = new ArrayList<>();
    private List<WicketDetail> fallOfWickets = new ArrayList<>();

    public InningsScore() {
        this.oversFormatted = "0.0";
        this.runRate = 0.0;
        this.batsmen = new ArrayList<>();
        this.bowlers = new ArrayList<>();
        this.fallOfWickets = new ArrayList<>();
    }

    public InningsScore(int inningsNumber, String battingTeamId, String battingTeamName,
                        String bowlingTeamId, String bowlingTeamName) {
        this.inningsNumber = inningsNumber;
        this.battingTeamId = battingTeamId;
        this.battingTeamName = battingTeamName;
        this.bowlingTeamId = bowlingTeamId;
        this.bowlingTeamName = bowlingTeamName;
        this.runs = 0;
        this.wickets = 0;
        this.legalBalls = 0;
        this.oversFormatted = "0.0";
        this.runRate = 0.0;
        this.batsmen = new ArrayList<>();
        this.bowlers = new ArrayList<>();
        this.fallOfWickets = new ArrayList<>();
    }

    public void recalculateOversAndRunRate() {
        int fullOvers = legalBalls / 6;
        int remBalls = legalBalls % 6;
        this.oversFormatted = fullOvers + "." + remBalls;

        if (legalBalls > 0) {
            double totalOversDec = legalBalls / 6.0;
            this.runRate = Math.round((runs / totalOversDec) * 100.0) / 100.0;
        } else {
            this.runRate = 0.0;
        }
        this.totalExtras = wides + noBalls + byes + legByes;
    }

    public int getInningsNumber() { return inningsNumber; }
    public void setInningsNumber(int inningsNumber) { this.inningsNumber = inningsNumber; }

    public String getBattingTeamId() { return battingTeamId; }
    public void setBattingTeamId(String battingTeamId) { this.battingTeamId = battingTeamId; }

    public String getBattingTeamName() { return battingTeamName; }
    public void setBattingTeamName(String battingTeamName) { this.battingTeamName = battingTeamName; }

    public String getBowlingTeamId() { return bowlingTeamId; }
    public void setBowlingTeamId(String bowlingTeamId) { this.bowlingTeamId = bowlingTeamId; }

    public String getBowlingTeamName() { return bowlingTeamName; }
    public void setBowlingTeamName(String bowlingTeamName) { this.bowlingTeamName = bowlingTeamName; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; recalculateOversAndRunRate(); }

    public int getWickets() { return wickets; }
    public void setWickets(int wickets) { this.wickets = wickets; }

    public int getLegalBalls() { return legalBalls; }
    public void setLegalBalls(int legalBalls) {
        this.legalBalls = legalBalls;
        recalculateOversAndRunRate();
    }

    public String getOversFormatted() { return oversFormatted; }
    public void setOversFormatted(String oversFormatted) { this.oversFormatted = oversFormatted; }

    public int getWides() { return wides; }
    public void setWides(int wides) { this.wides = wides; recalculateOversAndRunRate(); }

    public int getNoBalls() { return noBalls; }
    public void setNoBalls(int noBalls) { this.noBalls = noBalls; recalculateOversAndRunRate(); }

    public int getByes() { return byes; }
    public void setByes(int byes) { this.byes = byes; recalculateOversAndRunRate(); }

    public int getLegByes() { return legByes; }
    public void setLegByes(int legByes) { this.legByes = legByes; recalculateOversAndRunRate(); }

    public int getTotalExtras() { return totalExtras; }
    public void setTotalExtras(int totalExtras) { this.totalExtras = totalExtras; }

    public double getRunRate() { return runRate; }
    public void setRunRate(double runRate) { this.runRate = runRate; }

    public int getCurrentPartnershipRuns() { return currentPartnershipRuns; }
    public void setCurrentPartnershipRuns(int currentPartnershipRuns) { this.currentPartnershipRuns = currentPartnershipRuns; }

    public int getCurrentPartnershipBalls() { return currentPartnershipBalls; }
    public void setCurrentPartnershipBalls(int currentPartnershipBalls) { this.currentPartnershipBalls = currentPartnershipBalls; }

    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }

    public List<BatsmanStats> getBatsmen() { return batsmen; }
    public void setBatsmen(List<BatsmanStats> batsmen) { this.batsmen = batsmen; }

    public List<BowlerStats> getBowlers() { return bowlers; }
    public void setBowlers(List<BowlerStats> bowlers) { this.bowlers = bowlers; }

    public List<WicketDetail> getFallOfWickets() { return fallOfWickets; }
    public void setFallOfWickets(List<WicketDetail> fallOfWickets) { this.fallOfWickets = fallOfWickets; }
}
