package com.cricket.management.model;

import java.time.Instant;

public class BallEvent {
    private String id;
    private String matchId;
    private int inningsNumber;
    private int overNumber;
    private int ballInOver;
    private boolean legalBall;
    private String strikerId;
    private String strikerName;
    private String nonStrikerId;
    private String nonStrikerName;
    private String bowlerId;
    private String bowlerName;
    private int runsScored;
    private ExtraType extraType;
    private int extraRuns;
    private int totalRunsOnBall;
    private boolean isWicket;
    private WicketType wicketType;
    private String dismissedPlayerId;
    private String dismissedPlayerName;
    private String commentary;
    private long timestamp;

    public BallEvent() {
        this.timestamp = Instant.now().toEpochMilli();
        this.extraType = ExtraType.NONE;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMatchId() { return matchId; }
    public void setMatchId(String matchId) { this.matchId = matchId; }

    public int getInningsNumber() { return inningsNumber; }
    public void setInningsNumber(int inningsNumber) { this.inningsNumber = inningsNumber; }

    public int getOverNumber() { return overNumber; }
    public void setOverNumber(int overNumber) { this.overNumber = overNumber; }

    public int getBallInOver() { return ballInOver; }
    public void setBallInOver(int ballInOver) { this.ballInOver = ballInOver; }

    public boolean isLegalBall() { return legalBall; }
    public void setLegalBall(boolean legalBall) { this.legalBall = legalBall; }

    public String getStrikerId() { return strikerId; }
    public void setStrikerId(String strikerId) { this.strikerId = strikerId; }

    public String getStrikerName() { return strikerName; }
    public void setStrikerName(String strikerName) { this.strikerName = strikerName; }

    public String getNonStrikerId() { return nonStrikerId; }
    public void setNonStrikerId(String nonStrikerId) { this.nonStrikerId = nonStrikerId; }

    public String getNonStrikerName() { return nonStrikerName; }
    public void setNonStrikerName(String nonStrikerName) { this.nonStrikerName = nonStrikerName; }

    public String getBowlerId() { return bowlerId; }
    public void setBowlerId(String bowlerId) { this.bowlerId = bowlerId; }

    public String getBowlerName() { return bowlerName; }
    public void setBowlerName(String bowlerName) { this.bowlerName = bowlerName; }

    public int getRunsScored() { return runsScored; }
    public void setRunsScored(int runsScored) { this.runsScored = runsScored; }

    public ExtraType getExtraType() { return extraType; }
    public void setExtraType(ExtraType extraType) { this.extraType = extraType; }

    public int getExtraRuns() { return extraRuns; }
    public void setExtraRuns(int extraRuns) { this.extraRuns = extraRuns; }

    public int getTotalRunsOnBall() { return totalRunsOnBall; }
    public void setTotalRunsOnBall(int totalRunsOnBall) { this.totalRunsOnBall = totalRunsOnBall; }

    public boolean isWicket() { return isWicket; }
    public void setWicket(boolean wicket) { isWicket = wicket; }

    public WicketType getWicketType() { return wicketType; }
    public void setWicketType(WicketType wicketType) { this.wicketType = wicketType; }

    public String getDismissedPlayerId() { return dismissedPlayerId; }
    public void setDismissedPlayerId(String dismissedPlayerId) { this.dismissedPlayerId = dismissedPlayerId; }

    public String getDismissedPlayerName() { return dismissedPlayerName; }
    public void setDismissedPlayerName(String dismissedPlayerName) { this.dismissedPlayerName = dismissedPlayerName; }

    public String getCommentary() { return commentary; }
    public void setCommentary(String commentary) { this.commentary = commentary; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
