import React, { useState } from 'react';
import { InningsScore } from '../types/cricket';

interface ScorecardTabProps {
  innings: InningsScore[];
}

export const ScorecardTab: React.FC<ScorecardTabProps> = ({ innings }) => {
  const [selectedInningsIdx, setSelectedInningsIdx] = useState(0);

  if (!innings || innings.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No scorecard available yet. Innings has not started.
      </div>
    );
  }

  const currentInnings = innings[selectedInningsIdx] || innings[0];

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      {/* Innings Switcher */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
        {innings.map((inn, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedInningsIdx(idx)}
            className={`btn ${selectedInningsIdx === idx ? 'btn-active' : 'btn-glass'}`}
            style={{ fontSize: '0.85rem' }}
          >
            {inn.battingTeamName} {inn.runs}/{inn.wickets} ({inn.oversFormatted} ov)
          </button>
        ))}
      </div>

      {/* Batting Scorecard Table */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', marginBottom: '0.85rem' }}>
          Batting • {currentInnings.battingTeamName}
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.6rem 0.5rem' }}>Batter</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Dismissal</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>R</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>B</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>4s</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>6s</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>SR</th>
              </tr>
            </thead>
            <tbody>
              {currentInnings.batsmen?.map((b) => (
                <tr key={b.playerId} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.7rem 0.5rem', fontWeight: 700, color: '#f8fafc' }}>
                    {b.playerName} {!b.out && <span style={{ color: 'var(--accent-amber)' }}>*</span>}
                  </td>
                  <td style={{ padding: '0.7rem 0.5rem', color: b.out ? 'var(--text-muted)' : 'var(--accent-cyan)', fontSize: '0.8rem' }}>
                    {b.dismissalInfo}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                    {b.runs}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                    {b.balls}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: 'var(--accent-amber)' }}>
                    {b.fours}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: 'var(--accent-purple)' }}>
                    {b.sixes}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: 'var(--accent-cyan)' }}>
                    {b.strikeRate.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extras & Total summary */}
        <div style={{
          marginTop: '1rem',
          padding: '0.85rem 1rem',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Extras: </span>
            <strong className="font-mono-numbers" style={{ color: '#fff' }}>{currentInnings.totalExtras}</strong>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.775rem', marginLeft: '0.5rem' }}>
              (b {currentInnings.byes}, lb {currentInnings.legByes}, w {currentInnings.wides}, nb {currentInnings.noBalls})
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)' }}>Total: </span>
            <strong className="font-mono-numbers" style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)' }}>
              {currentInnings.runs}/{currentInnings.wickets}
            </strong>
            <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
              ({currentInnings.oversFormatted} Ov, CRR: {currentInnings.runRate})
            </span>
          </div>
        </div>
      </div>

      {/* Bowling Scorecard Table */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-purple)', marginBottom: '0.85rem' }}>
          Bowling • {currentInnings.bowlingTeamName}
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.6rem 0.5rem' }}>Bowler</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>O</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>M</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>R</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>W</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>ECON</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>WD</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>NB</th>
              </tr>
            </thead>
            <tbody>
              {currentInnings.bowlers?.map((bw) => (
                <tr key={bw.playerId} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.7rem 0.5rem', fontWeight: 700, color: '#f8fafc' }}>
                    {bw.playerName} {bw.currentBowler && <span style={{ color: 'var(--accent-purple)' }}>*</span>}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: '#fff' }}>
                    {bw.overs}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                    {bw.maidens}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: '#fff' }}>
                    {bw.runsConceded}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', fontWeight: 800, color: 'var(--accent-rose)' }}>
                    {bw.wickets}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: 'var(--accent-cyan)' }}>
                    {bw.economyRate.toFixed(2)}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: 'var(--text-dim)' }}>
                    {bw.wides}
                  </td>
                  <td className="font-mono-numbers" style={{ padding: '0.7rem 0.5rem', textAlign: 'right', color: 'var(--text-dim)' }}>
                    {bw.noBalls}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      {currentInnings.fallOfWickets && currentInnings.fallOfWickets.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-rose)', marginBottom: '0.85rem' }}>
            Fall of Wickets
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {currentInnings.fallOfWickets.map((w) => (
              <div
                key={w.wicketNumber}
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 8,
                  fontSize: '0.785rem',
                }}
              >
                <strong style={{ color: '#f87171' }}>{w.wicketNumber}-{w.runsAtWicket}</strong>
                <span style={{ color: '#e2e8f0', marginLeft: '0.35rem' }}>({w.batsmanName}, {w.oversFormatted} ov)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
