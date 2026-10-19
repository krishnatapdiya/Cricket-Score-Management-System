package com.cricket.management.model;

import java.util.ArrayList;
import java.util.List;

public class Team {
    private String id;
    private String name;
    private String shortName;
    private String flagCode;
    private String primaryColor;
    private String secondaryColor;
    private List<Player> players = new ArrayList<>();

    public Team() {}

    public Team(String id, String name, String shortName, String flagCode, String primaryColor, String secondaryColor) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.flagCode = flagCode;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.players = new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public String getFlagCode() { return flagCode; }
    public void setFlagCode(String flagCode) { this.flagCode = flagCode; }

    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

    public String getSecondaryColor() { return secondaryColor; }
    public void setSecondaryColor(String secondaryColor) { this.secondaryColor = secondaryColor; }

    public List<Player> getPlayers() { return players; }
    public void setPlayers(List<Player> players) { this.players = players; }
}
