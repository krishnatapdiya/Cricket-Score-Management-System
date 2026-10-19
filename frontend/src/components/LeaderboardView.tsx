import React, { useEffect, useState } from 'react';
import { LeaderboardStats, Player } from '../types/cricket';
import { cricketApi } from '../services/api';
import { Trophy, Flame, Shield, Award } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cricketApi.getLeaderboard()
      .then((data) => {
        setStats(data);
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
        Loading tournament statistics and leaderboards...
      </div>
    );
  }

  if (!stats) return null;

  const renderPlayerList = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    accentColor: string,
    players: Player[],
    valGetter: (p: Player) => string | number,
    secondaryGetter: (p: Player) => string
  ) => {
    return (
      <div className="glass-panel" style={{ padding: '1.25rem', flex: 1, minWidth: 300 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: `${accentColor}22`,
            border: `1px solid ${accentColor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>{title}</h3>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{subtitle}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {players.map((p, idx) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 10,
                background: idx === 0 ? `${accentColor}10` : 'rgba(255, 255, 255, 0.02)',
                border: idx === 0 ? `1px solid ${accentColor}40` : '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  background: idx === 0 ? accentColor : 'rgba(255, 255, 255, 0.08)',
                  color: idx === 0 ? '#000' : 'var(--text-muted)'
                }}>
                  {idx + 1}
                </span>

                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {p.teamName} • {p.role?.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="font-mono-numbers" style={{ fontSize: '1.15rem', fontWeight: 800, color: accentColor }}>
                  {valGetter(p)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {secondaryGetter(p)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex-between">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Tournament Leaderboards</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time player records, Orange & Purple caps, and tournament milestones.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Orange Cap (Most Runs) */}
        {renderPlayerList(
          'Orange Cap (Top Run Scorers)',
          'Leading run aggregate in the competition',
          <Trophy size={18} color="#f59e0b" />,
          '#f59e0b',
          stats.topRunScorers,
          (p) => `${p.careerStats.runs} Runs`,
          (p) => `Avg: ${p.careerStats.average} | SR: ${p.careerStats.strikeRate}`
        )}

        {/* Purple Cap (Most Wickets) */}
        {renderPlayerList(
          'Purple Cap (Top Wicket Takers)',
          'Leading wicket takers in the championship',
          <Award size={18} color="#a855f7" />,
          '#a855f7',
          stats.topWicketTakers,
          (p) => `${p.careerStats.wickets} Wkts`,
          (p) => `BBI: ${p.careerStats.bestBowling} | Eco: ${p.careerStats.economy}`
        )}

        {/* Strike Rate Kings */}
        {renderPlayerList(
          'Highest Strike Rates',
          'Fastest scorers (min. 500 career runs)',
          <Flame size={18} color="#00f0ff" />,
          '#00f0ff',
          stats.highestStrikeRates,
          (p) => `${p.careerStats.strikeRate}`,
          (p) => `${p.careerStats.runs} runs in ${p.careerStats.matches} matches`
        )}

        {/* Best Economy Bowlers */}
        {renderPlayerList(
          'Most Economical Bowlers',
          'Lowest runs conceded per over (min. 30 wickets)',
          <Shield size={18} color="#10b981" />,
          '#10b981',
          stats.bestEconomyRates,
          (p) => `${p.careerStats.economy} rpo`,
          (p) => `${p.careerStats.wickets} wickets (${p.careerStats.matches} inngs)`
        )}
      </div>
    </div>
  );
};
