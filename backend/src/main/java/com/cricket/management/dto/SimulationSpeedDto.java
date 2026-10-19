package com.cricket.management.dto;

public class SimulationSpeedDto {
    private int speedMs;

    public SimulationSpeedDto() {}

    public SimulationSpeedDto(int speedMs) {
        this.speedMs = speedMs;
    }

    public int getSpeedMs() { return speedMs; }
    public void setSpeedMs(int speedMs) { this.speedMs = speedMs; }
}
