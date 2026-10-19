package com.cricket.management.dto;

import com.cricket.management.model.ExtraType;
import com.cricket.management.model.WicketType;

public class BallInputDto {
    private int runs;
    private ExtraType extraType = ExtraType.NONE;
    private int extraRuns;
    private boolean isWicket;
    private WicketType wicketType;
    private String dismissedPlayerId;
    private String commentary;

    public BallInputDto() {}

    public int getRuns() { return runs; }
    public void setRuns(int runs) { this.runs = runs; }

    public ExtraType getExtraType() { return extraType; }
    public void setExtraType(ExtraType extraType) { this.extraType = extraType; }

    public int getExtraRuns() { return extraRuns; }
    public void setExtraRuns(int extraRuns) { this.extraRuns = extraRuns; }

    public boolean isWicket() { return isWicket; }
    public void setWicket(boolean wicket) { isWicket = wicket; }

    public WicketType getWicketType() { return wicketType; }
    public void setWicketType(WicketType wicketType) { this.wicketType = wicketType; }

    public String getDismissedPlayerId() { return dismissedPlayerId; }
    public void setDismissedPlayerId(String dismissedPlayerId) { this.dismissedPlayerId = dismissedPlayerId; }

    public String getCommentary() { return commentary; }
    public void setCommentary(String commentary) { this.commentary = commentary; }
}
