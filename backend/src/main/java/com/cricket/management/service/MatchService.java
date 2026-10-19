package com.cricket.management.service;

import com.cricket.management.dto.*;
import com.cricket.management.model.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final CricketDataService dataService;
    private final SimpMessagingTemplate messagingTemplate;
    private final MatchSimulationService simulationService;
    private final SseService sseService;
    private final Map<String, Match> matches = new ConcurrentHashMap<>();

    public MatchService(CricketDataService dataService,
                        SimpMessagingTemplate messagingTemplate,
                        @Lazy MatchSimulationService simulationService,
                        SseService sseService) {
        this.dataService = dataService;
        this.messagingTemplate = messagingTemplate;
        this.simulationService = simulationService;
        this.sseService = sseService;
    }

    @PostConstruct
    public void initMatches() {
        createDefaultLiveMatch();
        createDefaultCompletedMatch();
        createDefaultUpcomingMatch();
    }

    private void createDefaultLiveMatch() {
        Team ind = dataService.getTeamById("team-ind");
        Team aus = dataService.getTeamById("team-aus");
        if (ind == null || aus == null) return;

        Match match = new Match();
        match.setId("match-ind-aus");
        match.setTitle("India vs Australia - Super 8 Clash");
        match.setSeries("ICC Men's T20 World Cup 2026");
        match.setVenue("Daren Sammy Cricket Ground, Gros Islet");
        match.setMatchType(MatchType.T20);
        match.setMaxOvers(20);
        match.setStatus(MatchStatus.LIVE);
        match.setTeam1(ind);
        match.setTeam2(aus);
        match.setTossWinnerId(aus.getId());
        match.setTossWinnerName(aus.getName());
        match.setTossDecision(TossDecision.BOWL);
        match.setBattingFirstTeamId(ind.getId());
        match.setChasingTeamId(aus.getId());
        match.setCurrentInningsIndex(0);
        match.setSimulating(false);
        match.setSimulationSpeedMs(2000);

        // 1st Innings: India batting
        InningsScore inn1 = new InningsScore(1, ind.getId(), ind.getName(), aus.getId(), aus.getName());
        inn1.setRuns(114);
        inn1.setWickets(2);
        inn1.setLegalBalls(75); // 12.3 overs
        inn1.setWides(3);
        inn1.setNoBalls(1);
        inn1.setByes(0);
        inn1.setLegByes(2);
        inn1.recalculateOversAndRunRate();
        inn1.setCurrentPartnershipRuns(46);
        inn1.setCurrentPartnershipBalls(29);

        // Batsmen for India
        BatsmanStats rohit = new BatsmanStats("ind-1", "Rohit Sharma", 1);
        rohit.setRuns(28);
        rohit.setBalls(16);
        rohit.setFours(3);
        rohit.setSixes(2);
        rohit.setOut(true);
        rohit.setDismissalInfo("c Warner b Hazlewood");
        rohit.recalculateStrikeRate();

        BatsmanStats pant = new BatsmanStats("ind-4", "Rishabh Pant", 2);
        pant.setRuns(15);
        pant.setBalls(14);
        pant.setFours(2);
        pant.setSixes(0);
        pant.setOut(true);
        pant.setDismissalInfo("c Marsh b Stoinis");
        pant.recalculateStrikeRate();

        BatsmanStats virat = new BatsmanStats("ind-2", "Virat Kohli", 3);
        virat.setRuns(42);
        virat.setBalls(31);
        virat.setFours(4);
        virat.setSixes(1);
        virat.setOnStrike(true);
        virat.recalculateStrikeRate();

        BatsmanStats surya = new BatsmanStats("ind-3", "Suryakumar Yadav", 4);
        surya.setRuns(35);
        surya.setBalls(19);
        surya.setFours(3);
        surya.setSixes(2);
        surya.setOnStrike(false);
        surya.recalculateStrikeRate();

        inn1.getBatsmen().addAll(Arrays.asList(rohit, pant, virat, surya));

        // Fall of wickets
        inn1.getFallOfWickets().add(new WicketDetail(1, 41, "4.2", "Rohit Sharma", "c Warner b Hazlewood"));
        inn1.getFallOfWickets().add(new WicketDetail(2, 68, "7.4", "Rishabh Pant", "c Marsh b Stoinis"));

        // Bowlers for Australia
        BowlerStats starc = new BowlerStats("aus-9", "Mitchell Starc");
        starc.setLegalBallsBowled(15); // 2.3 overs
        starc.setRunsConceded(24);
        starc.setWickets(0);
        starc.setWides(1);
        starc.setNoBalls(0);
        starc.setCurrentBowler(true);
        starc.updateOversAndEconomy();

        BowlerStats hazlewood = new BowlerStats("aus-11", "Josh Hazlewood");
        hazlewood.setLegalBallsBowled(18); // 3.0 overs
        hazlewood.setRunsConceded(22);
        hazlewood.setWickets(1);
        hazlewood.updateOversAndEconomy();

        BowlerStats cummins = new BowlerStats("aus-8", "Pat Cummins");
        cummins.setLegalBallsBowled(18); // 3.0 overs
        cummins.setRunsConceded(28);
        cummins.setWickets(0);
        cummins.updateOversAndEconomy();

        BowlerStats zampa = new BowlerStats("aus-10", "Adam Zampa");
        zampa.setLegalBallsBowled(18); // 3.0 overs
        zampa.setRunsConceded(26);
        zampa.setWickets(0);
        zampa.updateOversAndEconomy();

        BowlerStats stoinis = new BowlerStats("aus-5", "Marcus Stoinis");
        stoinis.setLegalBallsBowled(6); // 1.0 overs
        stoinis.setRunsConceded(10);
        stoinis.setWickets(1);
        stoinis.updateOversAndEconomy();

        inn1.getBowlers().addAll(Arrays.asList(starc, hazlewood, cummins, zampa, stoinis));
        match.getInnings().add(inn1);

        match.setCurrentStrikerId(virat.getPlayerId());
        match.setCurrentNonStrikerId(surya.getPlayerId());
        match.setCurrentBowlerId(starc.getPlayerId());

        // Sample commentary
        addSampleCommentary(match, "12.3", "Starc to Kohli", 1, "Fuller length on middle, flicked away through midwicket for a single.");
        addSampleCommentary(match, "12.2", "Starc to Suryakumar", 4, "FOUR! Innovative ramp shot over third man! Pure genius from SKY!");
        addSampleCommentary(match, "12.1", "Starc to Suryakumar", 0, "Beaten! Good length shaping away outside off stump, swings and misses.");
        addSampleCommentary(match, "11.6", "Zampa to Kohli", 1, "Punched down to long-on to retain the strike.");

        matches.put(match.getId(), match);
    }

    private void createDefaultCompletedMatch() {
        Team eng = dataService.getTeamById("team-eng");
        Team sa = dataService.getTeamById("team-sa");
        if (eng == null || sa == null) return;

        Match match = new Match();
        match.setId("match-eng-sa");
        match.setTitle("England vs South Africa - Super 8 Thriller");
        match.setSeries("ICC Men's T20 World Cup 2026");
        match.setVenue("Kensington Oval, Bridgetown, Barbados");
        match.setMatchType(MatchType.T20);
        match.setMaxOvers(20);
        match.setStatus(MatchStatus.COMPLETED);
        match.setTeam1(sa);
        match.setTeam2(eng);
        match.setTossWinnerId(eng.getId());
        match.setTossWinnerName(eng.getName());
        match.setTossDecision(TossDecision.BOWL);
        match.setBattingFirstTeamId(sa.getId());
        match.setChasingTeamId(eng.getId());
        match.setCurrentInningsIndex(1);
        match.setTarget(164);
        match.setWinnerTeamId(sa.getId());
        match.setWinnerTeamName(sa.getName());
        match.setWinMargin("7 runs");
        match.setPlayerOfTheMatch("Heinrich Klaasen (65 off 34 balls)");

        // 1st Innings: South Africa 163/6 (20.0)
        InningsScore inn1 = new InningsScore(1, sa.getId(), sa.getName(), eng.getId(), eng.getName());
        inn1.setRuns(163);
        inn1.setWickets(6);
        inn1.setLegalBalls(120);
        inn1.setCompleted(true);
        inn1.recalculateOversAndRunRate();

        BatsmanStats qdk = new BatsmanStats("sa-1", "Quinton de Kock", 1);
        qdk.setRuns(48); qdk.setBalls(32); qdk.setFours(5); qdk.setSixes(2); qdk.setOut(true);
        qdk.setDismissalInfo("c Buttler b Archer"); qdk.recalculateStrikeRate();

        BatsmanStats klaasen = new BatsmanStats("sa-4", "Heinrich Klaasen", 4);
        klaasen.setRuns(65); klaasen.setBalls(34); klaasen.setFours(4); klaasen.setSixes(5); klaasen.setOut(false);
        klaasen.setDismissalInfo("not out"); klaasen.recalculateStrikeRate();

        BatsmanStats miller = new BatsmanStats("sa-5", "David Miller", 5);
        miller.setRuns(28); miller.setBalls(21); miller.setFours(2); miller.setSixes(1); miller.setOut(true);
        miller.setDismissalInfo("b Wood"); miller.recalculateStrikeRate();

        inn1.getBatsmen().addAll(Arrays.asList(qdk, klaasen, miller));
        match.getInnings().add(inn1);

        // 2nd Innings: England 156/6 (20.0)
        InningsScore inn2 = new InningsScore(2, eng.getId(), eng.getName(), sa.getId(), sa.getName());
        inn2.setRuns(156);
        inn2.setWickets(6);
        inn2.setLegalBalls(120);
        inn2.setCompleted(true);
        inn2.recalculateOversAndRunRate();

        BatsmanStats buttler = new BatsmanStats("eng-1", "Jos Buttler", 1);
        buttler.setRuns(53); buttler.setBalls(38); buttler.setFours(4); buttler.setSixes(2); buttler.setOut(true);
        buttler.setDismissalInfo("c Stubbs b Nortje"); buttler.recalculateStrikeRate();

        BatsmanStats brook = new BatsmanStats("eng-4", "Harry Brook", 4);
        brook.setRuns(42); brook.setBalls(26); brook.setFours(3); brook.setSixes(2); brook.setOut(true);
        brook.setDismissalInfo("c Markram b Rabada"); brook.recalculateStrikeRate();

        inn2.getBatsmen().addAll(Arrays.asList(buttler, brook));
        match.getInnings().add(inn2);

        matches.put(match.getId(), match);
    }

    private void createDefaultUpcomingMatch() {
        Team pak = new Team("team-pak", "Pakistan", "PAK", "pk", "#15803d", "#22c55e");
        Team nz = new Team("team-nz", "New Zealand", "NZ", "nz", "#18181b", "#71717a");

        Match match = new Match();
        match.setId("match-pak-nz");
        match.setTitle("Pakistan vs New Zealand - Group Stage");
        match.setSeries("ICC Men's T20 World Cup 2026");
        match.setVenue("Sir Vivian Richards Stadium, North Sound, Antigua");
        match.setMatchType(MatchType.T20);
        match.setMaxOvers(20);
        match.setStatus(MatchStatus.UPCOMING);
        match.setTeam1(pak);
        match.setTeam2(nz);
        match.setBattingFirstTeamId(pak.getId());
        match.setChasingTeamId(nz.getId());

        matches.put(match.getId(), match);
    }

    private void addSampleCommentary(Match match, String overStr, String bowlerStriker, int runs, String text) {
        BallEvent event = new BallEvent();
        event.setId(UUID.randomUUID().toString());
        event.setMatchId(match.getId());
        event.setLegalBall(true);
        event.setRunsScored(runs);
        event.setTotalRunsOnBall(runs);
        event.setCommentary(overStr + " | " + bowlerStriker + " -> " + text);
        match.getRecentBalls().add(0, event);
        match.getCommentaryList().add(0, event);
    }

    public List<Match> getAllMatches(MatchStatus status) {
        if (status == null) {
            return new ArrayList<>(matches.values());
        }
        return matches.values().stream()
                .filter(m -> m.getStatus() == status)
                .collect(Collectors.toList());
    }

    public Match getMatchById(String matchId) {
        return matches.get(matchId);
    }

    public synchronized Match createMatch(CreateMatchRequest req) {
        Team t1 = dataService.getTeamById(req.getTeam1Id());
        Team t2 = dataService.getTeamById(req.getTeam2Id());
        if (t1 == null || t2 == null) {
            throw new IllegalArgumentException("Invalid team IDs specified");
        }

        Match match = new Match();
        match.setId("match-" + UUID.randomUUID().toString().substring(0, 8));
        match.setTitle(req.getTitle() != null ? req.getTitle() : (t1.getName() + " vs " + t2.getName()));
        match.setSeries(req.getSeries() != null ? req.getSeries() : "T20 International Series");
        match.setVenue(req.getVenue() != null ? req.getVenue() : "International Cricket Stadium");
        match.setMatchType(req.getMatchType() != null ? req.getMatchType() : MatchType.T20);
        int overs = (req.getMaxOvers() != null && req.getMaxOvers() > 0)
                ? req.getMaxOvers()
                : match.getMatchType().getDefaultOvers();
        match.setMaxOvers(overs);
        match.setStatus(MatchStatus.UPCOMING);
        match.setTeam1(t1);
        match.setTeam2(t2);

        matches.put(match.getId(), match);
        broadcastMatchUpdate(match);
        return match;
    }

    public synchronized Match conductToss(String matchId, TossRequest req) {
        Match match = matches.get(matchId);
        if (match == null) throw new NoSuchElementException("Match not found: " + matchId);

        match.setTossWinnerId(req.getTossWinnerId());
        String tossWinnerName = req.getTossWinnerId().equals(match.getTeam1().getId())
                ? match.getTeam1().getName() : match.getTeam2().getName();
        match.setTossWinnerName(tossWinnerName);
        match.setTossDecision(req.getTossDecision());

        String battingFirstId;
        String chasingId;
        if (req.getTossDecision() == TossDecision.BAT) {
            battingFirstId = req.getTossWinnerId();
            chasingId = req.getTossWinnerId().equals(match.getTeam1().getId()) ? match.getTeam2().getId() : match.getTeam1().getId();
        } else {
            chasingId = req.getTossWinnerId();
            battingFirstId = req.getTossWinnerId().equals(match.getTeam1().getId()) ? match.getTeam2().getId() : match.getTeam1().getId();
        }

        match.setBattingFirstTeamId(battingFirstId);
        match.setChasingTeamId(chasingId);
        match.setStatus(MatchStatus.LIVE);
        match.setCurrentInningsIndex(0);

        Team battingTeam = match.getBattingFirstTeamId().equals(match.getTeam1().getId()) ? match.getTeam1() : match.getTeam2();
        Team bowlingTeam = match.getBattingFirstTeamId().equals(match.getTeam1().getId()) ? match.getTeam2() : match.getTeam1();

        // Initialize 1st Innings
        InningsScore inn1 = new InningsScore(1, battingTeam.getId(), battingTeam.getName(), bowlingTeam.getId(), bowlingTeam.getName());

        // Setup Opening Batsmen
        List<Player> batPlayers = battingTeam.getPlayers();
        if (batPlayers.size() >= 2) {
            BatsmanStats b1 = new BatsmanStats(batPlayers.get(0).getId(), batPlayers.get(0).getName(), 1);
            b1.setOnStrike(true);
            BatsmanStats b2 = new BatsmanStats(batPlayers.get(1).getId(), batPlayers.get(1).getName(), 2);
            b2.setOnStrike(false);
            inn1.getBatsmen().add(b1);
            inn1.getBatsmen().add(b2);
            match.setCurrentStrikerId(b1.getPlayerId());
            match.setCurrentNonStrikerId(b2.getPlayerId());
        }

        // Setup Opening Bowler
        List<Player> bowlPlayers = bowlingTeam.getPlayers();
        if (!bowlPlayers.isEmpty()) {
            Player openingBowler = bowlPlayers.get(bowlPlayers.size() - 1); // Often pace bowler at end of squad
            BowlerStats bw = new BowlerStats(openingBowler.getId(), openingBowler.getName());
            bw.setCurrentBowler(true);
            inn1.getBowlers().add(bw);
            match.setCurrentBowlerId(bw.getPlayerId());
        }

        match.getInnings().clear();
        match.getInnings().add(inn1);
        match.setUpdatedAt(System.currentTimeMillis());

        broadcastMatchUpdate(match);
        return match;
    }

    public synchronized BallEvent recordBall(String matchId, BallInputDto input) {
        Match match = matches.get(matchId);
        if (match == null) throw new NoSuchElementException("Match not found: " + matchId);
        if (match.getStatus() != MatchStatus.LIVE) {
            throw new IllegalStateException("Match is not in LIVE state: " + match.getStatus());
        }

        InningsScore currentInnings = match.getCurrentInnings();
        if (currentInnings == null) {
            throw new IllegalStateException("No active innings found");
        }

        Team battingTeam = currentInnings.getBattingTeamId().equals(match.getTeam1().getId()) ? match.getTeam1() : match.getTeam2();
        Team bowlingTeam = currentInnings.getBowlingTeamId().equals(match.getTeam1().getId()) ? match.getTeam1() : match.getTeam2();

        // 1. Resolve active Batsmen & Bowler
        BatsmanStats striker = currentInnings.getBatsmen().stream()
                .filter(b -> b.getPlayerId().equals(match.getCurrentStrikerId()))
                .findFirst()
                .orElse(null);

        BatsmanStats nonStriker = currentInnings.getBatsmen().stream()
                .filter(b -> b.getPlayerId().equals(match.getCurrentNonStrikerId()))
                .findFirst()
                .orElse(null);

        BowlerStats bowler = currentInnings.getBowlers().stream()
                .filter(b -> b.getPlayerId().equals(match.getCurrentBowlerId()))
                .findFirst()
                .orElse(null);

        if (striker == null || bowler == null) {
            throw new IllegalStateException("Active striker or bowler not configured");
        }

        // 2. Extra calculation & legal ball determination
        ExtraType extraType = input.getExtraType() != null ? input.getExtraType() : ExtraType.NONE;
        boolean isLegalBall = (extraType != ExtraType.WIDE && extraType != ExtraType.NO_BALL);
        int runsScored = input.getRuns();
        int extraRuns = input.getExtraRuns();

        if (extraType == ExtraType.WIDE) {
            extraRuns = Math.max(1, extraRuns);
            currentInnings.setWides(currentInnings.getWides() + extraRuns);
        } else if (extraType == ExtraType.NO_BALL) {
            extraRuns = Math.max(1, extraRuns);
            currentInnings.setNoBalls(currentInnings.getNoBalls() + extraRuns);
        } else if (extraType == ExtraType.BYE) {
            currentInnings.setByes(currentInnings.getByes() + extraRuns);
        } else if (extraType == ExtraType.LEG_BYE) {
            currentInnings.setLegByes(currentInnings.getLegByes() + extraRuns);
        }

        int totalRunsOnBall = runsScored + extraRuns;

        // 3. Update Team Runs & Legal Balls
        currentInnings.setRuns(currentInnings.getRuns() + totalRunsOnBall);
        if (isLegalBall) {
            currentInnings.setLegalBalls(currentInnings.getLegalBalls() + 1);
        }
        currentInnings.recalculateOversAndRunRate();

        // 4. Update Striker Stats
        if (isLegalBall || extraType == ExtraType.NO_BALL) {
            striker.setBalls(striker.getBalls() + 1);
        }
        striker.setRuns(striker.getRuns() + runsScored);
        if (runsScored == 4) striker.setFours(striker.getFours() + 1);
        if (runsScored == 6) striker.setSixes(striker.getSixes() + 1);
        striker.recalculateStrikeRate();

        // Update partnership
        currentInnings.setCurrentPartnershipRuns(currentInnings.getCurrentPartnershipRuns() + totalRunsOnBall);
        if (isLegalBall) {
            currentInnings.setCurrentPartnershipBalls(currentInnings.getCurrentPartnershipBalls() + 1);
        }

        // 5. Update Bowler Stats
        if (isLegalBall) {
            bowler.setLegalBallsBowled(bowler.getLegalBallsBowled() + 1);
        }
        // Bowler concedes batsman runs + wides + no-balls (byes and leg-byes are not conceded by bowler)
        int runsConceded = runsScored;
        if (extraType == ExtraType.WIDE || extraType == ExtraType.NO_BALL) {
            runsConceded += extraRuns;
            if (extraType == ExtraType.WIDE) bowler.setWides(bowler.getWides() + extraRuns);
            if (extraType == ExtraType.NO_BALL) bowler.setNoBalls(bowler.getNoBalls() + extraRuns);
        }
        bowler.setRunsConceded(bowler.getRunsConceded() + runsConceded);

        // 6. Handle Wicket
        boolean isWicket = input.isWicket();
        WicketType wicketType = input.getWicketType();
        String dismissedBatsmanName = striker.getPlayerName();

        if (isWicket) {
            currentInnings.setWickets(currentInnings.getWickets() + 1);
            bowler.setWickets(bowler.getWickets() + 1);

            striker.setOut(true);
            String dismissalDesc = formatDismissal(wicketType, bowler.getPlayerName());
            striker.setDismissalInfo(dismissalDesc);

            // Add Fall of Wicket
            currentInnings.getFallOfWickets().add(new WicketDetail(
                    currentInnings.getWickets(),
                    currentInnings.getRuns(),
                    currentInnings.getOversFormatted(),
                    striker.getPlayerName(),
                    dismissalDesc
            ));

            // Reset partnership
            currentInnings.setCurrentPartnershipRuns(0);
            currentInnings.setCurrentPartnershipBalls(0);

            // Bring new batsman if not all out
            if (currentInnings.getWickets() < 10) {
                int nextBattingOrder = currentInnings.getBatsmen().size() + 1;
                List<Player> roster = battingTeam.getPlayers();
                if (nextBattingOrder <= roster.size()) {
                    Player nextPlayer = roster.get(nextBattingOrder - 1);
                    BatsmanStats nextBatsman = new BatsmanStats(nextPlayer.getId(), nextPlayer.getName(), nextBattingOrder);
                    nextBatsman.setOnStrike(true);
                    currentInnings.getBatsmen().add(nextBatsman);
                    match.setCurrentStrikerId(nextBatsman.getPlayerId());
                    striker = nextBatsman;
                }
            }
        }

        // 7. Create Ball Event & Commentary
        int overNum = (currentInnings.getLegalBalls() - (isLegalBall ? 1 : 0)) / 6;
        int ballInOver = (currentInnings.getLegalBalls() - (isLegalBall ? 1 : 0)) % 6 + (isLegalBall ? 1 : 0);

        BallEvent event = new BallEvent();
        event.setId(UUID.randomUUID().toString());
        event.setMatchId(matchId);
        event.setInningsNumber(currentInnings.getInningsNumber());
        event.setOverNumber(overNum);
        event.setBallInOver(ballInOver);
        event.setLegalBall(isLegalBall);
        event.setStrikerId(striker.getPlayerId());
        event.setStrikerName(striker.getPlayerName());
        if (nonStriker != null) {
            event.setNonStrikerId(nonStriker.getPlayerId());
            event.setNonStrikerName(nonStriker.getPlayerName());
        }
        event.setBowlerId(bowler.getPlayerId());
        event.setBowlerName(bowler.getPlayerName());
        event.setRunsScored(runsScored);
        event.setExtraType(extraType);
        event.setExtraRuns(extraRuns);
        event.setTotalRunsOnBall(totalRunsOnBall);
        event.setWicket(isWicket);
        event.setWicketType(wicketType);
        if (isWicket) {
            event.setDismissedPlayerName(dismissedBatsmanName);
        }

        String commentary = input.getCommentary();
        if (commentary == null || commentary.trim().isEmpty()) {
            commentary = generateBallCommentary(overNum, ballInOver, bowler.getPlayerName(),
                    striker.getPlayerName(), totalRunsOnBall, isWicket, wicketType, extraType);
        }
        event.setCommentary(commentary);

        match.getRecentBalls().add(0, event);
        if (match.getRecentBalls().size() > 24) {
            match.getRecentBalls().remove(match.getRecentBalls().size() - 1);
        }
        match.getCommentaryList().add(0, event);

        // 8. Strike rotation on odd runs (only if not out)
        if (!isWicket && (runsScored % 2 != 0)) {
            swapStrike(match, striker, nonStriker);
        }

        // 9. Over completion check
        boolean overCompleted = isLegalBall && (currentInnings.getLegalBalls() % 6 == 0);
        if (overCompleted) {
            // Swap strike at the end of the over
            swapStrike(match, striker, nonStriker);
            // Change bowler
            rotateBowler(match, currentInnings, bowlingTeam, bowler.getPlayerId());
        }

        // 10. Check Innings or Match Conclusion
        checkMatchProgress(match, currentInnings);

        match.setUpdatedAt(System.currentTimeMillis());
        broadcastMatchUpdate(match);
        return event;
    }

    private void swapStrike(Match match, BatsmanStats striker, BatsmanStats nonStriker) {
        if (striker == null || nonStriker == null) return;
        String temp = match.getCurrentStrikerId();
        match.setCurrentStrikerId(match.getCurrentNonStrikerId());
        match.setCurrentNonStrikerId(temp);

        striker.setOnStrike(!striker.isOnStrike());
        nonStriker.setOnStrike(!nonStriker.isOnStrike());
    }

    private void rotateBowler(Match match, InningsScore innings, Team bowlingTeam, String lastBowlerId) {
        List<Player> bowlersList = bowlingTeam.getPlayers().stream()
                .filter(p -> p.getRole() == PlayerRole.BOWLER || p.getRole() == PlayerRole.ALL_ROUNDER)
                .collect(Collectors.toList());

        if (bowlersList.isEmpty()) {
            bowlersList = bowlingTeam.getPlayers();
        }

        // Filter out the bowler who just bowled the over
        List<Player> eligibleBowlers = bowlersList.stream()
                .filter(p -> !p.getId().equals(lastBowlerId))
                .collect(Collectors.toList());

        if (eligibleBowlers.isEmpty()) eligibleBowlers = bowlersList;

        // Pick next bowler
        Player chosen = eligibleBowlers.get((int) (Math.random() * eligibleBowlers.size()));

        // Mark previous bowler not current
        innings.getBowlers().forEach(b -> b.setCurrentBowler(false));

        // Find or create BowlerStats
        BowlerStats bowlerStats = innings.getBowlers().stream()
                .filter(b -> b.getPlayerId().equals(chosen.getId()))
                .findFirst()
                .orElseGet(() -> {
                    BowlerStats nb = new BowlerStats(chosen.getId(), chosen.getName());
                    innings.getBowlers().add(nb);
                    return nb;
                });

        bowlerStats.setCurrentBowler(true);
        match.setCurrentBowlerId(bowlerStats.getPlayerId());
    }

    private void checkMatchProgress(Match match, InningsScore currentInnings) {
        int maxLegalBalls = match.getMaxOvers() * 6;
        boolean inningsFinished = (currentInnings.getLegalBalls() >= maxLegalBalls) || (currentInnings.getWickets() >= 10);

        if (match.getCurrentInningsIndex() == 0) {
            // First Innings
            if (inningsFinished) {
                currentInnings.setCompleted(true);
                match.setTarget(currentInnings.getRuns() + 1);

                // Start 2nd Innings
                startSecondInnings(match);
            }
        } else {
            // Second Innings (Chasing)
            int target = match.getTarget() != null ? match.getTarget() : (match.getInnings().get(0).getRuns() + 1);
            Team chasingTeam = match.getChasingTeamId().equals(match.getTeam1().getId()) ? match.getTeam1() : match.getTeam2();
            Team defendingTeam = match.getBattingFirstTeamId().equals(match.getTeam1().getId()) ? match.getTeam1() : match.getTeam2();

            if (currentInnings.getRuns() >= target) {
                // Chasing team won!
                currentInnings.setCompleted(true);
                match.setStatus(MatchStatus.COMPLETED);
                match.setWinnerTeamId(chasingTeam.getId());
                match.setWinnerTeamName(chasingTeam.getName());
                int wicketsLeft = 10 - currentInnings.getWickets();
                match.setWinMargin(wicketsLeft + " wickets");
                match.setSimulating(false);
                determinePlayerOfTheMatch(match);
            } else if (inningsFinished) {
                // Innings finished without reaching target
                currentInnings.setCompleted(true);
                match.setStatus(MatchStatus.COMPLETED);
                if (currentInnings.getRuns() == target - 1) {
                    match.setWinnerTeamName("Match Tied");
                    match.setWinMargin("Scores Level");
                } else {
                    int runsMargin = (target - 1) - currentInnings.getRuns();
                    match.setWinnerTeamId(defendingTeam.getId());
                    match.setWinnerTeamName(defendingTeam.getName());
                    match.setWinMargin(runsMargin + " runs");
                }
                match.setSimulating(false);
                determinePlayerOfTheMatch(match);
            }
        }
    }

    private void startSecondInnings(Match match) {
        match.setCurrentInningsIndex(1);
        Team chasingTeam = match.getChasingTeamId().equals(match.getTeam1().getId()) ? match.getTeam1() : match.getTeam2();
        Team bowlingTeam = match.getBattingFirstTeamId().equals(match.getTeam1().getId()) ? match.getTeam1() : match.getTeam2();

        InningsScore inn2 = new InningsScore(2, chasingTeam.getId(), chasingTeam.getName(), bowlingTeam.getId(), bowlingTeam.getName());

        List<Player> batPlayers = chasingTeam.getPlayers();
        if (batPlayers.size() >= 2) {
            BatsmanStats b1 = new BatsmanStats(batPlayers.get(0).getId(), batPlayers.get(0).getName(), 1);
            b1.setOnStrike(true);
            BatsmanStats b2 = new BatsmanStats(batPlayers.get(1).getId(), batPlayers.get(1).getName(), 2);
            b2.setOnStrike(false);
            inn2.getBatsmen().add(b1);
            inn2.getBatsmen().add(b2);
            match.setCurrentStrikerId(b1.getPlayerId());
            match.setCurrentNonStrikerId(b2.getPlayerId());
        }

        List<Player> bowlPlayers = bowlingTeam.getPlayers();
        if (!bowlPlayers.isEmpty()) {
            Player openingBowler = bowlPlayers.get(bowlPlayers.size() - 1);
            BowlerStats bw = new BowlerStats(openingBowler.getId(), openingBowler.getName());
            bw.setCurrentBowler(true);
            inn2.getBowlers().add(bw);
            match.setCurrentBowlerId(bw.getPlayerId());
        }

        match.getInnings().add(inn2);
    }

    private void determinePlayerOfTheMatch(Match match) {
        String topPlayer = null;
        double maxScore = -1;

        for (InningsScore inn : match.getInnings()) {
            for (BatsmanStats b : inn.getBatsmen()) {
                double score = b.getRuns() * 1.0 + (b.getSixes() * 2) + (b.getFours() * 1);
                if (score > maxScore) {
                    maxScore = score;
                    topPlayer = b.getPlayerName() + " (" + b.getRuns() + " off " + b.getBalls() + " balls)";
                }
            }
            for (BowlerStats bw : inn.getBowlers()) {
                double score = (bw.getWickets() * 25.0) - (bw.getRunsConceded() * 0.5);
                if (score > maxScore) {
                    maxScore = score;
                    topPlayer = bw.getPlayerName() + " (" + bw.getWickets() + "/" + bw.getRunsConceded() + " in " + bw.getOvers() + " ov)";
                }
            }
        }
        match.setPlayerOfTheMatch(topPlayer);
    }

    private String formatDismissal(WicketType type, String bowlerName) {
        if (type == null) type = WicketType.BOWLED;
        switch (type) {
            case BOWLED: return "b " + bowlerName;
            case CAUGHT: return "c Sub b " + bowlerName;
            case LBW: return "lbw b " + bowlerName;
            case RUN_OUT: return "run out (Direct Hit)";
            case STUMPED: return "st Keeper b " + bowlerName;
            case HIT_WICKET: return "hit wicket b " + bowlerName;
            default: return "out b " + bowlerName;
        }
    }

    private String generateBallCommentary(int over, int ball, String bowler, String striker,
                                          int runs, boolean isWicket, WicketType wType, ExtraType extra) {
        String overPrefix = over + "." + ball + " | " + bowler + " to " + striker + ": ";
        if (isWicket) {
            return overPrefix + "OUT! WICKET! " + striker + " is dismissed! " + (wType != null ? wType.name() : "BOWLED") + "! Huge roar from the crowd!";
        }
        if (extra == ExtraType.WIDE) {
            return overPrefix + "WIDE BALL! Slipped down the leg side, umpire stretches both arms out.";
        }
        if (extra == ExtraType.NO_BALL) {
            return overPrefix + "NO BALL! Overstepping the popping crease! Free hit coming up!";
        }
        if (runs == 6) {
            return overPrefix + "SIX! BOOM! Picked up cleanly off the pads and dispatched deep into the stands! What a massive hit!";
        }
        if (runs == 4) {
            return overPrefix + "FOUR! Gorgeous shot! Pierces the infield with precision and races to the fence!";
        }
        if (runs == 2) {
            return overPrefix + "Two runs! Driven through the covers, excellent running between the wickets!";
        }
        if (runs == 1) {
            return overPrefix + "Single. Pushed into the gap at mid-on for a quick single, rotates the strike.";
        }
        return overPrefix + "Dot ball! Good length delivery right on target, solidly defended back to the bowler.";
    }

    public synchronized Match resetMatch(String matchId) {
        Match match = matches.get(matchId);
        if (match == null) throw new NoSuchElementException("Match not found: " + matchId);

        match.setSimulating(false);
        match.setStatus(MatchStatus.UPCOMING);
        match.setInnings(new ArrayList<>());
        match.setRecentBalls(new ArrayList<>());
        match.setCommentaryList(new ArrayList<>());
        match.setTarget(null);
        match.setWinnerTeamId(null);
        match.setWinnerTeamName(null);
        match.setWinMargin(null);
        match.setPlayerOfTheMatch(null);
        match.setCurrentInningsIndex(0);

        // Re-conduct toss to restart cleanly
        TossRequest tr = new TossRequest();
        tr.setTossWinnerId(match.getTeam1().getId());
        tr.setTossDecision(TossDecision.BAT);
        conductToss(matchId, tr);

        return match;
    }

    public void broadcastMatchUpdate(Match match) {
        try {
            messagingTemplate.convertAndSend("/topic/matches", match);
            messagingTemplate.convertAndSend("/topic/matches/" + match.getId(), match);
        } catch (Exception ignored) {
        }
        try {
            sseService.broadcastMatch(match);
        } catch (Exception ignored) {
        }
    }
}
