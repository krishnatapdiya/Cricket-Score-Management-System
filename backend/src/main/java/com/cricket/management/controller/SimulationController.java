package com.cricket.management.controller;

import com.cricket.management.dto.SimulationSpeedDto;
import com.cricket.management.model.Match;
import com.cricket.management.service.MatchService;
import com.cricket.management.service.MatchSimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/matches/{id}/simulation")
public class SimulationController {

    private final MatchSimulationService simulationService;
    private final MatchService matchService;

    public SimulationController(MatchSimulationService simulationService, MatchService matchService) {
        this.simulationService = simulationService;
        this.matchService = matchService;
    }

    @PostMapping("/toggle")
    public ResponseEntity<Match> toggleSimulation(@PathVariable String id) {
        simulationService.toggleSimulation(id);
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @PostMapping("/start")
    public ResponseEntity<Match> startSimulation(@PathVariable String id) {
        simulationService.startSimulation(id);
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @PostMapping("/pause")
    public ResponseEntity<Match> pauseSimulation(@PathVariable String id) {
        simulationService.pauseSimulation(id);
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @PostMapping("/step")
    public ResponseEntity<Match> stepBall(@PathVariable String id) {
        simulationService.stepSingleBall(id);
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @PostMapping("/speed")
    public ResponseEntity<Map<String, Object>> setSpeed(@PathVariable String id, @RequestBody SimulationSpeedDto dto) {
        simulationService.setSimulationSpeed(id, dto.getSpeedMs());
        return ResponseEntity.ok(Map.of("matchId", id, "speedMs", dto.getSpeedMs()));
    }
}
