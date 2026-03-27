import { useEffect, useRef, useState } from 'react';
import { STEP_TYPES } from '../constants/stepTypes';

const NODE_W  = 200;
const NODE_H  = 54;
const COL_GAP = 80;   // horizontal gap between columns
const ROW_GAP = 24;   // vertical gap between nodes in same column

// Assign nodes to columns: frontend → api → backend → response
function layoutNodes(steps) {
  const colOrder = { event: 0, function: 1, api: 2, route: 3, response: 4 };

  // Group into columns
  const cols = {};
  steps.forEach((s, i) => {
    const col = colOrder[s.type] ?? 1;
    if (!cols[col]) cols[col] = [];
    cols[col].push({ ...s, id: i });
  });

  const colKeys = Object.keys(cols).map(Number).sort((a, b) => a - b);

  // Position each node
  const nodes = [];
  let x = 0;
  colKeys.forEach(colIdx => {
    const items = cols[colIdx];
    const colH  = items.length * NODE_H + (items.length - 1) * ROW_GAP;
    items.forEach((item, rowIdx) => {
      const y = rowIdx * (NODE_H + ROW_GAP);
      nodes.push({ ...item, x, y, colH });
    });
    x += NODE_W + COL_GAP;
  });

  const totalW = x - COL_GAP;
  const totalH = Math.max(...nodes.map(n => n.y + NODE_H));

  return { nodes, totalW, totalH };
}

// Build edges: each node connects to the next in the original step sequence
function buildEdges(nodes) {
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({ from: nodes[i], to: nodes[i + 1] });
  }
  return edges;
}

function EdgePath({ from, to }) {
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;
  const sameCol = from.x === to.x;

  let d;
  if (sameCol) {
    // Same column: vertical drop
    d = `M ${from.x + NODE_W / 2} ${from.y + NODE_H} L ${to.x + NODE_W / 2} ${to.y}`;
  } else {
    // Different columns: curved bezier
    const cx = (x1 + x2) / 2;
    d = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  }

  return (
    <path
      d={d}
      stroke="#334155"
      strokeWidth="1.5"
      strokeDasharray={sameCol ? '4 3' : undefined}
      fill="none"
      markerEnd="url(#arrow)"
    />
  );
}

function NodeBox({ node, active, onClick }) {
  const t = STEP_TYPES[node.type] || STEP_TYPES.function;
  const isActive = active === node.id;

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      onClick={() => onClick(node.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow when active */}
      {isActive && (
        <rect
          x={-3} y={-3}
          width={NODE_W + 6} height={NODE_H + 6}
          rx={11}
          fill={t.color}
          opacity={0.18}
        />
      )}

      {/* Card bg */}
      <rect
        width={NODE_W} height={NODE_H}
        rx={8}
        fill={t.bg}
        stroke={isActive ? t.color : t.border}
        strokeWidth={isActive ? 1.5 : 1}
      />

      {/* Left accent bar */}
      <rect width={4} height={NODE_H} rx={2} fill={t.color} />

      {/* Type badge */}
      <text
        x={12} y={18}
        fontSize={9}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
        textDecoration="none"
        letterSpacing="0.1em"
        fill={t.color}
        style={{ textTransform: 'uppercase' }}
      >
        {t.label}
      </text>

      {/* Label — truncate long text */}
      <text
        x={12} y={37}
        fontSize={11.5}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="500"
        fill="#e2e8f0"
      >
        {node.label.length > 22 ? node.label.slice(0, 22) + '…' : node.label}
      </text>
    </g>
  );
}

export default function FlowGraph({ flowData, visible }) {
  const containerRef = useRef(null);
  const [activeId, setActiveId]     = useState(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 400 });
  const [pan, setPan]               = useState({ x: 0, y: 0 });
  const [scale, setScale]           = useState(1);
  const dragging  = useRef(false);
  const lastPos   = useRef({ x: 0, y: 0 });

  const { nodes, totalW, totalH } = layoutNodes(flowData);
  const edges = buildEdges(nodes);
  const activeNode = nodes.find(n => n.id === activeId);

  // Fit graph into container on mount / data change
  useEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ w: width || 800, h: height || 400 });
    const fitScale = Math.min((width - 48) / totalW, (height - 48) / totalH, 1);
    setScale(Math.max(fitScale, 0.45));
    setPan({ x: 24, y: 24 });
  }, [flowData]);

  // Pan handlers
  const onMouseDown = e => {
    dragging.current = true;
    lastPos.current  = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = e => {
    if (!dragging.current) return;
    setPan(p => ({ x: p.x + e.clientX - lastPos.current.x, y: p.y + e.clientY - lastPos.current.y }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => { dragging.current = false; };

  const onWheel = e => {
    e.preventDefault();
    setScale(s => Math.min(Math.max(s - e.deltaY * 0.001, 0.3), 2));
  };

  const handleNodeClick = id => setActiveId(prev => (prev === id ? null : id));

  return (
    <div
      className="flow-graph-wrap"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
    >
      {/* Controls */}
      <div className="graph-controls">
        <button className="graph-ctrl-btn" onClick={() => setScale(s => Math.min(s + 0.15, 2))}>+</button>
        <button className="graph-ctrl-btn" onClick={() => setScale(s => Math.max(s - 0.15, 0.3))}>−</button>
        <button className="graph-ctrl-btn" onClick={() => { setScale(1); setPan({ x: 24, y: 24 }); }}>⟳</button>
        <span className="graph-scale-label">{Math.round(scale * 100)}%</span>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="graph-canvas"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 Z" fill="#334155" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>
            {/* Edges first (behind nodes) */}
            {edges.map((e, i) => (
              <EdgePath key={i} from={e.from} to={e.to} />
            ))}

            {/* Nodes */}
            {nodes.map(n => (
              <NodeBox key={n.id} node={n} active={activeId} onClick={handleNodeClick} />
            ))}
          </g>
        </svg>
      </div>

      {/* Detail panel for active node */}
      {activeNode && (
        <div className="graph-detail-panel">
          <div className="graph-detail-header">
            <span
              className="graph-detail-type"
              style={{ color: (STEP_TYPES[activeNode.type] || STEP_TYPES.function).color }}
            >
              {(STEP_TYPES[activeNode.type] || STEP_TYPES.function).label}
            </span>
            <button className="graph-detail-close" onClick={() => setActiveId(null)}>✕</button>
          </div>
          <div className="graph-detail-label">{activeNode.label}</div>
          <div className="graph-detail-meta">
            <span className="graph-detail-file">{activeNode.file}</span>
            <span className="graph-detail-line">line {activeNode.line}</span>
          </div>
          <div className="graph-detail-index">Step #{activeNode.id + 1} of {flowData.length}</div>
        </div>
      )}

      <p className="graph-hint">Scroll to zoom · Drag to pan · Click a node for details</p>
    </div>
  );
}
