package com.cricket.management.dto;

import com.cricket.management.model.TossDecision;

public class TossRequest {
    private String tossWinnerId;
    private TossDecision tossDecision;

    public TossRequest() {}

    public String getTossWinnerId() { return tossWinnerId; }
    public void setTossWinnerId(String tossWinnerId) { this.tossWinnerId = tossWinnerId; }

    public TossDecision getTossDecision() { return tossDecision; }
    public void setTossDecision(TossDecision tossDecision) { this.tossDecision = tossDecision; }
}
