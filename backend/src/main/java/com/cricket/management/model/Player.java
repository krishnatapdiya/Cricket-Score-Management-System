package com.cricket.management.model;

public class Player {
    private String id;
    private String name;
    private String teamId;
    private String teamName;
    private PlayerRole role;
    private String battingStyle;
    private String bowlingStyle;
    private String avatarUrl;
    private CareerStats careerStats;

    public Player() {}

    public Player(String id, String name, String teamId, String teamName, PlayerRole role,
                  String battingStyle, String bowlingStyle, String avatarUrl, CareerStats careerStats) {
        this.id = id;
        this.name = name;
        this.teamId = teamId;
        this.teamName = teamName;
        this.role = role;
        this.battingStyle = battingStyle;
        this.bowlingStyle = bowlingStyle;
        this.avatarUrl = avatarUrl;
        this.careerStats = careerStats;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTeamId() { return teamId; }
    public void setTeamId(String teamId) { this.teamId = teamId; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public PlayerRole getRole() { return role; }
    public void setRole(PlayerRole role) { this.role = role; }

    public String getBattingStyle() { return battingStyle; }
    public void setBattingStyle(String battingStyle) { this.battingStyle = battingStyle; }

    public String getBowlingStyle() { return bowlingStyle; }
    public void setBowlingStyle(String bowlingStyle) { this.bowlingStyle = bowlingStyle; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public CareerStats getCareerStats() { return careerStats; }
    public void setCareerStats(CareerStats careerStats) { this.careerStats = careerStats; }
}
