import React from 'react';
import { Match } from '../types/cricket';
import { Radio } from 'lucide-react';

interface LiveTickerProps {
  matches: Match[];
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({
  matches,
  selectedMatchId,
  onSelectMatch,
}) => {
  if (!matches || matches.length === 0) return null;

  return (
    <div style={{
      background: 'rgba(10, 15, 29, 0.75)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.6rem 0',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '0 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--accent-cyan)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          paddingRight: '0.5rem',
          borderRight: '1px solid var(--border-subtle)'
        }}>
          <Radio size={14} className="live-pulse" color="#00f0ff" />
          MATCHES
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {matches.map((m) => {
            const isSelected = m.id === selectedMatchId;
            const currentInnings = m.innings && m.innings.length > 0 ? m.innings[m.currentInningsIndex] : null;

            return (
              <div
                key={m.id}
                onClick={() => onSelectMatch(m.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 10,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Status pill */}
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.4rem',
                  borderRadius: 4,
                  background: m.status === 'LIVE' ? 'rgba(239, 68, 68, 0.2)' : m.status === 'COMPLETED' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: m.status === 'LIVE' ? '#ef4444' : m.status === 'COMPLETED' ? '#94a3b8' : '#f59e0b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {m.status === 'LIVE' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} className="live-pulse" />}
                  {m.status}
                </span>

                {/* Teams & Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{
                      fontWeight: 700,
                      color: m.team1.id === currentInnings?.battingTeamId ? 'var(--accent-cyan)' : 'inherit'
                    }}>
                      {m.team1.shortName}
                    </span>
                    {m.innings?.[0]?.battingTeamId === m.team1.id && (
                      <span className="font-mono-numbers" style={{ fontWeight: 600, color: '#f1f5f9' }}>
                        {m.innings[0].runs}/{m.innings[0].wickets}
                      </span>
                    )}
                  </div>

                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>vs</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{
                      fontWeight: 700,
                      color: m.team2.id === currentInnings?.battingTeamId ? 'var(--accent-cyan)' : 'inherit'
                    }}>
                      {m.team2.shortName}
                    </span>
                    {m.innings?.[1]?.battingTeamId === m.team2.id ? (
                      <span className="font-mono-numbers" style={{ fontWeight: 600, color: '#f1f5f9' }}>
                        {m.innings[1].runs}/{m.innings[1].wickets}
                      </span>
                    ) : m.innings?.[0]?.battingTeamId === m.team2.id ? (
                      <span className="font-mono-numbers" style={{ fontWeight: 600, color: '#f1f5f9' }}>
                        {m.innings[0].runs}/{m.innings[0].wickets}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Live Over */}
                {m.status === 'LIVE' && currentInnings && (
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-cyan)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    ({currentInnings.oversFormatted} ov)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
