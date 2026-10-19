import {
  Match,
  MatchStatus,
  LeaderboardStats,
  Team,
  Player,
  CreateMatchRequest,
  TossRequest,
  BallInputDto,
  BallEvent,
  InningsScore
} from '../types/cricket';

const API_BASE = '/api';

export const cricketApi = {
  // Matches
  async getMatches(status?: MatchStatus): Promise<Match[]> {
    const url = status ? `${API_BASE}/matches?status=${status}` : `${API_BASE}/matches`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
  },

  async getMatchById(id: string): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch match ${id}`);
    return res.json();
  },

  async createMatch(req: CreateMatchRequest): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error('Failed to create match');
    return res.json();
  },

  async conductToss(matchId: string, req: TossRequest): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/toss`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error('Failed to conduct toss');
    return res.json();
  },

  async recordBall(matchId: string, input: BallInputDto): Promise<BallEvent> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/ball`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error('Failed to record ball');
    return res.json();
  },

  async resetMatch(matchId: string): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset match');
    return res.json();
  },

  async getScorecard(matchId: string): Promise<InningsScore[]> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/scorecard`);
    if (!res.ok) throw new Error('Failed to fetch scorecard');
    return res.json();
  },

  async getCommentary(matchId: string): Promise<BallEvent[]> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/commentary`);
    if (!res.ok) throw new Error('Failed to fetch commentary');
    return res.json();
  },

  // Simulation controls
  async toggleSimulation(matchId: string): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/simulation/toggle`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to toggle simulation');
    return res.json();
  },

  async stepSimulation(matchId: string): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/simulation/step`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to step simulation');
    return res.json();
  },

  async setSimulationSpeed(matchId: string, speedMs: number): Promise<void> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/simulation/speed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speedMs })
    });
    if (!res.ok) throw new Error('Failed to update speed');
  },

  // Teams & Players
  async getTeams(): Promise<Team[]> {
    const res = await fetch(`${API_BASE}/teams`);
    if (!res.ok) throw new Error('Failed to fetch teams');
    return res.json();
  },

  async getPlayers(): Promise<Player[]> {
    const res = await fetch(`${API_BASE}/players`);
    if (!res.ok) throw new Error('Failed to fetch players');
    return res.json();
  },

  async getLeaderboard(): Promise<LeaderboardStats> {
    const res = await fetch(`${API_BASE}/stats/leaderboard`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
  },

  // Server-Sent Events subscriber
  subscribeLiveMatchStream(onMatchUpdate: (match: Match) => void): () => void {
    const eventSource = new EventSource(`${API_BASE}/matches/stream`);

    eventSource.addEventListener('MATCH_UPDATE', (e) => {
      try {
        const matchData = JSON.parse(e.data) as Match;
        onMatchUpdate(matchData);
      } catch (err) {
        console.error('Error parsing SSE match update:', err);
      }
    });

    eventSource.onerror = () => {
      // Browser EventSource automatically attempts reconnection
    };

    return () => {
      eventSource.close();
    };
  }
};
