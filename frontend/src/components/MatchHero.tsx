import React from 'react';
import { Match, BatsmanStats, BowlerStats } from '../types/cricket';
import { Play, Pause, FastForward, RotateCcw, Edit3, Award, Zap, Compass } from 'lucide-react';
import { BallTimeline } from './BallTimeline';

interface MatchHeroProps {
  match: Match;
  onToggleSimulation: () => void;
  onStepSimulation: () => void;
  onSpeedChange: (speedMs: number) => void;
  onResetMatch: () => void;
  onOpenUmpireModal: () => void;
  onOpenTossModal: () => void;
}

export const MatchHero: React.FC<MatchHeroProps> = ({
  match,
  onToggleSimulation,
  onStepSimulation,
  onSpeedChange,
  onResetMatch,
  onOpenUmpireModal,
  onOpenTossModal,
}) => {
  const currentInnings = match.innings && match.innings.length > 0
    ? match.innings[match.currentInningsIndex]
    : null;

  // Active batsmen
  const striker: BatsmanStats | undefined = currentInnings?.batsmen?.find(
    (b) => b.playerId === match.currentStrikerId
  );
  const nonStriker: BatsmanStats | undefined = currentInnings?.batsmen?.find(
    (b) => b.playerId === match.currentNonStrikerId
  );

  // Active bowler
  const bowler: BowlerStats | undefined = currentInnings?.bowlers?.find(
    (bw) => bw.playerId === match.currentBowlerId
  );

  // Required Run Rate & Target equation
  let equationText = '';
  if (match.status === 'LIVE' && match.currentInningsIndex === 1 && match.target && currentInnings) {
    const runsNeeded = Math.max(0, match.target - currentInnings.runs);
    const ballsRemaining = Math.max(0, match.maxOvers * 6 - currentInnings.legalBalls);
    const rrr = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0.00';
    equationText = `Need ${runsNeeded} runs in ${ballsRemaining} balls (RRR: ${rrr})`;
  }

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background stadium glow */}
      <div style={{
        position: 'absolute',
        top: -60,
        right: '25%',
        width: 320,
        height: 180,
        background: 'radial-gradient(ellipse, rgba(0, 240, 255, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Series & Venue Bar */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            {match.series} • {match.matchType} ({match.maxOvers} Overs)
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem', color: '#f8fafc' }}>
            {match.title}
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            📍 {match.venue}
          </div>
        </div>

        {/* Status & Toss badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {match.status === 'LIVE' ? (
              <span style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.25rem 0.65rem',
                borderRadius: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} className="live-pulse" />
                LIVE INNINGS {match.currentInningsIndex + 1}
              </span>
            ) : match.status === 'COMPLETED' ? (
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.25rem 0.65rem',
                borderRadius: 9999,
              }}>
                MATCH FINISHED
              </span>
            ) : (
              <span style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.25rem 0.65rem',
                borderRadius: 9999,
              }}>
                UPCOMING
              </span>
            )}

            {match.simulating && (
              <span style={{
                background: 'rgba(0, 240, 255, 0.15)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0, 240, 255, 0.35)',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.25rem 0.55rem',
                borderRadius: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}>
                <Zap size={13} color="#00f0ff" className="glow-active" />
                AUTO SIMULATION ACTIVE
              </span>
            )}
          </div>

          {match.tossWinnerName ? (
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              🪙 {match.tossWinnerName} won toss & elected to {match.tossDecision?.toLowerCase()}
            </span>
          ) : (
            <button
              onClick={onOpenTossModal}
              className="btn btn-glass"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            >
              <Compass size={13} />
              Conduct Toss
            </button>
          )}
        </div>
      </div>

      {/* Main Scoreboard Arena */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        alignItems: 'center',
        margin: '1rem 0 1.5rem',
      }}>
        {/* Team 1 Score Card */}
        <div className="glass-card" style={{
          padding: '1.25rem',
          borderLeft: `4px solid ${match.team1.primaryColor || '#3b82f6'}`,
          background: match.team1.id === currentInnings?.battingTeamId ? 'rgba(30, 58, 138, 0.2)' : 'rgba(15, 23, 42, 0.5)',
        }}>
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: match.team1.primaryColor || '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#fff',
                boxShadow: `0 0 16px ${match.team1.primaryColor || '#3b82f6'}55`
              }}>
                {match.team1.shortName}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{match.team1.name}</h3>
                {match.team1.id === currentInnings?.battingTeamId && (
                  <span style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    🏏 CURRENTLY BATTING
                  </span>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              {match.innings?.[0]?.battingTeamId === match.team1.id ? (
                <div>
                  <div className="font-mono-numbers" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                    {match.innings[0].runs}/{match.innings[0].wickets}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ({match.innings[0].oversFormatted} ov) • CRR: {match.innings[0].runRate}
                  </div>
                </div>
              ) : match.innings?.[1]?.battingTeamId === match.team1.id ? (
                <div>
                  <div className="font-mono-numbers" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                    {match.innings[1].runs}/{match.innings[1].wickets}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ({match.innings[1].oversFormatted} ov) • CRR: {match.innings[1].runRate}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '1.1rem', color: 'var(--text-dim)', fontWeight: 600 }}>Yet to bat</div>
              )}
            </div>
          </div>
        </div>

        {/* VS / Match Center Equation */}
        <div style={{ textAlign: 'center', padding: '0.5rem 1rem' }}>
          {match.status === 'COMPLETED' ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 12,
              padding: '0.85rem 1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                <Award size={18} />
                RESULT
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                {match.winnerTeamName} won by {match.winMargin}
              </div>
              {match.playerOfTheMatch && (
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
                  ⭐ Player of the Match: <strong style={{ color: 'var(--accent-amber)' }}>{match.playerOfTheMatch}</strong>
                </div>
              )}
            </div>
          ) : (
            <div>
              {equationText ? (
                <div style={{
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  padding: '0.6rem 1rem',
                  borderRadius: 10,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)'
                }}>
                  {equationText}
                </div>
              ) : currentInnings ? (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    1st Innings in Progress
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', marginTop: '0.25rem' }}>
                    Projected Score: <span className="font-mono-numbers" style={{ color: 'var(--accent-cyan)' }}>{Math.round(currentInnings.runRate * match.maxOvers)}</span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Match about to start
                </div>
              )}
            </div>
          )}
        </div>

        {/* Team 2 Score Card */}
        <div className="glass-card" style={{
          padding: '1.25rem',
          borderLeft: `4px solid ${match.team2.primaryColor || '#f59e0b'}`,
          background: match.team2.id === currentInnings?.battingTeamId ? 'rgba(180, 83, 9, 0.2)' : 'rgba(15, 23, 42, 0.5)',
        }}>
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: match.team2.primaryColor || '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#fff',
                boxShadow: `0 0 16px ${match.team2.primaryColor || '#f59e0b'}55`
              }}>
                {match.team2.shortName}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{match.team2.name}</h3>
                {match.team2.id === currentInnings?.battingTeamId && (
                  <span style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    🏏 CURRENTLY BATTING
                  </span>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              {match.innings?.[1]?.battingTeamId === match.team2.id ? (
                <div>
                  <div className="font-mono-numbers" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                    {match.innings[1].runs}/{match.innings[1].wickets}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ({match.innings[1].oversFormatted} ov) • CRR: {match.innings[1].runRate}
                  </div>
                </div>
              ) : match.innings?.[0]?.battingTeamId === match.team2.id ? (
                <div>
                  <div className="font-mono-numbers" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                    {match.innings[0].runs}/{match.innings[0].wickets}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ({match.innings[0].oversFormatted} ov) • CRR: {match.innings[0].runRate}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '1.1rem', color: 'var(--text-dim)', fontWeight: 600 }}>Yet to bat</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Batsmen & Bowler Section (if match is Live) */}
      {match.status === 'LIVE' && currentInnings && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          margin: '1.25rem 0',
        }}>
          {/* Batsmen Card */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Batting
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                R (B) • 4s • 6s • SR
              </span>
            </div>

            {/* Striker */}
            {striker && (
              <div className="flex-between" style={{
                padding: '0.45rem 0.6rem',
                borderRadius: 8,
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                marginBottom: '0.4rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--accent-amber)', fontSize: '0.85rem' }}>🏏</span>
                  <strong style={{ fontSize: '0.875rem', color: '#fff' }}>{striker.playerName} *</strong>
                </div>
                <div className="font-mono-numbers" style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--accent-cyan)' }}>{striker.runs}</span>
                  <span style={{ color: 'var(--text-muted)' }}> ({striker.balls})</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginLeft: '0.4rem' }}>
                    {striker.fours} • {striker.sixes} • {striker.strikeRate}
                  </span>
                </div>
              </div>
            )}

            {/* Non-Striker */}
            {nonStriker && (
              <div className="flex-between" style={{ padding: '0.45rem 0.6rem', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'transparent', fontSize: '0.85rem' }}>🏏</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{nonStriker.playerName}</span>
                </div>
                <div className="font-mono-numbers" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>{nonStriker.runs}</span>
                  <span style={{ color: 'var(--text-muted)' }}> ({nonStriker.balls})</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginLeft: '0.4rem' }}>
                    {nonStriker.fours} • {nonStriker.sixes} • {nonStriker.strikeRate}
                  </span>
                </div>
              </div>
            )}

            {/* Partnership */}
            <div style={{
              marginTop: '0.5rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>Current Partnership:</span>
              <strong className="font-mono-numbers" style={{ color: '#fff' }}>
                {currentInnings.currentPartnershipRuns} runs ({currentInnings.currentPartnershipBalls} balls)
              </strong>
            </div>
          </div>

          {/* Bowler Card */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Bowling
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                O • M • R • W • ECO
              </span>
            </div>

            {bowler && (
              <div className="flex-between" style={{
                padding: '0.45rem 0.6rem',
                borderRadius: 8,
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--accent-purple)', fontSize: '0.85rem' }}>⚾</span>
                  <strong style={{ fontSize: '0.875rem', color: '#fff' }}>{bowler.playerName} *</strong>
                </div>
                <div className="font-mono-numbers" style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                  <span style={{ color: '#fff' }}>{bowler.overs}</span>-
                  <span>{bowler.maidens}</span>-
                  <span>{bowler.runsConceded}</span>-
                  <span style={{ color: 'var(--accent-rose)' }}>{bowler.wickets}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                    {bowler.economyRate}
                  </span>
                </div>
              </div>
            )}

            {/* Extras in innings */}
            <div style={{
              marginTop: '0.75rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>Extras (Wd {currentInnings.wides}, Nb {currentInnings.noBalls}, B {currentInnings.byes}, Lb {currentInnings.legByes}):</span>
              <strong className="font-mono-numbers" style={{ color: '#fff' }}>{currentInnings.totalExtras}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Ball Timeline Ribbon */}
      <BallTimeline recentBalls={match.recentBalls} />

      {/* Live Simulation & Scoring Toolbar */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Left: Simulation Trigger & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {match.status === 'LIVE' && (
            <>
              <button
                onClick={onToggleSimulation}
                className={`btn ${match.simulating ? 'btn-danger' : 'btn-emerald'}`}
                style={{ minWidth: 140 }}
              >
                {match.simulating ? (
                  <>
                    <Pause size={16} /> Pause Auto
                  </>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" /> Simulate Live
                  </>
                )}
              </button>

              <button
                onClick={onStepSimulation}
                className="btn btn-glass"
                disabled={match.simulating}
                title="Deliver 1 ball immediately"
              >
                <FastForward size={16} />
                +1 Ball Step
              </button>

              {/* Speed selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Speed:</span>
                <select
                  value={match.simulationSpeedMs || 2000}
                  onChange={(e) => onSpeedChange(Number(e.target.value))}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value={800}>⚡ 0.8s Blitz</option>
                  <option value={1500}>🚀 1.5s Fast</option>
                  <option value={2000}>⏱️ 2.0s Standard</option>
                  <option value={3500}>📺 3.5s Broadcast</option>
                </select>
              </div>
            </>
          )}

          {match.status === 'UPCOMING' && (
            <button onClick={onOpenTossModal} className="btn btn-primary">
              <Compass size={16} /> Conduct Toss & Start Match
            </button>
          )}
        </div>

        {/* Right: Manual Umpire Scorer & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {match.status === 'LIVE' && (
            <button
              onClick={onOpenUmpireModal}
              className="btn btn-glass"
              style={{ borderColor: 'rgba(0, 240, 255, 0.3)', color: 'var(--accent-cyan)' }}
            >
              <Edit3 size={15} />
              Umpire Manual Scorer
            </button>
          )}

          <button
            onClick={onResetMatch}
            className="btn btn-glass"
            style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}
            title="Reset this match to fresh state"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
