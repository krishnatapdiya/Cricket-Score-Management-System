import React, { useState } from 'react';
import { Match, MatchStatus } from '../types/cricket';
import { Radio, CheckCircle, Calendar, Play } from 'lucide-react';

interface MatchesListViewProps {
  matches: Match[];
  onSelectMatch: (matchId: string) => void;
  onCreateMatchClick: () => void;
}

export const MatchesListView: React.FC<MatchesListViewProps> = ({
  matches,
  onSelectMatch,
  onCreateMatchClick,
}) => {
  const [filter, setFilter] = useState<'ALL' | MatchStatus>('ALL');

  const filteredMatches = matches.filter((m) => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Tournament Fixtures & Results</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track live scoring, view completed match scorecards, and upcoming scheduled clashes.
          </p>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.3rem', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          {(['ALL', 'LIVE', 'COMPLETED', 'UPCOMING'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn ${filter === status ? 'btn-active' : 'btn-glass'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              {status === 'LIVE' && <Radio size={13} className="live-pulse" color="#ef4444" />}
              {status === 'COMPLETED' && <CheckCircle size={13} color="#10b981" />}
              {status === 'UPCOMING' && <Calendar size={13} color="#f59e0b" />}
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No matches found in this category.</p>
          <button onClick={onCreateMatchClick} className="btn btn-primary">
            Create New Match
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.25rem',
        }}>
          {filteredMatches.map((m) => {
            const inn1 = m.innings?.[0];
            const inn2 = m.innings?.[1];

            return (
              <div
                key={m.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderTop: m.status === 'LIVE' ? '3px solid #ef4444' : m.status === 'COMPLETED' ? '3px solid #10b981' : '3px solid #f59e0b',
                }}
              >
                {/* Header */}
                <div>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                      {m.series} • {m.matchType}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: 4,
                      background: m.status === 'LIVE' ? 'rgba(239, 68, 68, 0.2)' : m.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: m.status === 'LIVE' ? '#ef4444' : m.status === 'COMPLETED' ? '#10b981' : '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}>
                      {m.status === 'LIVE' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} className="live-pulse" />}
                      {m.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                    {m.title}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    📍 {m.venue}
                  </div>
                </div>

                {/* Teams & Scores */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 10,
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}>
                  {/* Team 1 */}
                  <div className="flex-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: m.team1.primaryColor || '#3b82f6',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.7rem'
                      }}>
                        {m.team1.shortName}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.team1.name}</span>
                    </div>

                    <div className="font-mono-numbers" style={{ fontSize: '1rem', fontWeight: 700 }}>
                      {inn1?.battingTeamId === m.team1.id ? (
                        <span>{inn1.runs}/{inn1.wickets} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({inn1.oversFormatted})</span></span>
                      ) : inn2?.battingTeamId === m.team1.id ? (
                        <span>{inn2.runs}/{inn2.wickets} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({inn2.oversFormatted})</span></span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Yet to bat</span>
                      )}
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: m.team2.primaryColor || '#f59e0b',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.7rem'
                      }}>
                        {m.team2.shortName}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.team2.name}</span>
                    </div>

                    <div className="font-mono-numbers" style={{ fontSize: '1rem', fontWeight: 700 }}>
                      {inn1?.battingTeamId === m.team2.id ? (
                        <span>{inn1.runs}/{inn1.wickets} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({inn1.oversFormatted})</span></span>
                      ) : inn2?.battingTeamId === m.team2.id ? (
                        <span>{inn2.runs}/{inn2.wickets} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({inn2.oversFormatted})</span></span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Yet to bat</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Status Note */}
                <div style={{ fontSize: '0.8rem', color: m.status === 'COMPLETED' ? '#34d399' : 'var(--text-muted)', fontWeight: 500 }}>
                  {m.status === 'COMPLETED' ? (
                    <span>🏆 {m.winnerTeamName} won by {m.winMargin}</span>
                  ) : m.status === 'LIVE' ? (
                    <span>⚡ Innings {m.currentInningsIndex + 1} underway</span>
                  ) : (
                    <span>📅 Match scheduled • Toss pending</span>
                  )}
                </div>

                {/* Action button */}
                <button
                  onClick={() => onSelectMatch(m.id)}
                  className="btn btn-glass"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Play size={14} /> Open in Match Center
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
