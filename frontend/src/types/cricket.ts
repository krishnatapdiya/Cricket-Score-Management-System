export type MatchStatus = 'UPCOMING' | 'LIVE' | 'INNINGS_BREAK' | 'COMPLETED';
export type MatchType = 'T20' | 'ODI' | 'TEST';
export type TossDecision = 'BAT' | 'BOWL';
export type PlayerRole = 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER';
export type ExtraType = 'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE';
export type WicketType = 'BOWLED' | 'CAUGHT' | 'LBW' | 'RUN_OUT' | 'STUMPED' | 'HIT_WICKET';

export interface CareerStats {
  matches: number;
  runs: number;
  highestScore: number;
  strikeRate: number;
  average: number;
  wickets: number;
  bestBowling: string;
  economy: number;
  fifties: number;
  hundreds: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  role: PlayerRole;
  battingStyle: string;
  bowlingStyle: string;
  avatarUrl: string;
  careerStats: CareerStats;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  flagCode: string;
  primaryColor: string;
  secondaryColor: string;
  players: Player[];
}

export interface BatsmanStats {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  out: boolean;
  dismissalInfo: string;
  battingOrder: number;
  onStrike: boolean;
}

export interface BowlerStats {
  playerId: string;
  playerName: string;
  legalBallsBowled: number;
  overs: string;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economyRate: number;
  wides: number;
  noBalls: number;
  currentBowler: boolean;
}

export interface WicketDetail {
  wicketNumber: number;
  runsAtWicket: number;
  oversFormatted: string;
  batsmanName: string;
  dismissalDescription: string;
}

export interface InningsScore {
  inningsNumber: number;
  battingTeamId: string;
  battingTeamName: string;
  bowlingTeamId: string;
  bowlingTeamName: string;
  runs: number;
  wickets: number;
  legalBalls: number;
  oversFormatted: string;
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  totalExtras: number;
  runRate: number;
  currentPartnershipRuns: number;
  currentPartnershipBalls: number;
  completed: boolean;
  batsmen: BatsmanStats[];
  bowlers: BowlerStats[];
  fallOfWickets: WicketDetail[];
}

export interface BallEvent {
  id: string;
  matchId: string;
  inningsNumber: number;
  overNumber: number;
  ballInOver: number;
  legalBall: boolean;
  strikerId?: string;
  strikerName?: string;
  nonStrikerId?: string;
  nonStrikerName?: string;
  bowlerId?: string;
  bowlerName?: string;
  runsScored: number;
  extraType: ExtraType;
  extraRuns: number;
  totalRunsOnBall: number;
  wicket: boolean;
  wicketType?: WicketType;
  dismissedPlayerId?: string;
  dismissedPlayerName?: string;
  commentary: string;
  timestamp: number;
}

export interface Match {
  id: string;
  title: string;
  series: string;
  venue: string;
  matchType: MatchType;
  maxOvers: number;
  status: MatchStatus;
  tossWinnerId?: string;
  tossWinnerName?: string;
  tossDecision?: TossDecision;
  team1: Team;
  team2: Team;
  battingFirstTeamId?: string;
  chasingTeamId?: string;
  currentInningsIndex: number;
  innings: InningsScore[];
  target?: number;
  winnerTeamId?: string;
  winnerTeamName?: string;
  winMargin?: string;
  playerOfTheMatch?: string;
  currentStrikerId?: string;
  currentNonStrikerId?: string;
  currentBowlerId?: string;
  simulating: boolean;
  simulationSpeedMs: number;
  recentBalls: BallEvent[];
  commentaryList: BallEvent[];
  createdAt: number;
  updatedAt: number;
  currentInnings?: InningsScore;
}

export interface LeaderboardStats {
  topRunScorers: Player[];
  topWicketTakers: Player[];
  highestStrikeRates: Player[];
  bestEconomyRates: Player[];
}

export interface BallInputDto {
  runs: number;
  extraType: ExtraType;
  extraRuns: number;
  isWicket: boolean;
  wicketType?: WicketType;
  dismissedPlayerId?: string;
  commentary?: string;
}

export interface CreateMatchRequest {
  title?: string;
  series?: string;
  venue?: string;
  matchType?: MatchType;
  maxOvers?: number;
  team1Id: string;
  team2Id: string;
}

export interface TossRequest {
  tossWinnerId: string;
  tossDecision: TossDecision;
}
