import React, { useState } from 'react';
import { Match, TossDecision, TossRequest } from '../types/cricket';
import { cricketApi } from '../services/api';
import { X, Compass, CheckCircle } from 'lucide-react';

interface TossModalProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onTossCompleted: () => void;
}

export const TossModal: React.FC<TossModalProps> = ({
  match,
  isOpen,
  onClose,
  onTossCompleted,
}) => {
  const [winnerId, setWinnerId] = useState(match?.team1?.id || '');
  const [decision, setDecision] = useState<TossDecision>('BAT');
  const [submitting, setSubmitting] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  if (!isOpen || !match) return null;

  const handleRandomFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const pickTeam = Math.random() > 0.5 ? match.team1.id : match.team2.id;
      const pickDecision: TossDecision = Math.random() > 0.5 ? 'BAT' : 'BOWL';
      setWinnerId(pickTeam);
      setDecision(pickDecision);
      setIsFlipping(false);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: TossRequest = {
        tossWinnerId: winnerId,
        tossDecision: decision,
      };
      await cricketApi.conductToss(match.id, payload);
      onTossCompleted();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const winnerTeam = winnerId === match.team1.id ? match.team1 : match.team2;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
    }}>
      <div className="glass-panel" style={{
        maxWidth: 480,
        width: '100%',
        padding: '1.75rem',
        border: '1px solid rgba(245, 158, 11, 0.4)',
      }}>
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Compass size={20} color="var(--accent-amber)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Official Match Toss</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {match.team1.name} vs {match.team2.name}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-glass" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Coin flip button */}
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <button
            type="button"
            onClick={handleRandomFlip}
            disabled={isFlipping}
            className="btn btn-glass"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 9999,
              borderColor: 'rgba(245, 158, 11, 0.5)',
              color: 'var(--accent-amber)',
              fontWeight: 700,
              fontSize: '0.9rem',
              animation: isFlipping ? 'pulse-dot 0.6s infinite' : 'none',
            }}
          >
            🪙 {isFlipping ? 'Flipping Coin in the Air...' : 'Flip Official Toss Coin'}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Winner Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Toss Winner:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setWinnerId(match.team1.id)}
                className={`btn ${winnerId === match.team1.id ? 'btn-active' : 'btn-glass'}`}
                style={{ padding: '0.75rem', justifyContent: 'center' }}
              >
                {match.team1.name}
              </button>
              <button
                type="button"
                onClick={() => setWinnerId(match.team2.id)}
                className={`btn ${winnerId === match.team2.id ? 'btn-active' : 'btn-glass'}`}
                style={{ padding: '0.75rem', justifyContent: 'center' }}
              >
                {match.team2.name}
              </button>
            </div>
          </div>

          {/* Decision */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Elected Decision:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDecision('BAT')}
                className={`btn ${decision === 'BAT' ? 'btn-active' : 'btn-glass'}`}
                style={{ padding: '0.75rem', justifyContent: 'center' }}
              >
                🏏 Bat First
              </button>
              <button
                type="button"
                onClick={() => setDecision('BOWL')}
                className={`btn ${decision === 'BOWL' ? 'btn-active' : 'btn-glass'}`}
                style={{ padding: '0.75rem', justifyContent: 'center' }}
              >
                ⚾ Bowl First
              </button>
            </div>
          </div>

          {/* Summary Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            textAlign: 'center',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Match Result Announcement:</span>
            <div style={{ fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
              {winnerTeam?.name} has won the toss and elected to {decision.toLowerCase()} first!
            </div>
          </div>

          {/* Actions */}
          <div className="flex-between" style={{ marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-glass">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-emerald" style={{ minWidth: 150 }}>
              <CheckCircle size={16} />
              {submitting ? 'Starting...' : 'Confirm & Start Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
