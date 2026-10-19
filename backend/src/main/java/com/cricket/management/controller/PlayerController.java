package com.cricket.management.controller;

import com.cricket.management.model.LeaderboardStats;
import com.cricket.management.model.Player;
import com.cricket.management.model.Team;
import com.cricket.management.service.CricketDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlayerController {

    private final CricketDataService dataService;

    public PlayerController(CricketDataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping("/players")
    public ResponseEntity<List<Player>> getAllPlayers() {
        return ResponseEntity.ok(dataService.getAllPlayers());
    }

    @GetMapping("/players/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable String id) {
        Player player = dataService.getPlayerById(id);
        if (player == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(player);
    }

    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(dataService.getAllTeams());
    }

    @GetMapping("/teams/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable String id) {
        Team team = dataService.getTeamById(id);
        if (team == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(team);
    }

    @GetMapping("/stats/leaderboard")
    public ResponseEntity<LeaderboardStats> getLeaderboard() {
        return ResponseEntity.ok(dataService.getLeaderboard());
    }
}
