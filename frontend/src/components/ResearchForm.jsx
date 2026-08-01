import React, { useState } from 'react';
import { Sparkles, Loader2, Compass, Search, PenTool, CheckCircle } from 'lucide-react';

export default function ResearchForm({ onSubmit, loading, status, statusDetail, error }) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit(topic);
  };

  const getStepClass = (stepIndex) => {
    // Steps mapping:
    // 0: Planning (pending)
    // 1: Searching (searching)
    // 2: Synthesizing (synthesizing)
    // 3: Complete (completed)
    
    const statusMap = {
      'pending': 0,
      'searching': 1,
      'synthesizing': 2,
      'completed': 3,
      'failed': -1
    };
    
    const currentStep = statusMap[status] !== undefined ? statusMap[status] : -1;
    
    if (status === 'failed') return 'failed';
    if (currentStep > stepIndex) return 'completed';
    if (currentStep === stepIndex) return 'active';
    return '';
  };

  return (
    <div className="search-card">
      <h1>Initiate Deep Research</h1>
      <p>Enter a complex topic. Our agent will plan search queries, crawl reference sources, and synthesize a comprehensive markdown report using llama3.2:3b.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="search-input"
            placeholder="e.g., Post-quantum cryptography standards or Carbon capture technologies 2026..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="submit-btn" disabled={loading || !topic.trim()}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Research
              </>
            )}
          </button>
        </div>
      </form>

      {loading && (
        <div className="progress-container">
          <div className="progress-steps">
            <div className={`step-item ${getStepClass(0)}`}>
              <div className="step-icon-wrapper">
                <Compass size={16} />
              </div>
              <div className="step-label">Querying Plan</div>
            </div>
            <div className={`step-item ${getStepClass(1)}`}>
              <div className="step-icon-wrapper">
                <Search size={16} />
              </div>
              <div className="step-label">Web Search</div>
            </div>
            <div className={`step-item ${getStepClass(2)}`}>
              <div className="step-icon-wrapper">
                <PenTool size={16} />
              </div>
              <div className="step-label">Synthesizing</div>
            </div>
            <div className={`step-item ${getStepClass(3)}`}>
              <div className="step-icon-wrapper">
                <CheckCircle size={16} />
              </div>
              <div className="step-label">Complete</div>
            </div>
          </div>
          
          <div className="progress-details">
            <Loader2 size={14} className="animate-spin" />
            <span>
              {statusDetail || (
                status === 'searching' ? 'Searching DuckDuckGo and harvesting snippets...' :
                status === 'synthesizing' ? 'Synthesizing knowledge blocks with llama3.2:3b...' :
                'Agent is initializing the workspace...'
              )}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--accent-red)',
          borderRadius: '12px',
          color: '#fca5a5',
          fontSize: '14px'
        }}>
          <strong>Research Failed:</strong> {error}
        </div>
      )}
    </div>
  );
}
