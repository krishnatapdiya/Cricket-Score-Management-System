import React from 'react';
import { Match, Player } from '../types/cricket';
import { MapPin, Calendar, Compass, Shield } from 'lucide-react';

interface MatchInfoTabProps {
  match: Match;
}

export const MatchInfoTab: React.FC<MatchInfoTabProps> = ({ match }) => {
  const renderPlayerList = (players: Player[], teamName: string, teamColor: string) => {
    return (
      <div className="glass-card" style={{ padding: '1.25rem', flex: 1, minWidth: 280 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: teamColor }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
            {teamName} Playing XI
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {players?.map((p, idx) => (
            <div
              key={p.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', width: 18, fontWeight: 700 }}>
                  {idx + 1}
                </span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>{p.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {p.battingStyle} • {p.bowlingStyle}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.4rem',
                  borderRadius: 4,
                  background: p.role === 'BATSMAN' ? 'rgba(56, 189, 248, 0.15)' :
                              p.role === 'BOWLER' ? 'rgba(244, 63, 94, 0.15)' :
                              p.role === 'ALL_ROUNDER' ? 'rgba(168, 85, 247, 0.15)' :
                              'rgba(245, 158, 11, 0.15)',
                  color: p.role === 'BATSMAN' ? '#38bdf8' :
                         p.role === 'BOWLER' ? '#fb7185' :
                         p.role === 'ALL_ROUNDER' ? '#c084fc' :
                         '#fbbf24',
                }}>
                  {p.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Match Details Grid */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
          Match Information
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar size={18} color="var(--accent-cyan)" />
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Series</div>
              <div style={{ fontWeight: 600 }}>{match.series}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin size={18} color="#ef4444" />
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Venue</div>
              <div style={{ fontWeight: 600 }}>{match.venue}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={18} color="#10b981" />
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Format</div>
              <div style={{ fontWeight: 600 }}>{match.matchType} ({match.maxOvers} Overs per side)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Compass size={18} color="var(--accent-amber)" />
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Toss</div>
              <div style={{ fontWeight: 600 }}>
                {match.tossWinnerName ? `${match.tossWinnerName} chose to ${match.tossDecision?.toLowerCase()}` : 'Toss not conducted yet'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Playing XI Lineups */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {renderPlayerList(match.team1.players, match.team1.name, match.team1.primaryColor || '#3b82f6')}
        {renderPlayerList(match.team2.players, match.team2.name, match.team2.primaryColor || '#f59e0b')}
      </div>
    </div>
  );
};
