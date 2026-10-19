package com.cricket.management.service;

import com.cricket.management.model.*;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class CricketDataService {

    private final Map<String, Team> teams = new ConcurrentHashMap<>();
    private final Map<String, Player> players = new ConcurrentHashMap<>();

    @PostConstruct
    public void initData() {
        // 1. Team India
        Team ind = new Team("team-ind", "India", "IND", "in", "#1e40af", "#3b82f6");
        addPlayer(ind, "ind-1", "Rohit Sharma", PlayerRole.BATSMAN, "Right-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=150",
                new CareerStats(159, 4231, 121, 140.89, 32.05, 1, "1/22", 8.4, 32, 5));
        addPlayer(ind, "ind-2", "Virat Kohli", PlayerRole.BATSMAN, "Right-handed", "Right-arm medium",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                new CareerStats(125, 4188, 122, 137.04, 48.69, 4, "1/13", 8.1, 38, 1));
        addPlayer(ind, "ind-3", "Suryakumar Yadav", PlayerRole.BATSMAN, "Right-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                new CareerStats(71, 2341, 117, 169.45, 42.56, 0, "0/0", 0.0, 20, 4));
        addPlayer(ind, "ind-4", "Rishabh Pant", PlayerRole.WICKET_KEEPER, "Left-handed", "None",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                new CareerStats(76, 1209, 65, 126.73, 23.25, 0, "0/0", 0.0, 3, 0));
        addPlayer(ind, "ind-5", "Hardik Pandya", PlayerRole.ALL_ROUNDER, "Right-handed", "Right-arm fast-medium",
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
                new CareerStats(102, 1492, 71, 140.48, 27.12, 86, "4/16", 8.15, 4, 0));
        addPlayer(ind, "ind-6", "Shivam Dube", PlayerRole.ALL_ROUNDER, "Left-handed", "Right-arm medium",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
                new CareerStats(33, 448, 63, 134.53, 29.86, 11, "3/30", 9.12, 3, 0));
        addPlayer(ind, "ind-7", "Ravindra Jadeja", PlayerRole.ALL_ROUNDER, "Left-handed", "Slow left-arm orthodox",
                "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
                new CareerStats(74, 515, 46, 127.16, 21.45, 54, "3/15", 7.13, 0, 0));
        addPlayer(ind, "ind-8", "Axar Patel", PlayerRole.ALL_ROUNDER, "Left-handed", "Slow left-arm orthodox",
                "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
                new CareerStats(60, 463, 65, 143.34, 21.04, 62, "3/9", 7.19, 1, 0));
        addPlayer(ind, "ind-9", "Kuldeep Yadav", PlayerRole.BOWLER, "Left-handed", "Left-arm wrist spin",
                "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
                new CareerStats(40, 46, 23, 85.18, 9.2, 69, "5/17", 6.74, 0, 0));
        addPlayer(ind, "ind-10", "Jasprit Bumrah", PlayerRole.BOWLER, "Right-handed", "Right-arm fast",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                new CareerStats(70, 24, 7, 68.57, 4.8, 89, "3/7", 6.27, 0, 0));
        addPlayer(ind, "ind-11", "Arshdeep Singh", PlayerRole.BOWLER, "Left-handed", "Left-arm medium-fast",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
                new CareerStats(54, 38, 12, 70.37, 7.6, 83, "4/9", 8.32, 0, 0));
        teams.put(ind.getId(), ind);

        // 2. Team Australia
        Team aus = new Team("team-aus", "Australia", "AUS", "au", "#d97706", "#f59e0b");
        addPlayer(aus, "aus-1", "Travis Head", PlayerRole.BATSMAN, "Left-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
                new CareerStats(38, 1092, 91, 158.49, 34.12, 1, "1/10", 7.8, 6, 0));
        addPlayer(aus, "aus-2", "David Warner", PlayerRole.BATSMAN, "Left-handed", "Right-arm legbreak",
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
                new CareerStats(110, 3277, 100, 142.47, 33.43, 0, "0/0", 0.0, 28, 1));
        addPlayer(aus, "aus-3", "Mitchell Marsh", PlayerRole.ALL_ROUNDER, "Right-handed", "Right-arm medium",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
                new CareerStats(61, 1515, 92, 134.42, 33.66, 17, "3/24", 8.24, 9, 0));
        addPlayer(aus, "aus-4", "Glenn Maxwell", PlayerRole.ALL_ROUNDER, "Right-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                new CareerStats(113, 2600, 145, 155.5, 29.54, 43, "3/10", 7.58, 11, 5));
        addPlayer(aus, "aus-5", "Marcus Stoinis", PlayerRole.ALL_ROUNDER, "Right-handed", "Right-arm medium",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                new CareerStats(65, 1143, 78, 146.91, 30.89, 39, "3/18", 8.44, 4, 0));
        addPlayer(aus, "aus-6", "Tim David", PlayerRole.BATSMAN, "Right-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                new CareerStats(44, 1060, 92, 163.58, 36.55, 5, "1/18", 9.1, 5, 0));
        addPlayer(aus, "aus-7", "Matthew Wade", PlayerRole.WICKET_KEEPER, "Left-handed", "Right-arm medium",
                "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=150",
                new CareerStats(92, 1202, 80, 134.45, 26.13, 0, "0/0", 0.0, 3, 0));
        addPlayer(aus, "aus-8", "Pat Cummins", PlayerRole.BOWLER, "Right-handed", "Right-arm fast",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                new CareerStats(57, 187, 28, 119.87, 12.46, 66, "3/15", 7.35, 0, 0));
        addPlayer(aus, "aus-9", "Mitchell Starc", PlayerRole.BOWLER, "Left-handed", "Left-arm fast",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
                new CareerStats(65, 94, 14, 86.23, 7.83, 79, "4/20", 7.64, 0, 0));
        addPlayer(aus, "aus-10", "Adam Zampa", PlayerRole.BOWLER, "Right-handed", "Right-arm legbreak",
                "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
                new CareerStats(87, 62, 13, 74.69, 7.75, 111, "5/19", 7.21, 0, 0));
        addPlayer(aus, "aus-11", "Josh Hazlewood", PlayerRole.BOWLER, "Left-handed", "Right-arm fast-medium",
                "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
                new CareerStats(51, 28, 13, 63.63, 7.0, 67, "4/12", 7.42, 0, 0));
        teams.put(aus.getId(), aus);

        // 3. Team England
        Team eng = new Team("team-eng", "England", "ENG", "gb-eng", "#dc2626", "#ef4444");
        addPlayer(eng, "eng-1", "Jos Buttler", PlayerRole.WICKET_KEEPER, "Right-handed", "None",
                "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=150",
                new CareerStats(124, 3264, 101, 146.3, 35.86, 0, "0/0", 0.0, 24, 1));
        addPlayer(eng, "eng-2", "Phil Salt", PlayerRole.BATSMAN, "Right-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                new CareerStats(38, 1056, 119, 165.77, 34.06, 0, "0/0", 0.0, 4, 3));
        addPlayer(eng, "eng-3", "Jonny Bairstow", PlayerRole.BATSMAN, "Right-handed", "Right-arm medium",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                new CareerStats(80, 1671, 90, 138.1, 29.83, 0, "0/0", 0.0, 10, 0));
        addPlayer(eng, "eng-4", "Harry Brook", PlayerRole.BATSMAN, "Right-handed", "Right-arm medium",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                new CareerStats(39, 735, 81, 145.25, 29.4, 0, "0/0", 0.0, 4, 0));
        addPlayer(eng, "eng-5", "Moeen Ali", PlayerRole.ALL_ROUNDER, "Left-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
                new CareerStats(92, 1229, 72, 142.41, 21.56, 51, "3/24", 8.21, 7, 0));
        addPlayer(eng, "eng-6", "Liam Livingstone", PlayerRole.ALL_ROUNDER, "Right-handed", "Right-arm legbreak",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
                new CareerStats(55, 856, 103, 150.7, 24.45, 28, "3/17", 8.41, 2, 1));
        addPlayer(eng, "eng-7", "Sam Curran", PlayerRole.ALL_ROUNDER, "Left-handed", "Left-arm medium-fast",
                "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
                new CareerStats(53, 308, 41, 128.87, 14.0, 54, "5/10", 7.97, 0, 0));
        addPlayer(eng, "eng-8", "Chris Jordan", PlayerRole.BOWLER, "Right-handed", "Right-arm fast-medium",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                new CareerStats(95, 439, 36, 131.04, 14.16, 108, "4/6", 8.71, 0, 0));
        addPlayer(eng, "eng-9", "Jofra Archer", PlayerRole.BOWLER, "Right-handed", "Right-arm fast",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
                new CareerStats(28, 42, 12, 105.0, 8.4, 35, "3/12", 7.4, 0, 0));
        addPlayer(eng, "eng-10", "Adil Rashid", PlayerRole.BOWLER, "Right-handed", "Right-arm legbreak",
                "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
                new CareerStats(114, 116, 19, 78.37, 5.8, 122, "4/2", 7.37, 0, 0));
        addPlayer(eng, "eng-11", "Mark Wood", PlayerRole.BOWLER, "Right-handed", "Right-arm fast",
                "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
                new CareerStats(34, 19, 5, 61.29, 3.8, 50, "3/9", 8.16, 0, 0));
        teams.put(eng.getId(), eng);

        // 4. Team South Africa
        Team sa = new Team("team-sa", "South Africa", "SA", "za", "#047857", "#10b981");
        addPlayer(sa, "sa-1", "Quinton de Kock", PlayerRole.WICKET_KEEPER, "Left-handed", "None",
                "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=150",
                new CareerStats(92, 2584, 100, 138.33, 31.51, 0, "0/0", 0.0, 16, 1));
        addPlayer(sa, "sa-2", "Reeza Hendricks", PlayerRole.BATSMAN, "Right-handed", "Right-arm medium",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                new CareerStats(70, 1979, 87, 130.88, 30.44, 0, "0/0", 0.0, 17, 0));
        addPlayer(sa, "sa-3", "Aiden Markram", PlayerRole.BATSMAN, "Right-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                new CareerStats(51, 1324, 70, 147.27, 34.84, 11, "3/21", 7.82, 9, 0));
        addPlayer(sa, "sa-4", "Heinrich Klaasen", PlayerRole.BATSMAN, "Right-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                new CareerStats(54, 1002, 81, 142.53, 23.85, 0, "0/0", 0.0, 5, 0));
        addPlayer(sa, "sa-5", "David Miller", PlayerRole.BATSMAN, "Left-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
                new CareerStats(125, 2437, 106, 141.27, 33.84, 0, "0/0", 0.0, 7, 2));
        addPlayer(sa, "sa-6", "Tristan Stubbs", PlayerRole.BATSMAN, "Right-handed", "Right-arm offbreak",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
                new CareerStats(31, 524, 72, 145.96, 27.57, 1, "1/2", 6.8, 2, 0));
        addPlayer(sa, "sa-7", "Marco Jansen", PlayerRole.ALL_ROUNDER, "Right-handed", "Left-arm fast",
                "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
                new CareerStats(18, 127, 21, 132.29, 14.11, 19, "3/22", 8.42, 0, 0));
        addPlayer(sa, "sa-8", "Keshav Maharaj", PlayerRole.BOWLER, "Right-handed", "Slow left-arm orthodox",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                new CareerStats(38, 86, 24, 98.85, 9.55, 43, "3/21", 7.15, 0, 0));
        addPlayer(sa, "sa-9", "Kagiso Rabada", PlayerRole.BOWLER, "Left-handed", "Right-arm fast",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
                new CareerStats(65, 172, 22, 108.86, 12.28, 71, "3/18", 8.35, 0, 0));
        addPlayer(sa, "sa-10", "Anrich Nortje", PlayerRole.BOWLER, "Right-handed", "Right-arm fast",
                "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
                new CareerStats(42, 28, 7, 54.9, 4.66, 53, "4/7", 7.14, 0, 0));
        addPlayer(sa, "sa-11", "Tabraiz Shamsi", PlayerRole.BOWLER, "Right-handed", "Left-arm chinaman",
                "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
                new CareerStats(70, 11, 4, 39.28, 2.75, 89, "5/24", 7.39, 0, 0));
        teams.put(sa.getId(), sa);
    }

    private void addPlayer(Team team, String id, String name, PlayerRole role, String batStyle,
                           String bowlStyle, String avatar, CareerStats stats) {
        Player player = new Player(id, name, team.getId(), team.getName(), role, batStyle, bowlStyle, avatar, stats);
        team.getPlayers().add(player);
        players.put(id, player);
    }

    public List<Team> getAllTeams() {
        return new ArrayList<>(teams.values());
    }

    public Team getTeamById(String id) {
        return teams.get(id);
    }

    public List<Player> getAllPlayers() {
        return new ArrayList<>(players.values());
    }

    public Player getPlayerById(String id) {
        return players.get(id);
    }

    public LeaderboardStats getLeaderboard() {
        LeaderboardStats stats = new LeaderboardStats();

        // Top run scorers
        List<Player> topRuns = players.values().stream()
                .filter(p -> p.getCareerStats() != null)
                .sorted((a, b) -> Integer.compare(b.getCareerStats().getRuns(), a.getCareerStats().getRuns()))
                .limit(5)
                .collect(Collectors.toList());
        stats.setTopRunScorers(topRuns);

        // Top wicket takers
        List<Player> topWickets = players.values().stream()
                .filter(p -> p.getCareerStats() != null)
                .sorted((a, b) -> Integer.compare(b.getCareerStats().getWickets(), a.getCareerStats().getWickets()))
                .limit(5)
                .collect(Collectors.toList());
        stats.setTopWicketTakers(topWickets);

        // Highest Strike Rates (min 500 runs)
        List<Player> topSR = players.values().stream()
                .filter(p -> p.getCareerStats() != null && p.getCareerStats().getRuns() >= 500)
                .sorted((a, b) -> Double.compare(b.getCareerStats().getStrikeRate(), a.getCareerStats().getStrikeRate()))
                .limit(5)
                .collect(Collectors.toList());
        stats.setHighestStrikeRates(topSR);

        // Best Economy Rates (min 30 wickets)
        List<Player> bestEco = players.values().stream()
                .filter(p -> p.getCareerStats() != null && p.getCareerStats().getWickets() >= 30)
                .sorted(Comparator.comparingDouble(a -> a.getCareerStats().getEconomy()))
                .limit(5)
                .collect(Collectors.toList());
        stats.setBestEconomyRates(bestEco);

        return stats;
    }
}
