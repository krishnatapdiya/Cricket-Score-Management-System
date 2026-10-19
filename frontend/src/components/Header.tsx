import React from 'react';
import { Activity, Plus, Trophy, Users, PlayCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentView: 'live' | 'matches' | 'leaderboard' | 'teams' | 'umpire';
  onViewChange: (view: 'live' | 'matches' | 'leaderboard' | 'teams' | 'umpire') => void;
  onCreateMatchClick: () => void;
  isStreamConnected: boolean;
  liveMatchCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onCreateMatchClick,
  isStreamConnected,
  liveMatchCount,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.875rem 1.5rem',
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div 
          onClick={() => onViewChange('live')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #00f0ff 0%, #0077ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
          }}>
            <Activity size={24} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>
                CRIC<span style={{ color: 'var(--accent-cyan)' }}>PULSE</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'rgba(0, 240, 255, 0.15)',
                color: 'var(--accent-cyan)',
                padding: '0.15rem 0.45rem',
                borderRadius: 4,
                border: '1px solid rgba(0, 240, 255, 0.3)'
              }}>
                PRO LIVE
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Real-time Cricket Intelligence & Scoring Platform
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.3rem', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => onViewChange('live')}
            className={`btn ${currentView === 'live' ? 'btn-active' : 'btn-glass'}`}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
          >
            <PlayCircle size={16} />
            Match Center
            {liveMatchCount > 0 && (
              <span style={{
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.1rem 0.4rem',
                borderRadius: 9999,
                marginLeft: '0.25rem',
              }}>
                {liveMatchCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onViewChange('matches')}
            className={`btn ${currentView === 'matches' ? 'btn-active' : 'btn-glass'}`}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
          >
            <Activity size={16} />
            Matches
          </button>

          <button
            onClick={() => onViewChange('leaderboard')}
            className={`btn ${currentView === 'leaderboard' ? 'btn-active' : 'btn-glass'}`}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
          >
            <Trophy size={16} />
            Leaderboard
          </button>

          <button
            onClick={() => onViewChange('teams')}
            className={`btn ${currentView === 'teams' ? 'btn-active' : 'btn-glass'}`}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
          >
            <Users size={16} />
            Squads
          </button>

          <button
            onClick={() => onViewChange('umpire')}
            className={`btn ${currentView === 'umpire' ? 'btn-active' : 'btn-glass'}`}
            style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
          >
            <ShieldCheck size={16} />
            Umpire Scorer
          </button>
        </nav>

        {/* Right Status & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Live Stream Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 9999,
            background: isStreamConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${isStreamConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: isStreamConnected ? '#34d399' : '#f87171'
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isStreamConnected ? '#10b981' : '#ef4444',
              display: 'inline-block'
            }} className={isStreamConnected ? 'live-pulse' : ''} />
            {isStreamConnected ? 'SSE LIVE STREAM' : 'OFFLINE'}
          </div>

          <button
            onClick={onCreateMatchClick}
            className="btn btn-primary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
          >
            <Plus size={16} strokeWidth={2.5} />
            New Match
          </button>
        </div>
      </div>
    </header>
  );
};
