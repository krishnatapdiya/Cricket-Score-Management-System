package com.cricket.management.controller;

import com.cricket.management.dto.BallInputDto;
import com.cricket.management.dto.CreateMatchRequest;
import com.cricket.management.dto.TossRequest;
import com.cricket.management.model.BallEvent;
import com.cricket.management.model.InningsScore;
import com.cricket.management.model.Match;
import com.cricket.management.model.MatchStatus;
import com.cricket.management.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public ResponseEntity<List<Match>> getAllMatches(@RequestParam(required = false) MatchStatus status) {
        return ResponseEntity.ok(matchService.getAllMatches(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable String id) {
        Match match = matchService.getMatchById(id);
        if (match == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(match);
    }

    @PostMapping
    public ResponseEntity<Match> createMatch(@RequestBody CreateMatchRequest request) {
        return ResponseEntity.ok(matchService.createMatch(request));
    }

    @PostMapping("/{id}/toss")
    public ResponseEntity<Match> conductToss(@PathVariable String id, @RequestBody TossRequest request) {
        return ResponseEntity.ok(matchService.conductToss(id, request));
    }

    @PostMapping("/{id}/ball")
    public ResponseEntity<BallEvent> recordBall(@PathVariable String id, @RequestBody BallInputDto request) {
        return ResponseEntity.ok(matchService.recordBall(id, request));
    }

    @PostMapping("/{id}/reset")
    public ResponseEntity<Match> resetMatch(@PathVariable String id) {
        return ResponseEntity.ok(matchService.resetMatch(id));
    }

    @GetMapping("/{id}/commentary")
    public ResponseEntity<List<BallEvent>> getCommentary(@PathVariable String id) {
        Match match = matchService.getMatchById(id);
        if (match == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(match.getCommentaryList());
    }

    @GetMapping("/{id}/scorecard")
    public ResponseEntity<List<InningsScore>> getScorecard(@PathVariable String id) {
        Match match = matchService.getMatchById(id);
        if (match == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(match.getInnings());
    }
}
