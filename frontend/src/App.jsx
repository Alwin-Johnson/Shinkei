import { useState } from 'react';
import RepoInput from './components/RepoInput';
import FlowViewer from './components/FlowViewer';
import StatsBar from './components/StatsBar';



function App() {
  const [flow, setFlow] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // This function now talks to your actual backend
  const handleAnalyze = async (url, fnText) => {
    setFlow(null);
    setStats(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          repoUrl: url, 
          entryFunction: fnText 
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 1. Take the 'flow' part of the response (Numeric IDs & Edges)
        setFlow(data.flow);
        }else {
        alert(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

const handleFetchCode = async (nodeLabel) => {
    if (!nodeLabel) return;
    
    setSelectedNodeCode(null);
    setCodeLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/code?function=${encodeURIComponent(nodeLabel)}`);
      const data = await response.json();

      if (data.success) {
        // data contains: { code, file, line, label }
        setSelectedNodeCode(data);
      } else {
        console.warn("Code not found:", data.error);
      }
    } catch (error) {
      console.error("Code Fetch Error:", error);
    } finally {
      setCodeLoading(false);
    }
  };
  return (
    <div className="app-shell">
      <div className="orb orb-purple" />
      <div className="orb orb-blue" />
      <div className="orb orb-green" />
      <div className="grid-overlay" />

      <div className="content-wrap">
        <header className="app-header">
          <div className="badge">⬡ Static AST Analysis Engine</div>
          <h1 className="app-title">
            <span className="title-accent">SHINKEI</span>
          </h1>
          <p className="app-kanji">神経 / Tree Call Graph Visualizer</p>
          <p className="app-subtitle">
            Trace every execution path from your entry function to all reachable calls.
            Zero runtime overhead.
          </p>
        </header>

        <main className="app-main">
          <RepoInput onAnalyze={handleAnalyze} loading={loading} analyzed={analyzed} />
          {flow && !loading && <StatsBar flow={flow.nodes} />}
        </main>
      </div>

      {(flow || loading) && (
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          width: '100%',
          padding: '0 24px',
        }}>
          <FlowViewer
            flowData={flow ? flow.nodes : null}
            graphData={flow}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}

export default App;
