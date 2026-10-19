package com.cricket.management.model;

public class BatsmanStats {
    private String playerId;
    private String playerName;
    private int runs;
    private int balls;
    private int fours;
    private int sixes;
    private double strikeRate;
    private boolean isOut;
    private String dismissalInfo;
    private int battingOrder;
    private boolean isOnStrike;

    public BatsmanStats() {
        this.dismissalInfo = "not out";
    }

    public BatsmanStats(String playerId, String playerName, int battingOrder) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.battingOrder = battingOrder;
        this.runs = 0;
        this.balls = 0;
        this.fours = 0;
        this.sixes = 0;
        this.strikeRate = 0.0;
        this.isOut = false;
        this.dismissalInfo = "not out";
        this.isOnStrike = false;
    }

    public void recalculateStrikeRate() {
        if (balls > 0) {
            this.strikeRate = Math.round((runs * 100.0 / balls) * 100.0) / 100.0;
        } else {
            this.strikeRate = 0.0;
        }
    }

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; recalculateStrikeRate(); }

    public int getBalls() { return balls; }
    public void setBalls(int balls) { this.balls = balls; recalculateStrikeRate(); }

    public int getFours() { return fours; }
    public void setFours(int fours) { this.fours = fours; }

    public int getSixes() { return sixes; }
    public void setSixes(int sixes) { this.sixes = sixes; }

    public double getStrikeRate() { return strikeRate; }
    public void setStrikeRate(double strikeRate) { this.strikeRate = strikeRate; }

    public boolean isOut() { return isOut; }
    public void setOut(boolean out) { isOut = out; }

    public String getDismissalInfo() { return dismissalInfo; }
    public void setDismissalInfo(String dismissalInfo) { this.dismissalInfo = dismissalInfo; }

    public int getBattingOrder() { return battingOrder; }
    public void setBattingOrder(int battingOrder) { this.battingOrder = battingOrder; }

    public boolean isOnStrike() { return isOnStrike; }
    public void setOnStrike(boolean onStrike) { isOnStrike = onStrike; }
}
