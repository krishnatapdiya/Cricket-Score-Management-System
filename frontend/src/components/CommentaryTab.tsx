import React, { useState } from 'react';
import { BallEvent } from '../types/cricket';
import { MessageSquare, Flame, AlertCircle } from 'lucide-react';

interface CommentaryTabProps {
  commentaryList: BallEvent[];
}

export const CommentaryTab: React.FC<CommentaryTabProps> = ({ commentaryList }) => {
  const [filter, setFilter] = useState<'all' | 'boundaries' | 'wickets'>('all');

  const filteredList = commentaryList.filter((item) => {
    if (filter === 'boundaries') return item.runsScored === 4 || item.runsScored === 6;
    if (filter === 'wickets') return item.wicket;
    return true;
  });

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      {/* Filter toolbar */}
      <div className="flex-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Ball-by-Ball Live Commentary</h3>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-active' : 'btn-glass'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            All Balls
          </button>
          <button
            onClick={() => setFilter('boundaries')}
            className={`btn ${filter === 'boundaries' ? 'btn-active' : 'btn-glass'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            <Flame size={13} color="#f59e0b" />
            Boundaries
          </button>
          <button
            onClick={() => setFilter('wickets')}
            className={`btn ${filter === 'wickets' ? 'btn-active' : 'btn-glass'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            <AlertCircle size={13} color="#f43f5e" />
            Wickets
          </button>
        </div>
      </div>

      {/* Commentary Stream */}
      {filteredList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
          No commentary entries match this filter yet. Start the live simulation to see live action!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredList.map((ball) => {
            const isFour = ball.runsScored === 4;
            const isSix = ball.runsScored === 6;
            const isWicket = ball.wicket;
            const isExtra = ball.extraType !== 'NONE';

            return (
              <div
                key={ball.id}
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 10,
                  background: isWicket
                    ? 'rgba(239, 68, 68, 0.08)'
                    : isSix
                    ? 'rgba(168, 85, 247, 0.08)'
                    : isFour
                    ? 'rgba(245, 158, 11, 0.08)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isWicket
                    ? '1px solid rgba(239, 68, 68, 0.3)'
                    : isSix
                    ? '1px solid rgba(168, 85, 247, 0.3)'
                    : isFour
                    ? '1px solid rgba(245, 158, 11, 0.3)'
                    : '1px solid var(--border-subtle)',
                }}
              >
                {/* Over & Result Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44 }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.825rem',
                    fontFamily: 'var(--font-mono)',
                    background: isWicket
                      ? 'rgba(239, 68, 68, 0.3)'
                      : isSix
                      ? 'rgba(168, 85, 247, 0.3)'
                      : isFour
                      ? 'rgba(245, 158, 11, 0.3)'
                      : isExtra
                      ? 'rgba(16, 185, 129, 0.3)'
                      : ball.runsScored === 0
                      ? 'rgba(100, 116, 139, 0.25)'
                      : 'rgba(0, 240, 255, 0.2)',
                    color: isWicket
                      ? '#f87171'
                      : isSix
                      ? '#c084fc'
                      : isFour
                      ? '#fbbf24'
                      : isExtra
                      ? '#6ee7b7'
                      : ball.runsScored === 0
                      ? '#94a3b8'
                      : '#38bdf8',
                    border: `1px solid ${
                      isWicket ? '#f87171' : isSix ? '#c084fc' : isFour ? '#fbbf24' : 'rgba(255,255,255,0.1)'
                    }`,
                  }}>
                    {isWicket ? 'W' : isExtra ? (ball.extraType === 'WIDE' ? 'Wd' : 'Nb') : ball.runsScored}
                  </div>
                </div>

                {/* Commentary Narrative */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', color: '#f1f5f9', lineHeight: 1.5 }}>
                    {ball.commentary}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                    Innings {ball.inningsNumber || 1} • {new Date(ball.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
