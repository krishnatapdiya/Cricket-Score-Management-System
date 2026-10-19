# CricPulse - Scalable Real-time Cricket Score Management System

A high-performance, real-time cricket score management and simulation platform built with a **Spring Boot 3.3.5** backend (Java 21/26) and a responsive, sports-arena **TypeScript + React** frontend.

---

## 🌟 Key Features

### 1. Live Match Center & Real-time Scoring
- **Dynamic Scoreboard**: Displays live runs, wickets, overs (`12.4 ov`), current run rate (CRR), required run rate (RRR), projected score, target equation, and current partnership.
- **Active Batsmen & Bowler Cards**: Real-time on-strike batsman tracker with runs, balls, 4s, 6s, and strike rate. Current bowler stats with overs, maidens, runs conceded, wickets, and economy.
- **Ball-by-Ball Timeline Ribbon**: Visual delivery strip highlighting dot balls (`•`), singles (`1`), twos (`2`), boundaries (`4`), maximums (`6`), wickets (`W`), and extras (`Wd`, `Nb`).

### 2. Autonomous Match Simulator Engine
- Multi-threaded, non-blocking simulation engine running via `ScheduledExecutorService`.
- Contextual ball-by-ball probability algorithm (boundary probabilities, death overs momentum, extras, wicket variations).
- Thrilling commentary generator creating authentic match narratives for every ball.
- Simulation speed controls: **0.8s Blitz**, **1.5s Fast**, **2.0s Standard**, and **3.5s Broadcast**.
- Play, Pause, and Single-Step (`+1 Ball Step`) controls.

### 3. Detailed Match Scorecards & Squads
- **Batting Scorecard**: Dismissal details, runs, balls, boundaries, and strike rates.
- **Extras & Totals**: Wides, no-balls, byes, leg-byes, and total overs.
- **Bowling Scorecard**: Overs, maidens, runs conceded, wickets, economy rates, and extras.
- **Fall of Wickets**: Exact score, over, and dismissed batsman breakdown.
- **Playing XI & Squads**: International rosters (India, Australia, England, South Africa, Pakistan, New Zealand) with player roles and career statistics.

### 4. Tournament Leaderboards
- **Orange Cap**: Top run scorers with averages, strike rates, 50s, and 100s.
- **Purple Cap**: Top wicket takers with best bowling figures and economy rates.
- **Strike Rate Kings**: Highest strike rates in tournament history.
- **Economical Bowlers**: Tightest economy bowlers.

### 5. Dual Real-time Broadcasting (SSE & WebSockets)
- **Server-Sent Events (SSE)** at `/api/matches/stream` for immediate live push updates to browsers without client socket drops.
- **Spring WebSocket / STOMP Broker** at `/ws-cricket` publishing to `/topic/matches` and `/topic/matches/{id}`.

### 6. Umpire & Scorer Operations Console
- Interactive manual ball logger for umpires:
  - Runs off bat: `0`, `1`, `2`, `3`, `4`, `6`.
  - Extras: `None`, `Wide`, `No-Ball`, `Bye`, `Leg-Bye`.
  - Dismissals: `Bowled`, `Caught`, `LBW`, `Run Out`, `Stumped`, `Hit Wicket`.
  - Custom commentary notes.
- Match creation and interactive coin toss simulator.

---

## 🏛️ Project Architecture

```
c:\326\Cricket management\
├── backend/                               # Spring Boot 3.3.5 Application
│   ├── src/main/java/com/cricket/management/
│   │   ├── config/                        # CORS & WebSocket configuration
│   │   │   ├── CorsConfig.java
│   │   │   └── WebSocketConfig.java
│   │   ├── controller/                    # REST & SSE Controllers
│   │   │   ├── MatchController.java
│   │   │   ├── SimulationController.java
│   │   │   ├── PlayerController.java
│   │   │   └── SseController.java
│   │   ├── dto/                           # Data Transfer Objects
│   │   │   ├── BallInputDto.java
│   │   │   ├── CreateMatchRequest.java
│   │   │   ├── TossRequest.java
│   │   │   └── SimulationSpeedDto.java
│   │   ├── model/                         # Domain Entities & Cricket Enums
│   │   │   ├── Match.java
│   │   │   ├── InningsScore.java
│   │   │   ├── BatsmanStats.java
│   │   │   ├── BowlerStats.java
│   │   │   ├── BallEvent.java
│   │   │   ├── WicketDetail.java
│   │   │   ├── Player.java
│   │   │   ├── Team.java
│   │   │   └── LeaderboardStats.java
│   │   └── service/                       # Business Logic & Engines
│   │       ├── CricketDataService.java
│   │       ├── MatchService.java
│   │       ├── MatchSimulationService.java
│   │       └── SseService.java
│   └── pom.xml
│
└── frontend/                              # TypeScript + React Application
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx                 # Brand navigation & SSE status
    │   │   ├── LiveTicker.tsx             # Horizontal scores ticker
    │   │   ├── MatchHero.tsx              # Stadium scoreboard & simulation toolbar
    │   │   ├── BallTimeline.tsx           # Recent deliveries ribbon
    │   │   ├── CommentaryTab.tsx          # Filterable commentary stream
    │   │   ├── ScorecardTab.tsx           # Batting, bowling & fall of wickets tables
    │   │   ├── MatchInfoTab.tsx           # Venue, toss & Playing XI squads
    │   │   ├── MatchesListView.tsx        # Tournament fixtures & results
    │   │   ├── LeaderboardView.tsx        # Orange/Purple cap leaderboards
    │   │   ├── TeamsView.tsx              # Team squads and career stats
    │   │   ├── UmpireModal.tsx            # Manual ball scoring terminal
    │   │   ├── CreateMatchModal.tsx       # Custom fixture creator
    │   │   └── TossModal.tsx              # Coin flip & toss simulator
    │   ├── services/
    │   │   └── api.ts                     # REST client & SSE event source
    │   ├── types/
    │   │   └── cricket.ts                 # TypeScript interfaces
    │   ├── App.tsx                        # Master layout & state management
    │   └── index.css                      # Sports arena dark theme
    ├── package.json
    └── vite.config.ts
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/matches` | List matches (filter with `?status=LIVE\|COMPLETED\|UPCOMING`) |
| `GET` | `/api/matches/{id}` | Detailed match summary, scorecard, active players |
| `POST` | `/api/matches` | Create a new cricket match fixture |
| `POST` | `/api/matches/{id}/toss` | Conduct match toss and initialize lineups |
| `POST` | `/api/matches/{id}/ball` | Record ball event (runs, extras, wickets, commentary) |
| `POST` | `/api/matches/{id}/reset` | Reset match back to start |
| `GET` | `/api/matches/{id}/commentary` | Ball-by-ball commentary list |
| `GET` | `/api/matches/{id}/scorecard` | Detailed batting, bowling & fall of wickets |
| `POST` | `/api/matches/{id}/simulation/toggle` | Toggle auto live simulation |
| `POST` | `/api/matches/{id}/simulation/step` | Deliver exactly 1 ball simulation |
| `POST` | `/api/matches/{id}/simulation/speed` | Set simulation speed in milliseconds |
| `GET` | `/api/matches/stream` | Server-Sent Events (SSE) real-time stream |
| `GET` | `/api/teams` | List international teams and squad rosters |
| `GET` | `/api/players` | Directory of international players |
| `GET` | `/api/stats/leaderboard` | Tournament leaderboard (Orange/Purple caps) |

---

## 🚀 Running the Application

### 1. Spring Boot Backend
```bash
cd backend
mvnw.cmd spring-boot:run
```
Backend runs on **http://localhost:8080**.

### 2. TypeScript Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**.
Requests to `/api` and `/ws-cricket` are automatically proxied to the Spring Boot backend.
