package com.cricket.management.model;

public class BowlerStats {
    private String playerId;
    private String playerName;
    private int legalBallsBowled;
    private String overs;
    private int maidens;
    private int runsConceded;
    private int wickets;
    private double economyRate;
    private int wides;
    private int noBalls;
    private boolean isCurrentBowler;

    public BowlerStats() {
        this.overs = "0.0";
    }

    public BowlerStats(String playerId, String playerName) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.legalBallsBowled = 0;
        this.overs = "0.0";
        this.maidens = 0;
        this.runsConceded = 0;
        this.wickets = 0;
        this.economyRate = 0.0;
        this.wides = 0;
        this.noBalls = 0;
        this.isCurrentBowler = false;
    }

    public void updateOversAndEconomy() {
        int fullOvers = legalBallsBowled / 6;
        int remainingBalls = legalBallsBowled % 6;
        this.overs = fullOvers + "." + remainingBalls;

        if (legalBallsBowled > 0) {
            double totalOversDec = legalBallsBowled / 6.0;
            this.economyRate = Math.round((runsConceded / totalOversDec) * 100.0) / 100.0;
        } else {
            this.economyRate = 0.0;
        }
    }

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public int getLegalBallsBowled() { return legalBallsBowled; }
    public void setLegalBallsBowled(int legalBallsBowled) {
        this.legalBallsBowled = legalBallsBowled;
        updateOversAndEconomy();
    }

    public String getOvers() { return overs; }
    public void setOvers(String overs) { this.overs = overs; }

    public int getMaidens() { return maidens; }
    public void setMaidens(int maidens) { this.maidens = maidens; }

    public int getRunsConceded() { return runsConceded; }
    public void setRunsConceded(int runsConceded) {
        this.runsConceded = runsConceded;
        updateOversAndEconomy();
    }

    public int getWickets() { return wickets; }
    public void setWickets(int wickets) { this.wickets = wickets; }

    public double getEconomyRate() { return economyRate; }
    public void setEconomyRate(double economyRate) { this.economyRate = economyRate; }

    public int getWides() { return wides; }
    public void setWides(int wides) { this.wides = wides; }

    public int getNoBalls() { return noBalls; }
    public void setNoBalls(int noBalls) { this.noBalls = noBalls; }

    public boolean isCurrentBowler() { return isCurrentBowler; }
    public void setCurrentBowler(boolean currentBowler) { isCurrentBowler = currentBowler; }
}
