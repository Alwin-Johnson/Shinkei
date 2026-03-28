import { useState } from 'react';

const DEMOS = [
  { label: 'Login flow',  url: 'https://github.com/example/app',    key: 'login',    fn: 'handleSubmit'   },
  { label: 'Checkout',    url: 'https://github.com/example/shop',   key: 'checkout', fn: 'handleCheckout' },
  { label: 'Search',      url: 'https://github.com/example/search', key: 'search',   fn: 'handleSearch'   },
];

export default function RepoInput({ onAnalyze, loading, analyzed }) {
  const [url, setUrl]       = useState('');
  const [fnText, setFnText] = useState('');
  const [error, setError]   = useState('');
  const [started, setStarted] = useState(false);

  const submit = (urlVal, fnVal, key) => {
    if (!urlVal.trim()) { setError('Please enter a GitHub repository URL.'); return; }
    if (!fnVal.trim())  { setError('Please enter a function or action to analyse.'); return; }
    setError('');
    onAnalyze(urlVal, fnVal, key);
  };

  const handleAnalyzeClick = () => {
    if (!started) {
      if (!url.trim()) { 
        setError('Please enter a GitHub repository URL.'); 
        return; 
      }
      setError('');
      setStarted(true);
    } else {
      submit(url, fnText);
    }
  };

  return (
    <div className="repo-input-wrap">

      {/* Repo URL */}
      <label className="field-label">Repository URL</label>
      <div className="input-row">
        <input
          type="text"
          className="repo-input"
          placeholder="https://github.com/username/repository"
          value={url}
          onChange={e => { setUrl(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleAnalyzeClick()}
        />
      </div>

      {started && (
        <>
          {/* Function / action */}
          <label className="field-label" style={{ marginTop: 14 }}>
            Function / Action to Analyse
          </label>
          <div className="input-row">
            <input
              type="text"
              className="repo-input"
              placeholder="e.g. handleSubmit"
              value={fnText}
              onChange={e => { setFnText(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAnalyzeClick()}
            />
          </div>
        </>
      )}

      {error && <p className="input-error">{error}</p>}

      <button
        className={`analyze-btn full-width ${loading ? 'loading' : ''}`}
        onClick={handleAnalyzeClick}
        disabled={loading}
        style={{ marginTop: 12 }}
      >
        {loading ? 'Parsing…' : (started ? 'Analyze Flow →' : 'Next')}
      </button>

      {loading && (
        <div className="parse-status">
          {['Parsing AST', 'Resolving imports', 'Tracing calls', 'Building graph'].map((t, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.2}s` }} className="parse-token">
              {t}{i < 3 ? ' →' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
