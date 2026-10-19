import React, { useState } from 'react';
import { Team, MatchType, CreateMatchRequest } from '../types/cricket';
import { cricketApi } from '../services/api';
import { X, Plus, Trophy } from 'lucide-react';

interface CreateMatchModalProps {
  teams: Team[];
  isOpen: boolean;
  onClose: () => void;
  onMatchCreated: (matchId: string) => void;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  teams,
  isOpen,
  onClose,
  onMatchCreated,
}) => {
  const [team1Id, setTeam1Id] = useState(teams[0]?.id || '');
  const [team2Id, setTeam2Id] = useState(teams[1]?.id || '');
  const [title, setTitle] = useState('');
  const [series, setSeries] = useState('World Cricket League 2026');
  const [venue, setVenue] = useState('Lord\'s Cricket Ground, London');
  const [matchType, setMatchType] = useState<MatchType>('T20');
  const [overs, setOvers] = useState<number>(20);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTypeChange = (type: MatchType) => {
    setMatchType(type);
    if (type === 'T20') setOvers(20);
    else if (type === 'ODI') setOvers(50);
    else setOvers(90);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (team1Id === team2Id) {
      setErrorMsg('Please select two distinct teams for the match.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const t1 = teams.find((t) => t.id === team1Id);
      const t2 = teams.find((t) => t.id === team2Id);

      const payload: CreateMatchRequest = {
        title: title.trim() || `${t1?.name} vs ${t2?.name}`,
        series: series.trim() || 'International Championship',
        venue: venue.trim() || 'International Cricket Stadium',
        matchType: matchType,
        maxOvers: overs,
        team1Id: team1Id,
        team2Id: team2Id,
      };

      const newMatch = await cricketApi.createMatch(payload);
      onMatchCreated(newMatch.id);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create match');
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
        maxWidth: 520,
        width: '100%',
        padding: '1.75rem',
        border: '1px solid var(--border-active)',
      }}>
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #00d2ff, #0077ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Trophy size={18} color="#000" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Create New Cricket Fixture</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Configure participating teams and match format
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
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Teams Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Team 1:
              </label>
              <select
                value={team1Id}
                onChange={(e) => setTeam1Id(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '0.6rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Team 2:
              </label>
              <select
                value={team2Id}
                onChange={(e) => setTeam2Id(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '0.6rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Format & Overs */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Match Format:
              </label>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {(['T20', 'ODI', 'TEST'] as MatchType[]).map((fmt) => (
                  <button
                    type="button"
                    key={fmt}
                    onClick={() => handleTypeChange(fmt)}
                    className={`btn ${matchType === fmt ? 'btn-active' : 'btn-glass'}`}
                    style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Overs:
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={overs}
                onChange={(e) => setOvers(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '0.55rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  textAlign: 'center',
                  fontWeight: 700,
                }}
              />
            </div>
          </div>

          {/* Title & Series */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Match Title (Optional):
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grand Finale 2026 / Super 8 Clash"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '0.6rem 0.85rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Series Name:
            </label>
            <input
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              placeholder="e.g. ICC World T20 Championship"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '0.6rem 0.85rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Stadium Venue:
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Melbourne Cricket Ground"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '0.6rem 0.85rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Submit */}
          <div className="flex-between" style={{ marginTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-glass">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ minWidth: 140 }}>
              <Plus size={16} />
              {submitting ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
