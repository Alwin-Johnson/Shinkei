import { useState, useEffect } from 'react';

import HeroView from './components/HeroView';
import WorkspaceModal from './components/WorkspaceModal';
import GraphView from './components/GraphView';

// ─── View States: hero → workspace → graph ────────────────────────────
function App() {
  const [view, setView] = useState('hero'); // 'hero' | 'workspace' | 'graph'
  const [flow, setFlow] = useState(null);
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWaitingForRealtime, setIsWaitingForRealtime] = useState(false);
  const [isRealtimeSession, setIsRealtimeSession] = useState(false); // 👈 New state
  const [graphDirection, setGraphDirection] = useState('forward');
  const [graphSteps, setGraphSteps] = useState(10);

  const handleOpenWorkspace = () => setView('workspace');

  const handleClose = () => {
    setView('hero');
    setTimeout(() => {
      setFlow(null);
      setIsWaitingForRealtime(false);
      setIsRealtimeSession(false);
    }, 500);
  };

  const handleBackToWorkspace = () => {
    setView('workspace');
    setFlow(null);
    setTrace(null);
    setIsWaitingForRealtime(false);
    setIsRealtimeSession(false);
  };

  const handleAnalyzeAgain = async () => {
    setFlow(null);
    setTrace(null);
    setIsWaitingForRealtime(true); // Show waiting UI immediately

    try {
      await fetch('http://localhost:5000/api/shinkei/v1/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: graphDirection,
          depth: graphSteps
        }),
      });
      console.log('📡 Real-time session reset. Waiting for next interaction...');
    } catch (err) {
      console.error('Failed to reset real-time session:', err);
      setIsWaitingForRealtime(false); // Reset on error
    }
  };

  // ── Telemetry & Real-time Graph Listener ──
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/api/shinkei/v1/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'realtime_graph') {
          console.log('🎯 Received real-time graph from backend');
          setFlow(data.flow);
          setTrace(data.trace);
          setIsWaitingForRealtime(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to parse SSE event in App.jsx", err);
      }
    };

    return () => eventSource.close();
  }, []);

  // This function now talks to your actual backend
 const handleAnalyze = async (url, fnText, direction = 'forward', steps = 10) => {
  setFlow(null);
  setTrace(null);
  setLoading(true);
  
  const realtime = !fnText;
  setIsWaitingForRealtime(realtime);
  setIsRealtimeSession(realtime); // 👈 Persist session mode
  
  setGraphDirection(direction);
  setGraphSteps(steps);

  try {
    const response = await fetch('http://localhost:5000/api/analyze', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repoUrl: url,
        entryFunction: fnText,
        direction: direction,
        depth: steps,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Analysis failed:', data.error);
      setFlow(null);
      setTrace(null);
      setLoading(false);
      setIsWaitingForRealtime(false);
      setIsRealtimeSession(false);
    } else {
      if (data.mode === 'static') {
        setFlow(data.flow);
        setTrace(data.trace);
        setLoading(false);
      } else {
        // Real-time mode: we stay in loading state until the graph is pushed via SSE
        console.log('📡 Waiting for real-time interaction...');
        setLoading(false); // Main request is done, now we just wait for SSE
      }
    }

  } catch (err) {
    console.error('Network error:', err);
    setFlow(null);
    setTrace(null);
    setLoading(false);
    setIsWaitingForRealtime(false);
    setIsRealtimeSession(false);
  } finally {
    setView('graph');
  }
};

  // Lock body scroll when workspace/graph is open
  useEffect(() => {
    if (view !== 'hero') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [view]);

  return (
    <>
      <HeroView isActive={view === 'hero'} onOpenWorkspace={handleOpenWorkspace} />
      <WorkspaceModal
        isOpen={view === 'workspace'}
        onClose={handleClose}
        onAnalyze={handleAnalyze}
        loading={loading}
      />
      <GraphView
        isOpen={view === 'graph'}
        flow={flow}
        trace={trace}
        loading={loading || isWaitingForRealtime}
        onBackToWorkspace={handleBackToWorkspace}
        onAnalyzeAgain={handleAnalyzeAgain}
        initialDirection={graphDirection}
        maxSteps={graphSteps}
        isRealtime={isRealtimeSession}
      />
    </>
  );
}

export default App;

