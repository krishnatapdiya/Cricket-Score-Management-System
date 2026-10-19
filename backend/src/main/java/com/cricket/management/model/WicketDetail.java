package com.cricket.management.model;

public class WicketDetail {
    private int wicketNumber;
    private int runsAtWicket;
    private String oversFormatted;
    private String batsmanName;
    private String dismissalDescription;

    public WicketDetail() {}

    public WicketDetail(int wicketNumber, int runsAtWicket, String oversFormatted, String batsmanName, String dismissalDescription) {
        this.wicketNumber = wicketNumber;
        this.runsAtWicket = runsAtWicket;
        this.oversFormatted = oversFormatted;
        this.batsmanName = batsmanName;
        this.dismissalDescription = dismissalDescription;
    }

    public int getWicketNumber() { return wicketNumber; }
    public void setWicketNumber(int wicketNumber) { this.wicketNumber = wicketNumber; }

    public int getRunsAtWicket() { return runsAtWicket; }
    public void setRunsAtWicket(int runsAtWicket) { this.runsAtWicket = runsAtWicket; }

    public String getOversFormatted() { return oversFormatted; }
    public void setOversFormatted(String oversFormatted) { this.oversFormatted = oversFormatted; }

    public String getBatsmanName() { return batsmanName; }
    public void setBatsmanName(String batsmanName) { this.batsmanName = batsmanName; }

    public String getDismissalDescription() { return dismissalDescription; }
    public void setDismissalDescription(String dismissalDescription) { this.dismissalDescription = dismissalDescription; }
}
