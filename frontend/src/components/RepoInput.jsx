import { useState } from 'react';
import { Link2, Code2, ArrowRight, Loader2, ChevronRight } from 'lucide-react';

function isValidGithubRepoUrl(rawUrl) {
  return Boolean(parseGithubRepoUrl(rawUrl));
}

function parseGithubRepoUrl(rawUrl) {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  let pathPart = '';
  const sshMatch = trimmed.match(/^git@github\.com:(.+)$/i);

  if (sshMatch) {
    pathPart = sshMatch[1];
  } else if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const hostname = parsed.hostname.toLowerCase();
      if (hostname !== 'github.com' && hostname !== 'www.github.com') {
        return null;
      }
      pathPart = parsed.pathname;
    } catch {
      return null;
    }
  } else {
    const withoutWww = trimmed.replace(/^www\./i, '');
    if (withoutWww.toLowerCase().startsWith('github.com/')) {
      pathPart = withoutWww.slice('github.com/'.length);
    } else {
      return null;
    }
  }

  const cleanPath = pathPart.split(/[?#]/)[0];
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/i, '');
  const segmentPattern = /^[A-Za-z0-9_.-]+$/;

  if (!owner || !repo || !segmentPattern.test(owner) || !segmentPattern.test(repo)) {
    return null;
  }

  return { owner, repo };
}

function normalizeGithubRepoUrl(rawUrl) {
  const parsed = parseGithubRepoUrl(rawUrl);
  if (!parsed) {
    return null;
  }

  return `https://github.com/${parsed.owner}/${parsed.repo}`;
}

// ── Animated step pipeline shown during loading ──
function LoadingPipeline() {
  const steps = ['Cloning repo', 'Parsing AST', 'Resolving imports', 'Building graph'];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '3px',
      marginTop: '16px',
      flexWrap: 'wrap',
    }}>
      {steps.map((step, i) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#94a3b8',
              opacity: 0.4,
              animation: `pulse 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.18)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 700,
              color: '#a78bfa',
              flexShrink: 0,
            }}>
              {i + 1}
            </span>
            {step}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight style={{
              width: 10,
              height: 10,
              color: 'rgba(139,92,246,0.2)',
              flexShrink: 0,
              margin: '0 1px',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function RepoInput({ onAnalyze, loading, analyzed }) {
  const [url, setUrl] = useState('');
  const [fnText, setFnText] = useState('');
  const [direction, setDirection] = useState('forward');
  const [steps, setSteps] = useState('10');
  const [urlError, setUrlError] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('static'); // 'static' | 'realtime' | 'editor'

  const validateUrl = (value) => {
    if (!value.trim()) {
      setUrlError('Enter a GitHub repository URL');
      return false;
    }

    if (!isValidGithubRepoUrl(value)) {
      setUrlError('Enter a valid GitHub repo URL (github.com/owner/repo)');
      return false;
    }

    setUrlError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateUrl(url)) {
      setError('');
      return;
    }
    if (!isRealtime && !fnText.trim()) { setError('Specify a function or action to trace'); return; }
    setError('');

    const finalDirection = mode === 'static' ? direction : 'forward';
    const stepsNum = mode === 'static' ? Math.max(1, Math.min(100, Number(steps) || 10)) : 10;

    const options = mode !== 'static' ? {
      frontendPort: 3000,
      backendPort: 8000,
      uiEditor: mode === 'editor'
    } : null;

    onAnalyze(url, isRealtime ? null : fnText, finalDirection, stepsNum, options);
  };

  return (
    <div className="repo-input-wrap">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#f8fafc',
          marginBottom: '8px',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          Configure Project
        </h3>
        <p style={{
          fontSize: '13px',
          color: 'rgba(148,163,184,0.55)',
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.6,
        }}>
          {mode === 'static' 
            ? 'Point to any GitHub repo and specify your entry function.'
            : mode === 'realtime'
              ? 'Connect to a running app and capture execution flows in real-time.'
              : 'Launch a project in interactive mode to edit UI components visually.'}
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{ marginBottom: 18 }}>
        <label className="field-label">Mode</label>
        <div className="direction-toggle" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', padding: '4px' }}>
          <button
            type="button"
            className={`direction-option ${mode === 'static' ? 'active' : ''}`}
            onClick={() => setMode('static')}
            style={{ fontSize: '11px', padding: '6px 2px' }}
          >
            Static
          </button>
          <button
            type="button"
            className={`direction-option ${mode === 'realtime' ? 'active' : ''}`}
            onClick={() => setMode('realtime')}
            style={{ fontSize: '11px', padding: '6px 2px' }}
          >
            Live Trace
          </button>
          <button
            type="button"
            className={`direction-option ${mode === 'editor' ? 'active' : ''}`}
            onClick={() => setMode('editor')}
            style={{ fontSize: '11px', padding: '6px 2px' }}
          >
            UI Editor
          </button>
        </div>
      </div>

      {/* Repo URL */}
      <label className="field-label">Repository</label>
      <div className={`input-row ${urlError ? 'input-row-invalid' : ''}`}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '12px',
          flexShrink: 0,
        }}>
          <Link2 style={{ width: 14, height: 14, color: '#64748b', opacity: 0.5 }} />
        </div>
        <input
          type="text"
          className="repo-input"
          placeholder="github.com/user/repo"
          value={url}
          onChange={e => {
            setUrl(e.target.value);
            setError('');
            if (urlError) {
              validateUrl(e.target.value);
            }
          }}
          onBlur={() => {
            if (url.trim()) {
              validateUrl(url);
            }
          }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ paddingLeft: '8px' }}
        />
      </div>

      {urlError && (
        <p className="input-error" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#f87171',
            flexShrink: 0,
          }} />
          {urlError}
        </p>
      )}

      {/* Static-only Fields */}
      {mode === 'static' && (
        <>
          <label className="field-label" style={{ marginTop: 14 }}>
            Entry Point
          </label>
          <div className="input-row">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '12px',
              flexShrink: 0,
            }}>
              <Code2 style={{ width: 14, height: 14, color: '#64748b', opacity: 0.5 }} />
            </div>
            <input
              type="text"
              className="repo-input"
              placeholder="handleSubmit, onClick, main…"
              value={fnText}
              onChange={e => { setFnText(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ paddingLeft: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: 16, alignItems: 'stretch' }}>
            {/* Direction toggle */}
            <div style={{ flex: '1 1 65%' }}>
              <label className="field-label">Direction</label>
              <div className="direction-toggle">
                <button
                  type="button"
                  className={`direction-option ${direction === 'forward' ? 'active' : ''}`}
                  onClick={() => setDirection('forward')}
                >
                  Forward →
                </button>
                <button
                  type="button"
                  className={`direction-option ${direction === 'backward' ? 'active' : ''}`}
                  onClick={() => setDirection('backward')}
                >
                  ← Backward
                </button>
              </div>
            </div>

            {/* Depth input */}
            <div style={{ flex: '0 0 90px', display: 'flex', flexDirection: 'column' }}>
              <label className="field-label">Depth</label>
              <div className="input-row" style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  className="repo-input"
                  placeholder="10"
                  value={steps}
                  onChange={e => setSteps(e.target.value.replace(/[^0-9]/g, ''))}
                  onBlur={() => {
                    const n = Math.max(1, Math.min(100, Number(steps) || 1));
                    setSteps(String(n));
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ textAlign: 'center', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {error && (
        <p className="input-error" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#f87171',
            flexShrink: 0,
          }} />
          {error}
        </p>
      )}

      {/* Visual divider */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.1), transparent)',
        marginTop: error ? '12px' : '24px',
      }} />

      <button
        className={`analyze-btn full-width ${loading ? 'loading' : ''}`}
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: 16 }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <span style={{
              width: 16,
              height: 16,
              border: '2px solid rgba(255,255,255,0.12)',
              borderTopColor: 'rgba(255,255,255,0.5)',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'sk-orbit 0.7s linear infinite',
            }} />
            Analyzing…
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            {mode === 'static' ? 'Trace Execution' : mode === 'realtime' ? 'Start Live Session' : 'Launch UI Editor'}
            <ArrowRight style={{ width: 15, height: 15, opacity: 0.8 }} />
          </span>
        )}
      </button>

      {loading && <LoadingPipeline />}
    </div>
  );
}
