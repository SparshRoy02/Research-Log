import React, { useState, useEffect } from 'react';
import ResearchHistory from './components/ResearchHistory';
import ResearchForm from './components/ResearchForm';
import ReportViewer from './components/ReportViewer';
import { Sparkles, Terminal, BookOpen } from 'lucide-react';

export default function App() {
  const [history, setHistory] = useState([]);
  const [activeResearch, setActiveResearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [statusDetail, setStatusDetail] = useState('');
  const [error, setError] = useState(null);

  // Load research log history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/research');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to load history list:', err);
    }
  };

  const handleStartResearch = async (topic) => {
    setLoading(true);
    setError(null);
    setStatus('pending');
    setStatusDetail('Planning queries and structuring investigation routes...');
    setActiveResearch(null);

    // Set up incremental visual feedback
    const timers = [];
    timers.push(setTimeout(() => {
      setStatus('searching');
      setStatusDetail('Querying DuckDuckGo HTML indices for latest reference sheets...');
    }, 3000));
    
    timers.push(setTimeout(() => {
      setStatus('synthesizing');
      setStatusDetail('Generating markdown report using local Ollama (llama3.2:3b)...');
    }, 9000));

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      timers.forEach(clearTimeout);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API responded with an error');
      }

      const completedRecord = await response.json();
      setStatus('completed');
      setActiveResearch(completedRecord);
      fetchHistory();
    } catch (err) {
      timers.forEach(clearTimeout);
      setError(err.message);
      setStatus('failed');
    } finally {
      setLoading(false);
      setStatusDetail('');
    }
  };

  const handleSelectHistory = (record) => {
    setActiveResearch(record);
    setError(null);
  };

  const handleNewResearch = () => {
    setActiveResearch(null);
    setError(null);
    setStatus('idle');
  };

  return (
    <div className="app-container">
      <ResearchHistory
        history={history}
        activeId={activeResearch?._id}
        onSelect={handleSelectHistory}
        onNewResearch={handleNewResearch}
      />

      <main className="workspace">
        <header className="workspace-header">
          <div className="brand">
            <Sparkles className="brand-icon" size={28} />
            <span className="brand-logo-text">DEEP RESEARCH AGENT</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Terminal size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Ollama: llama3.2:3b</span>
          </div>
        </header>

        <ResearchForm
          onSubmit={handleStartResearch}
          loading={loading}
          status={status}
          statusDetail={statusDetail}
          error={error}
        />

        {activeResearch ? (
          <ReportViewer research={activeResearch} />
        ) : (
          !loading && (
            <div className="empty-state">
              <BookOpen size={48} className="empty-state-icon" />
              <h3>No Research Selected</h3>
              <p>Start a new search query above or select an existing item from the Research Log to view details.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
