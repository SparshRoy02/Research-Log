import React from 'react';
import { Clock, CheckCircle, Search, Sparkles, AlertCircle, FileText } from 'lucide-react';

export default function ResearchHistory({ history, activeId, onSelect, onNewResearch }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={14} className="text-green-400" style={{ color: 'var(--accent-green)' }} />;
      case 'searching':
        return <Search size={14} className="text-blue-400 animate-pulse" style={{ color: 'var(--accent-blue)' }} />;
      case 'synthesizing':
        return <Sparkles size={14} className="text-purple-400 animate-pulse" style={{ color: 'var(--accent-purple)' }} />;
      case 'failed':
        return <AlertCircle size={14} className="text-red-400" style={{ color: 'var(--accent-red)' }} />;
      default:
        return <Clock size={14} className="text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FileText size={22} className="brand-icon" style={{ color: 'var(--accent-purple)' }} />
        <h2>Research Log</h2>
      </div>

      <div style={{ padding: '0 16px 16px 16px', borderBottom: '1px solid var(--border-color)' }}>
        <button
          onClick={onNewResearch}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px' }}
        >
          + New Research
        </button>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No past research found.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              className={`history-item ${activeId === item._id ? 'active' : ''}`}
              onClick={() => onSelect(item)}
            >
              <h3>{item.topic}</h3>
              <div className="history-meta">
                <span>{formatDate(item.createdAt || item.updatedAt)}</span>
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
