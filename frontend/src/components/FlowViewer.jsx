import { useEffect, useState } from 'react';
import FlowStep from './FlowStep';
import FlowGraph from './FlowGraph';
import Legend from './Legend';

export default function FlowViewer({ flowData, graphData, loading, onTabChange }) {
  const [visible, setVisible]     = useState(false);
  const [activeTab, setActiveTab] = useState('flow');

  useEffect(() => {
    if (flowData) {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 80);
      return () => clearTimeout(t);
    }
  }, [flowData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  if (loading) return null;

  if (!flowData || flowData.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⬡</div>
        <p className="empty-label">No execution flow loaded yet</p>
      </div>
    );
  }

  return (
    <div className="flow-viewer">
      <div className="tab-bar">
        {['flow', 'graph'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'flow' && (
        <>
          <Legend />
          <div className="step-list">
            {flowData.map((step, i) => (
              <FlowStep
                key={i}
                step={step}
                index={i}
                isLast={i === flowData.length - 1}
                visible={visible}
              />
            ))}
          </div>
        </>
      )}

      {activeTab === 'graph' && (
        <FlowGraph flowData={graphData} visible={visible} />
      )}
    </div>
  );
}