package com.cricket.management.model;

import java.util.ArrayList;
import java.util.List;

public class Match {
    private String id;
    private String title;
    private String series;
    private String venue;
    private MatchType matchType;
    private int maxOvers;
    private MatchStatus status;
    private String tossWinnerId;
    private String tossWinnerName;
    private TossDecision tossDecision;
    private Team team1;
    private Team team2;
    private String battingFirstTeamId;
    private String chasingTeamId;
    private int currentInningsIndex;
    private List<InningsScore> innings = new ArrayList<>();
    private Integer target;
    private String winnerTeamId;
    private String winnerTeamName;
    private String winMargin;
    private String playerOfTheMatch;
    private String currentStrikerId;
    private String currentNonStrikerId;
    private String currentBowlerId;
    private boolean isSimulating;
    private int simulationSpeedMs;
    private List<BallEvent> recentBalls = new ArrayList<>();
    private List<BallEvent> commentaryList = new ArrayList<>();
    private long createdAt;
    private long updatedAt;

    public Match() {
        this.status = MatchStatus.UPCOMING;
        this.simulationSpeedMs = 2000;
        this.isSimulating = false;
        this.innings = new ArrayList<>();
        this.recentBalls = new ArrayList<>();
        this.commentaryList = new ArrayList<>();
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    public InningsScore getCurrentInnings() {
        if (innings != null && currentInningsIndex < innings.size()) {
            return innings.get(currentInningsIndex);
        }
        return null;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSeries() { return series; }
    public void setSeries(String series) { this.series = series; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public MatchType getMatchType() { return matchType; }
    public void setMatchType(MatchType matchType) { this.matchType = matchType; }

    public int getMaxOvers() { return maxOvers; }
    public void setMaxOvers(int maxOvers) { this.maxOvers = maxOvers; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public String getTossWinnerId() { return tossWinnerId; }
    public void setTossWinnerId(String tossWinnerId) { this.tossWinnerId = tossWinnerId; }

    public String getTossWinnerName() { return tossWinnerName; }
    public void setTossWinnerName(String tossWinnerName) { this.tossWinnerName = tossWinnerName; }

    public TossDecision getTossDecision() { return tossDecision; }
    public void setTossDecision(TossDecision tossDecision) { this.tossDecision = tossDecision; }

    public Team getTeam1() { return team1; }
    public void setTeam1(Team team1) { this.team1 = team1; }

    public Team getTeam2() { return team2; }
    public void setTeam2(Team team2) { this.team2 = team2; }

    public String getBattingFirstTeamId() { return battingFirstTeamId; }
    public void setBattingFirstTeamId(String battingFirstTeamId) { this.battingFirstTeamId = battingFirstTeamId; }

    public String getChasingTeamId() { return chasingTeamId; }
    public void setChasingTeamId(String chasingTeamId) { this.chasingTeamId = chasingTeamId; }

    public int getCurrentInningsIndex() { return currentInningsIndex; }
    public void setCurrentInningsIndex(int currentInningsIndex) { this.currentInningsIndex = currentInningsIndex; }

    public List<InningsScore> getInnings() { return innings; }
    public void setInnings(List<InningsScore> innings) { this.innings = innings; }

    public Integer getTarget() { return target; }
    public void setTarget(Integer target) { this.target = target; }

    public String getWinnerTeamId() { return winnerTeamId; }
    public void setWinnerTeamId(String winnerTeamId) { this.winnerTeamId = winnerTeamId; }

    public String getWinnerTeamName() { return winnerTeamName; }
    public void setWinnerTeamName(String winnerTeamName) { this.winnerTeamName = winnerTeamName; }

    public String getWinMargin() { return winMargin; }
    public void setWinMargin(String winMargin) { this.winMargin = winMargin; }

    public String getPlayerOfTheMatch() { return playerOfTheMatch; }
    public void setPlayerOfTheMatch(String playerOfTheMatch) { this.playerOfTheMatch = playerOfTheMatch; }

    public String getCurrentStrikerId() { return currentStrikerId; }
    public void setCurrentStrikerId(String currentStrikerId) { this.currentStrikerId = currentStrikerId; }

    public String getCurrentNonStrikerId() { return currentNonStrikerId; }
    public void setCurrentNonStrikerId(String currentNonStrikerId) { this.currentNonStrikerId = currentNonStrikerId; }

    public String getCurrentBowlerId() { return currentBowlerId; }
    public void setCurrentBowlerId(String currentBowlerId) { this.currentBowlerId = currentBowlerId; }

    public boolean isSimulating() { return isSimulating; }
    public void setSimulating(boolean simulating) { isSimulating = simulating; }

    public int getSimulationSpeedMs() { return simulationSpeedMs; }
    public void setSimulationSpeedMs(int simulationSpeedMs) { this.simulationSpeedMs = simulationSpeedMs; }

    public List<BallEvent> getRecentBalls() { return recentBalls; }
    public void setRecentBalls(List<BallEvent> recentBalls) { this.recentBalls = recentBalls; }

    public List<BallEvent> getCommentaryList() { return commentaryList; }
    public void setCommentaryList(List<BallEvent> commentaryList) { this.commentaryList = commentaryList; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    public long getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(long updatedAt) { this.updatedAt = updatedAt; }
}
