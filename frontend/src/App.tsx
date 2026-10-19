import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Match, Team } from './types/cricket';
import { cricketApi } from './services/api';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { MatchHero } from './components/MatchHero';
import { CommentaryTab } from './components/CommentaryTab';
import { ScorecardTab } from './components/ScorecardTab';
import { MatchInfoTab } from './components/MatchInfoTab';
import { LeaderboardView } from './components/LeaderboardView';
import { TeamsView } from './components/TeamsView';
import { MatchesListView } from './components/MatchesListView';
import { UmpireModal } from './components/UmpireModal';
import { CreateMatchModal } from './components/CreateMatchModal';
import { TossModal } from './components/TossModal';
import confetti from 'canvas-confetti';
import { MessageSquare, FileText, Info, ShieldCheck, Play, Pause, FastForward, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('match-ind-aus');
  const [currentView, setCurrentView] = useState<'live' | 'matches' | 'leaderboard' | 'teams' | 'umpire'>('live');
  const [matchTab, setMatchTab] = useState<'commentary' | 'scorecard' | 'info'>('commentary');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isStreamConnected, setIsStreamConnected] = useState(false);

  // Modals
  const [isUmpireModalOpen, setIsUmpireModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTossModalOpen, setIsTossModalOpen] = useState(false);

  // Keep track of completed matches for confetti celebration
  const completedCelebratedRef = useRef<Set<string>>(new Set());

  // Fetch all matches from backend
  const refreshMatches = useCallback(async () => {
    try {
      const data = await cricketApi.getMatches();
      setMatches(data);

      // Check if selected match completed
      const current = data.find((m) => m.id === selectedMatchId);
      if (current && current.status === 'COMPLETED' && !completedCelebratedRef.current.has(current.id)) {
        completedCelebratedRef.current.add(current.id);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error refreshing matches:', err);
    }
  }, [selectedMatchId]);

  // Initial load
  useEffect(() => {
    refreshMatches();
    cricketApi.getTeams().then(setTeams).catch(console.error);
  }, [refreshMatches]);

  // Real-time Server-Sent Events (SSE) Stream
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = cricketApi.subscribeLiveMatchStream((updatedMatch) => {
        setIsStreamConnected(true);
        setMatches((prevMatches) => {
          const index = prevMatches.findIndex((m) => m.id === updatedMatch.id);
          if (index !== -1) {
            const next = [...prevMatches];
            next[index] = updatedMatch;
            return next;
          }
          return [updatedMatch, ...prevMatches];
        });

        // Trigger victory celebration if match just concluded
        if (updatedMatch.status === 'COMPLETED' && !completedCelebratedRef.current.has(updatedMatch.id)) {
          completedCelebratedRef.current.add(updatedMatch.id);
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.55 }
          });
        }
      });
      setIsStreamConnected(true);
    } catch (e) {
      console.error('SSE failed to initialize:', e);
      setIsStreamConnected(false);
    }

    // Polling fallback to keep data 100% resilient
    const interval = setInterval(refreshMatches, 2500);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(interval);
    };
  }, [refreshMatches]);

  // Selected Match object
  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  // Simulation actions
  const handleToggleSimulation = async () => {
    if (!selectedMatch) return;
    try {
      const updated = await cricketApi.toggleSimulation(selectedMatch.id);
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStepSimulation = async () => {
    if (!selectedMatch) return;
    try {
      const updated = await cricketApi.stepSimulation(selectedMatch.id);
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpeedChange = async (speedMs: number) => {
    if (!selectedMatch) return;
    try {
      await cricketApi.setSimulationSpeed(selectedMatch.id, speedMs);
      refreshMatches();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetMatch = async () => {
    if (!selectedMatch) return;
    try {
      const updated = await cricketApi.resetMatch(selectedMatch.id);
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const liveMatches = matches.filter((m) => m.status === 'LIVE');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* App Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreateMatchClick={() => setIsCreateModalOpen(true)}
        isStreamConnected={isStreamConnected}
        liveMatchCount={liveMatches.length}
      />

      {/* Real-time Live Ticker */}
      <LiveTicker
        matches={matches}
        selectedMatchId={selectedMatch?.id || null}
        onSelectMatch={(id) => {
          setSelectedMatchId(id);
          setCurrentView('live');
        }}
      />

      {/* Main Container */}
      <main className="app-container" style={{ marginTop: '1.5rem', flex: 1 }}>
        {/* VIEW 1: LIVE MATCH CENTER */}
        {currentView === 'live' && (
          <div className="animate-fade-in">
            {selectedMatch ? (
              <>
                <MatchHero
                  match={selectedMatch}
                  onToggleSimulation={handleToggleSimulation}
                  onStepSimulation={handleStepSimulation}
                  onSpeedChange={handleSpeedChange}
                  onResetMatch={handleResetMatch}
                  onOpenUmpireModal={() => setIsUmpireModalOpen(true)}
                  onOpenTossModal={() => setIsTossModalOpen(true)}
                />

                {/* Match Tabs Bar */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '0.65rem'
                }}>
                  <button
                    onClick={() => setMatchTab('commentary')}
                    className={`btn ${matchTab === 'commentary' ? 'btn-active' : 'btn-glass'}`}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <MessageSquare size={16} />
                    Live Commentary ({selectedMatch.commentaryList?.length || 0})
                  </button>

                  <button
                    onClick={() => setMatchTab('scorecard')}
                    className={`btn ${matchTab === 'scorecard' ? 'btn-active' : 'btn-glass'}`}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <FileText size={16} />
                    Full Scorecard
                  </button>

                  <button
                    onClick={() => setMatchTab('info')}
                    className={`btn ${matchTab === 'info' ? 'btn-active' : 'btn-glass'}`}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <Info size={16} />
                    Match Info & Playing XI
                  </button>
                </div>

                {/* Sub Tab Content */}
                {matchTab === 'commentary' && (
                  <CommentaryTab commentaryList={selectedMatch.commentaryList || []} />
                )}

                {matchTab === 'scorecard' && (
                  <ScorecardTab innings={selectedMatch.innings || []} />
                )}

                {matchTab === 'info' && (
                  <MatchInfoTab match={selectedMatch} />
                )}
              </>
            ) : (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>No match selected.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: ALL MATCHES / FIXTURES */}
        {currentView === 'matches' && (
          <MatchesListView
            matches={matches}
            onSelectMatch={(id) => {
              setSelectedMatchId(id);
              setCurrentView('live');
            }}
            onCreateMatchClick={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* VIEW 3: TOURNAMENT LEADERBOARDS */}
        {currentView === 'leaderboard' && (
          <LeaderboardView />
        )}

        {/* VIEW 4: SQUADS & PLAYERS */}
        {currentView === 'teams' && (
          <TeamsView />
        )}

        {/* VIEW 5: UMPIRE CONSOLE */}
        {currentView === 'umpire' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-cyan)' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Umpire & Match Operations Desk</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Record live ball events, control automated simulation engines, and manage match state.
                  </p>
                </div>

                {/* Match Picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Active Match:</span>
                  <select
                    value={selectedMatchId}
                    onChange={(e) => setSelectedMatchId(e.target.value)}
                    style={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      color: '#fff',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  >
                    {matches.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedMatch && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsUmpireModalOpen(true)}
                    className="btn btn-primary"
                    disabled={selectedMatch.status !== 'LIVE'}
                  >
                    <ShieldCheck size={16} /> Open Ball Scoring Terminal
                  </button>

                  <button
                    onClick={handleToggleSimulation}
                    className={`btn ${selectedMatch.simulating ? 'btn-danger' : 'btn-emerald'}`}
                    disabled={selectedMatch.status !== 'LIVE'}
                  >
                    {selectedMatch.simulating ? <><Pause size={16} /> Pause Auto Simulation</> : <><Play size={16} fill="currentColor" /> Start Auto Simulation</>}
                  </button>

                  <button
                    onClick={handleStepSimulation}
                    className="btn btn-glass"
                    disabled={selectedMatch.status !== 'LIVE' || selectedMatch.simulating}
                  >
                    <FastForward size={16} /> Deliver Single Ball
                  </button>

                  <button
                    onClick={handleResetMatch}
                    className="btn btn-glass"
                    style={{ color: '#fb7185' }}
                  >
                    <RotateCcw size={16} /> Reset Match
                  </button>
                </div>
              )}
            </div>

            {selectedMatch && (
              <ScorecardTab innings={selectedMatch.innings || []} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 11, 20, 0.95)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>CricPulse Enterprise</strong> • Spring Boot 3.3.5 & TypeScript Live Cricket Management
          </div>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
            <span>⚡ Real-time SSE Engine</span>
            <span>📡 WebSocket STOMP Ready</span>
            <span>🏏 ICC Compliant Scoring Rules</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedMatch && (
        <>
          <UmpireModal
            match={selectedMatch}
            isOpen={isUmpireModalOpen}
            onClose={() => setIsUmpireModalOpen(false)}
            onBallRecorded={refreshMatches}
          />

          <TossModal
            match={selectedMatch}
            isOpen={isTossModalOpen}
            onClose={() => setIsTossModalOpen(false)}
            onTossCompleted={refreshMatches}
          />
        </>
      )}

      <CreateMatchModal
        teams={teams}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onMatchCreated={(newId) => {
          setSelectedMatchId(newId);
          setCurrentView('live');
          refreshMatches();
        }}
      />
    </div>
  );
};

export default App;
