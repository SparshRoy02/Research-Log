import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, ExternalLink, Globe, FileText } from 'lucide-react';

export default function ReportViewer({ research }) {
  const [copied, setCopied] = useState(false);

  if (!research) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(research.report || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="report-card">
      <div className="report-header">
        <div className="report-title-area">
          <h2>{research.topic}</h2>
          <div className="report-stats">
            <div className="stat-item">
              <FileText size={14} />
              <span>{getWordCount(research.report)} words</span>
            </div>
            <div className="stat-item">
              <Globe size={14} />
              <span>{research.sources?.length || 0} sources crawled</span>
            </div>
          </div>
        </div>
        <div className="action-buttons">
          <button onClick={handleCopy} className="btn-secondary">
            {copied ? (
              <>
                <Check size={14} className="text-green-400" /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy MD
              </>
            )}
          </button>
        </div>
      </div>

      <div className="markdown-content">
        {research.report ? (
          <ReactMarkdown>{research.report}</ReactMarkdown>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No report content available.
          </div>
        )}
      </div>

      {research.sources && research.sources.length > 0 && (
        <div className="sources-section">
          <h3>Crawled Reference Material</h3>
          <div className="sources-grid">
            {research.sources.map((source, index) => (
              <div key={index} className="source-card">
                <h4>{source.title}</h4>
                <p>{source.snippet}</p>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  <span>Visit Source</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
