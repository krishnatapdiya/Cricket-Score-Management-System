import React from 'react';
import { BallEvent } from '../types/cricket';

interface BallTimelineProps {
  recentBalls: BallEvent[];
}

export const BallTimeline: React.FC<BallTimelineProps> = ({ recentBalls }) => {
  if (!recentBalls || recentBalls.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      padding: '0.65rem 1rem',
      background: 'rgba(15, 23, 42, 0.45)',
      borderRadius: 12,
      border: '1px solid var(--border-subtle)',
      overflowX: 'auto',
    }}>
      <span style={{
        fontSize: '0.725rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem'
      }}>
        Recent Deliveries:
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'nowrap' }}>
        {recentBalls.map((b, idx) => {
          let label = `${b.runsScored}`;
          let pillClass = 'ball-run';

          if (b.wicket) {
            label = 'W';
            pillClass = 'ball-wicket';
          } else if (b.extraType === 'WIDE') {
            label = `Wd${b.totalRunsOnBall > 1 ? '+' + (b.totalRunsOnBall - 1) : ''}`;
            pillClass = 'ball-extra';
          } else if (b.extraType === 'NO_BALL') {
            label = `Nb${b.runsScored > 0 ? '+' + b.runsScored : ''}`;
            pillClass = 'ball-extra';
          } else if (b.runsScored === 0) {
            label = '•';
            pillClass = 'ball-dot';
          } else if (b.runsScored === 4) {
            label = '4';
            pillClass = 'ball-four';
          } else if (b.runsScored === 6) {
            label = '6';
            pillClass = 'ball-six';
          }

          return (
            <div
              key={b.id || idx}
              className={`ball-pill ${pillClass}`}
              title={b.commentary || `${b.bowlerName || 'Bowler'} to ${b.strikerName || 'Striker'}: ${label}`}
              style={{
                width: label.length > 2 ? 38 : 30,
                height: 30,
                fontSize: label.length > 2 ? '0.7rem' : '0.8rem',
                cursor: 'help'
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
