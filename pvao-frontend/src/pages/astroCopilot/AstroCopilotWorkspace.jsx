import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Clock, Compass, Database, RefreshCw, Terminal, ChevronRight } from 'lucide-react';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import { useAstroCopilotStream } from '../../hooks/useAstroCopilotStream';
import { resolveResponse } from '../../utils/resolveResponse';
import ChatMessage from './ChatMessage';
import styles from './AstroCopilotWorkspace.module.css';

const SUGGESTED_QUERIES = [
  "Calculate orbital resonance and semi-major axis for Kepler-90h",
  "Explain SDO AIA 171 Å extreme UV coronal loops and magnetic reconnection",
  "Derive the redshift formula: $$z = \\frac{\\lambda_{\\text{obs}} - \\lambda_{\\text{emit}}}{\\lambda_{\\text{emit}}}$$",
  "What are the coordinates and visibility of the Crab Nebula (M1) tonight?"
];

const PAST_SESSIONS_PLACEHOLDER = [
  { id: '1', title: 'JWST NIRSpec Target 4432 Analysis', time: 'Today, 18:42', count: 12 },
  { id: '2', title: 'Lunar Tycho Crater Libration & Shadows', time: 'Yesterday, 21:15', count: 8 },
  { id: '3', title: 'Parker Solar Probe 24th Perihelion Ephemeris', time: 'Aug 23, 2026', count: 15 },
  { id: '4', title: 'TRAPPIST-1 System Habitable Zone Radii', time: 'Aug 21, 2026', count: 19 },
  { id: '5', title: 'Solar Cycle 25 Sunspot Flare Classification', time: 'Aug 19, 2026', count: 6 }
];

const AstroCopilotWorkspace = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '### Welcome to Astro-Copilot Workspace\n\nDeep-space telemetry copilot active. Ask questions about celestial mechanics, spectral observations, coordinate tracking, or enter astrophysical equations (e.g., $$\\mathcal{L} = 4\\pi R^2 \\sigma T^4$$).'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [pendingQuery, setPendingQuery] = useState('');
  const [pendingAiId, setPendingAiId] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState('1');

  const { status, streamedText, error } = useAstroCopilotStream(
    pendingQuery,
    'You are Astro-Copilot, a careful astrophysics assistant.',
    resolveResponse
  );
  const isLoading = status === 'streaming';

  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!pendingAiId) return;

    setMessages(prev =>
      prev.map(msg =>
        msg.id === pendingAiId
          ? {
              ...msg,
              text:
                status === 'error'
                  ? (error || 'Astro-Copilot central API is unreachable. Please verify the service is running and try again.')
                  : streamedText || msg.text,
              error: status === 'error',
              isStreaming: status === 'streaming'
            }
          : msg
      )
    );

    if (status === 'success' || status === 'error') {
      setPendingAiId(null);
      setPendingQuery('');
    }
  }, [status, streamedText, error, pendingAiId]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsgId = Date.now();
    const aiMsgId = userMsgId + 1;

    setMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: query },
      { id: aiMsgId, sender: 'bot', text: '', isStreaming: true, error: false }
    ]);
    setPendingAiId(aiMsgId);
    setPendingQuery(query);
    setInputQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setPendingAiId(null);
    setPendingQuery('');
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Observation session reset. How can I assist with your astronomical calculations or sky telemetry?'
      }
    ]);
  };

  return (
    <div className={styles.workspaceWrapper}>
      {/* SIDEBAR (Left Panel, 20% width) */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitleGroup}>
            <Clock size={16} style={{ color: 'var(--brass, #c8893b)' }} />
            <h2 className={styles.sidebarTitle}>Observation History</h2>
          </div>
          <button 
            onClick={handleClearChat} 
            className={styles.newSessionBtn}
            title="Start new observation session"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Status Indicator */}
        <div className={styles.statusCard}>
          <div className={styles.statusLeft}>
            <span className={styles.pulseDot}></span>
            <span>Chat Interface</span>
          </div>
          <span className={styles.statusBadge}>READY</span>
        </div>

        {/* Sessions Placeholder List */}
        <div className={styles.sessionsList}>
          <div className={styles.sessionsLabel}>Recent Sessions</div>
          {PAST_SESSIONS_PLACEHOLDER.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`${styles.sessionItem} ${
                activeSessionId === session.id ? styles.sessionItemActive : ''
              }`}
            >
              <div className={styles.sessionTitleRow}>
                <span className={styles.sessionTitleText}>{session.title}</span>
                <ChevronRight size={12} style={{ opacity: 0.6, color: 'var(--brass, #c8893b)' }} />
              </div>
              <div className={styles.sessionMeta}>
                <span>{session.time}</span>
                <span>{session.count} msgs</span>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Nav Tools */}
        <div className={styles.sidebarFooter}>
          <Link to="/deep-sky-explorer" className={styles.quickLink}>
            <Database size={13} style={{ color: 'var(--brass, #c8893b)' }} />
            <span>MAST / SIMBAD Catalogs</span>
          </Link>
          <Link to="/zenith" className={styles.quickLink}>
            <Compass size={13} style={{ color: 'var(--brass, #c8893b)' }} />
            <span>Observer Zenith Sync</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CANVAS (Right Section, 80% width) */}
      <main className={styles.mainCanvas}>
        {/* Top Telemetry Header */}
        <header className={styles.canvasHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIconBadge}>
              <Sparkles size={18} />
            </div>
            <div className={styles.headerTitles}>
              <h1>Astro-Copilot Workspace</h1>
              <p>Astrophysics Intelligence Core &bull; Real-time Streaming</p>
            </div>
          </div>
          <div className={styles.modelBadge}>
            <Terminal size={12} style={{ color: 'var(--brass, #c8893b)' }} />
            <span>Gemini 3.8 Flash</span>
          </div>
        </header>

        {/* Scrolling Message Container */}
        <div className={styles.messagesContainer} ref={messagesContainerRef}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && !messages.some(m => m.isStreaming) && (
            <div className={styles.centerMaxWidth} style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(20, 27, 40, 0.9)',
                border: '1px solid rgba(200, 137, 59, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brass, #c8893b)'
              }}>
                <Bot size={18} />
              </div>
              <div style={{
                background: 'rgba(14, 19, 28, 0.85)',
                border: '1px solid rgba(138, 143, 152, 0.2)',
                padding: '0.75rem 1.25rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono, monospace)',
                color: '#9ca3af'
              }}>
                <Spin size="small" />
                <span>Connecting observatory telemetry stream...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Queries Chips (Shown when chat is new) */}
        {messages.length <= 2 && (
          <div className={styles.suggestionsRow}>
            {SUGGESTED_QUERIES.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                className={styles.chipBtn}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* INPUT AREA (Fixed at Bottom of Canvas) */}
        <div className={styles.inputContainer}>
          <div className={styles.inputCard}>
            <textarea
              ref={textareaRef}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Astro-Copilot about celestial mechanics, spectral observations, or enter LaTeX formulas..."
              rows={1}
              className={styles.chatTextarea}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuery.trim()}
              className={styles.sendBtn}
            >
              <span>Send</span>
              <Send size={13} />
            </button>
          </div>
          <div className={styles.inputFooterText}>
            Astro-Copilot can make mistakes. Verify important astronomical calculations and telemetry &bull; Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </main>
    </div>
  );
};

export default AstroCopilotWorkspace;
