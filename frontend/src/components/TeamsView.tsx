import React, { useEffect, useState } from 'react';
import { Team, Player } from '../types/cricket';
import { cricketApi } from '../services/api';

export const TeamsView: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cricketApi.getTeams()
      .then((data) => {
        setTeams(data);
        if (data.length > 0) {
          setSelectedTeamId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        Loading squads and rosters...
      </div>
    );
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex-between">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Participating Teams & Squads</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Official rosters, player specializations, and career statistics.
          </p>
        </div>
      </div>

      {/* Team Selection Tabs */}
      <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {teams.map((t) => {
          const isSelected = t.id === selectedTeamId;
          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTeamId(t.id);
                setSelectedPlayer(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 12,
                cursor: 'pointer',
                background: isSelected ? `${t.primaryColor}25` : 'rgba(15, 23, 42, 0.6)',
                border: isSelected ? `2px solid ${t.primaryColor}` : '1px solid var(--border-subtle)',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: t.primaryColor || '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#fff',
              }}>
                {t.shortName}
              </div>
              {t.name}
              <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.35rem', borderRadius: 4 }}>
                {t.players?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Squad Grid & Player Detail Drawer */}
      {selectedTeam && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {selectedTeam.players?.map((p) => {
            const isSelected = selectedPlayer?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlayer(p)}
                className="glass-panel"
                style={{
                  padding: '1.15rem',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(0, 240, 255, 0.08)' : 'rgba(15, 23, 42, 0.7)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{p.name}</h4>
                    <span style={{
                      fontSize: '0.675rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 4,
                      background: p.role === 'BATSMAN' ? 'rgba(56, 189, 248, 0.15)' :
                                  p.role === 'BOWLER' ? 'rgba(244, 63, 94, 0.15)' :
                                  p.role === 'ALL_ROUNDER' ? 'rgba(168, 85, 247, 0.15)' :
                                  'rgba(245, 158, 11, 0.15)',
                      color: p.role === 'BATSMAN' ? '#38bdf8' :
                             p.role === 'BOWLER' ? '#fb7185' :
                             p.role === 'ALL_ROUNDER' ? '#c084fc' :
                             '#fbbf24',
                      display: 'inline-block',
                      marginTop: '0.25rem'
                    }}>
                      {p.role?.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                    <div>{p.battingStyle}</div>
                    <div>{p.bowlingStyle}</div>
                  </div>
                </div>

                {/* Career Quick Stats */}
                {p.careerStats && (
                  <div style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    textAlign: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                  }}>
                    <div>
                      <div style={{ color: 'var(--text-dim)' }}>Mat</div>
                      <div className="font-mono-numbers" style={{ fontWeight: 700, color: '#fff' }}>{p.careerStats.matches}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-dim)' }}>Runs</div>
                      <div className="font-mono-numbers" style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{p.careerStats.runs}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-dim)' }}>SR</div>
                      <div className="font-mono-numbers" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{p.careerStats.strikeRate}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-dim)' }}>Wkts</div>
                      <div className="font-mono-numbers" style={{ fontWeight: 700, color: 'var(--accent-rose)' }}>{p.careerStats.wickets}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
