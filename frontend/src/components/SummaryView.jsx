import { useState } from 'react';
import { Sparkles, Send, ArrowRight } from 'lucide-react';

export default function SummaryView({ summary, typing, accentColor }) {
  const [chatText, setChatText] = useState('');
  const [chatFocused, setChatFocused] = useState(false);
  
  const ac = accentColor || '#8B7FE8';
  
  // Resolve the purpose text — handle string, object, or missing
  const purposeText = typeof summary?.purpose === 'string'
    ? summary.purpose
    : typeof summary?.purpose === 'object' && summary?.purpose !== null
      ? JSON.stringify(summary.purpose)
      : '';

  // Show typing animation text if available, otherwise show full purpose text directly
  const displayText = (typing && typing.length > 0) ? typing : purposeText;
  const isStillTyping = typing != null && typing.length < purposeText.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    setChatText('');
  };

  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '20px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    }}>
      {/* ── Purpose ── */}
      <div style={{
        background: 'rgba(139,92,246,0.07)',
        border: '1px solid rgba(139,92,246,0.15)',
        borderRadius: 14,
        padding: '18px 20px',
        position: 'relative',
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${ac}50, transparent)`,
          borderRadius: '0 0 2px 2px',
        }} />

        <div style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: ac,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <Sparkles style={{ width: 12, height: 12 }} />
          Purpose
        </div>

        {displayText ? (
          <div style={{
            fontSize: 14,
            color: '#f1f5f9',
            lineHeight: 1.75,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            wordBreak: 'break-word',
          }}>
            {displayText}
            {isStillTyping && (
              <span style={{
                display: 'inline-block',
                width: 2,
                height: 16,
                background: ac,
                marginLeft: 2,
                animation: 'cursor-blink 0.8s step-end infinite',
                verticalAlign: 'text-bottom',
              }} />
            )}
          </div>
        ) : (
          <div style={{
            fontSize: 13,
            color: '#64748b',
            fontStyle: 'italic',
            fontFamily: "'Inter', sans-serif",
          }}>
            Generating summary…
          </div>
        )}
      </div>

      {/* ── Key Details ── */}
      {summary?.details && summary.details.length > 0 && (
        <div>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#64748b',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <ArrowRight style={{ width: 10, height: 10, opacity: 0.6 }} />
            Key Details
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {summary.details.map((d, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontSize: 13,
                color: '#c8d0dc',
                lineHeight: 1.6,
                fontFamily: "'Inter', sans-serif",
                padding: '10px 12px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.05)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
              }}
              >
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: `${ac}12`,
                  border: `1px solid ${ac}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: ac,
                  flexShrink: 0,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1 }}>{typeof d === 'string' ? d : JSON.stringify(d)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Calls ── */}
      {summary?.calls && summary.calls.length > 0 && (
        <div>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#64748b',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            ↗ Functions Called
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {summary.calls.map((c, i) => (
              <span key={i} style={{
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                color: '#c4b5fd',
                background: 'rgba(139,92,246,0.06)',
                border: '1px solid rgba(139,92,246,0.12)',
                borderRadius: 8,
                padding: '4px 12px',
                fontWeight: 500,
                transition: 'all 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.12)';
              }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Chat ── */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingTop: 12,
          borderTop: '1px solid rgba(139,92,246,0.08)',
        }}
      >
        <div style={{
          flex: 1,
          position: 'relative',
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: chatFocused ? '0 0 0 3px rgba(139,92,246,0.08), 0 0 16px rgba(139,92,246,0.05)' : 'none',
        }}>
          <input
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            onFocus={() => setChatFocused(true)}
            onBlur={() => setChatFocused(false)}
            placeholder="Ask about this code..."
            style={{
              width: '100%',
              height: 38,
              borderRadius: 12,
              border: `1px solid ${chatFocused ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.12)'}`,
              background: 'rgba(15,23,42,0.55)',
              color: '#e2e8f0',
              fontSize: 12,
              padding: '0 12px',
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              transition: 'border-color 0.3s',
            }}
          />
        </div>
        <button
          type="submit"
          aria-label="Send message"
          disabled={!chatText.trim()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            border: `1px solid ${chatText.trim() ? 'rgba(139,92,246,0.3)' : 'rgba(51,65,85,0.3)'}`,
            background: chatText.trim() ? 'rgba(139,92,246,0.15)' : 'rgba(51,65,85,0.25)',
            color: chatText.trim() ? '#c4b5fd' : '#64748b',
            display: 'grid',
            placeItems: 'center',
            cursor: chatText.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (chatText.trim()) {
              e.currentTarget.style.background = 'rgba(139,92,246,0.25)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = chatText.trim() ? 'rgba(139,92,246,0.15)' : 'rgba(51,65,85,0.25)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Send style={{ width: 14, height: 14 }} />
        </button>
      </form>

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
