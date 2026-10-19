import React, { useState } from 'react';
import { Match, ExtraType, WicketType, BallInputDto } from '../types/cricket';
import { cricketApi } from '../services/api';
import { X, Send, AlertTriangle, ShieldCheck } from 'lucide-react';

interface UmpireModalProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onBallRecorded: () => void;
}

export const UmpireModal: React.FC<UmpireModalProps> = ({
  match,
  isOpen,
  onClose,
  onBallRecorded,
}) => {
  const [runs, setRuns] = useState<number>(0);
  const [extraType, setExtraType] = useState<ExtraType>('NONE');
  const [extraRuns, setExtraRuns] = useState<number>(0);
  const [isWicket, setIsWicket] = useState<boolean>(false);
  const [wicketType, setWicketType] = useState<WicketType>('BOWLED');
  const [customCommentary, setCustomCommentary] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentInnings = match.innings?.[match.currentInningsIndex];
  const striker = currentInnings?.batsmen?.find((b) => b.playerId === match.currentStrikerId);
  const bowler = currentInnings?.bowlers?.find((bw) => bw.playerId === match.currentBowlerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload: BallInputDto = {
        runs: runs,
        extraType: extraType,
        extraRuns: extraType !== 'NONE' ? Math.max(1, extraRuns || 1) : 0,
        isWicket: isWicket,
        wicketType: isWicket ? wicketType : undefined,
        commentary: customCommentary.trim() || undefined,
      };

      await cricketApi.recordBall(match.id, payload);
      onBallRecorded();

      // Reset form
      setRuns(0);
      setExtraType('NONE');
      setExtraRuns(0);
      setIsWicket(false);
      setCustomCommentary('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record ball delivery');
    } finally {
      setSubmitting(false);
    }
  };

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
        maxWidth: 540,
        width: '100%',
        padding: '1.75rem',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
      }}>
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(0, 240, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShieldCheck size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Umpire Scoring Console</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Bowler: <strong>{bowler?.playerName || 'Active Bowler'}</strong> ➔ Striker: <strong>{striker?.playerName || 'Active Striker'}</strong>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-glass" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.6rem 0.85rem',
            borderRadius: 8,
            marginBottom: '1rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={16} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Runs Scored */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Runs Scored off Bat:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
              {[0, 1, 2, 3, 4, 6].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setRuns(num)}
                  style={{
                    padding: '0.75rem 0',
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: runs === num ? 'linear-gradient(135deg, #00d2ff, #0077ff)' : 'rgba(255, 255, 255, 0.05)',
                    color: runs === num ? '#fff' : 'var(--text-main)',
                    border: runs === num ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    boxShadow: runs === num ? '0 0 16px rgba(0, 240, 255, 0.4)' : 'none',
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Extras Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Extras (Optional):
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(['NONE', 'WIDE', 'NO_BALL', 'BYE', 'LEG_BYE'] as ExtraType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => {
                    setExtraType(type);
                    if (type !== 'NONE' && extraRuns === 0) setExtraRuns(1);
                  }}
                  className={`btn ${extraType === type ? 'btn-active' : 'btn-glass'}`}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Wicket Section */}
          <div style={{
            background: isWicket ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.02)',
            border: isWicket ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
            borderRadius: 10,
            padding: '0.85rem',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 700, color: isWicket ? '#f87171' : 'var(--text-main)', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={isWicket}
                onChange={(e) => setIsWicket(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#ef4444', cursor: 'pointer' }}
              />
              WICKET on this delivery!
            </label>

            {isWicket && (
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(['BOWLED', 'CAUGHT', 'LBW', 'RUN_OUT', 'STUMPED', 'HIT_WICKET'] as WicketType[]).map((w) => (
                  <button
                    type="button"
                    key={w}
                    onClick={() => setWicketType(w)}
                    style={{
                      fontSize: '0.725rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 6,
                      cursor: 'pointer',
                      background: wicketType === w ? '#ef4444' : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      border: wicketType === w ? '1px solid #f87171' : '1px solid var(--border-subtle)',
                      fontWeight: 700
                    }}
                  >
                    {w.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Commentary Note */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Custom Commentary (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Smashed through extra cover with pure elegance!"
              value={customCommentary}
              onChange={(e) => setCustomCommentary(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '0.65rem 0.85rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex-between" style={{ marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-glass">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ minWidth: 140 }}>
              <Send size={15} />
              {submitting ? 'Recording...' : 'Record Ball'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
