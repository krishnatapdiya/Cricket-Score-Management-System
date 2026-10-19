package com.cricket.management.service;

import com.cricket.management.dto.BallInputDto;
import com.cricket.management.model.ExtraType;
import com.cricket.management.model.Match;
import com.cricket.management.model.MatchStatus;
import com.cricket.management.model.WicketType;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.Random;
import java.util.concurrent.*;

@Service
public class MatchSimulationService {

    private final MatchService matchService;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private final ConcurrentHashMap<String, ScheduledFuture<?>> simulationTasks = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public MatchSimulationService(@Lazy MatchService matchService) {
        this.matchService = matchService;
    }

    @PostConstruct
    public void startScheduler() {
        // Scheduler is active and ready to spawn tasks per match
    }

    @PreDestroy
    public void shutdown() {
        scheduler.shutdownNow();
    }

    public synchronized void toggleSimulation(String matchId) {
        Match match = matchService.getMatchById(matchId);
        if (match == null) return;

        if (match.isSimulating()) {
            pauseSimulation(matchId);
        } else {
            startSimulation(matchId);
        }
    }

    public synchronized void startSimulation(String matchId) {
        Match match = matchService.getMatchById(matchId);
        if (match == null || match.getStatus() != MatchStatus.LIVE) return;

        match.setSimulating(true);
        cancelTask(matchId);

        int delay = Math.max(500, match.getSimulationSpeedMs());
        ScheduledFuture<?> future = scheduler.scheduleWithFixedDelay(() -> {
            try {
                Match m = matchService.getMatchById(matchId);
                if (m == null || !m.isSimulating() || m.getStatus() != MatchStatus.LIVE) {
                    pauseSimulation(matchId);
                    return;
                }
                simulateNextBall(matchId);
            } catch (Exception e) {
                // Keep simulation resilient
            }
        }, delay, delay, TimeUnit.MILLISECONDS);

        simulationTasks.put(matchId, future);
        matchService.broadcastMatchUpdate(match);
    }

    public synchronized void pauseSimulation(String matchId) {
        Match match = matchService.getMatchById(matchId);
        if (match != null) {
            match.setSimulating(false);
            matchService.broadcastMatchUpdate(match);
        }
        cancelTask(matchId);
    }

    public synchronized void setSimulationSpeed(String matchId, int speedMs) {
        Match match = matchService.getMatchById(matchId);
        if (match == null) return;

        match.setSimulationSpeedMs(Math.max(400, speedMs));
        if (match.isSimulating()) {
            startSimulation(matchId); // Restart with new delay
        }
    }

    public synchronized void stepSingleBall(String matchId) {
        simulateNextBall(matchId);
    }

    private void simulateNextBall(String matchId) {
        Match match = matchService.getMatchById(matchId);
        if (match == null || match.getStatus() != MatchStatus.LIVE) return;

        BallInputDto input = new BallInputDto();
        int roll = random.nextInt(100);

        if (roll < 3) {
            // Wide ball
            input.setExtraType(ExtraType.WIDE);
            input.setExtraRuns(1);
            input.setRuns(0);
            input.setWicket(false);
        } else if (roll < 5) {
            // No ball
            input.setExtraType(ExtraType.NO_BALL);
            input.setExtraRuns(1);
            input.setRuns(random.nextInt(3)); // 0, 1, or 2 runs off no-ball
            input.setWicket(false);
        } else if (roll < 10) {
            // Wicket
            input.setWicket(true);
            input.setRuns(0);
            WicketType[] types = WicketType.values();
            input.setWicketType(types[random.nextInt(types.length)]);
        } else if (roll < 16) {
            // Six
            input.setRuns(6);
            input.setWicket(false);
        } else if (roll < 30) {
            // Four
            input.setRuns(4);
            input.setWicket(false);
        } else if (roll < 42) {
            // Two runs
            input.setRuns(2);
            input.setWicket(false);
        } else if (roll < 74) {
            // Single
            input.setRuns(1);
            input.setWicket(false);
        } else {
            // Dot ball
            input.setRuns(0);
            input.setWicket(false);
        }

        matchService.recordBall(matchId, input);
    }

    private void cancelTask(String matchId) {
        ScheduledFuture<?> task = simulationTasks.remove(matchId);
        if (task != null) {
            task.cancel(false);
        }
    }
}
