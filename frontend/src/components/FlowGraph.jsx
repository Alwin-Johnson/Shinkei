import { useEffect, useState, useCallback, useRef } from 'react';
import CodePanel from './CodePanel';

const TYPE = {
  event:    { label: 'Event',    accent: '#EF9F27', bg: 'rgba(239,159,39,0.07)',  border: 'rgba(239,159,39,0.35)',  text: '#FAC775' },
  function: { label: 'Function', accent: '#7F77DD', bg: 'rgba(127,119,221,0.07)', border: 'rgba(127,119,221,0.35)', text: '#CECBF6' },
  api:      { label: 'API',      accent: '#1D9E75', bg: 'rgba(29,158,117,0.07)',  border: 'rgba(29,158,117,0.35)',  text: '#9FE1CB' },
  response: { label: 'Response', accent: '#378ADD', bg: 'rgba(55,138,221,0.07)',  border: 'rgba(55,138,221,0.35)',  text: '#B5D4F4' },
};

const NW   = 200;
const NH   = 64;
const HGAP = 36;
const VGAP = 68;
const PAD  = 48;

// ms per level reveal
const LEVEL_DELAY = 650;

function buildTreeLayout(nodes, edges, rootId) {
  const childMap = {};
  nodes.forEach(n => (childMap[n.id] = []));
  edges.forEach(e => {
    if (childMap[e.from] !== undefined) childMap[e.from].push(e.to);
  });

  const levels = {};
  const queue  = [rootId];
  levels[rootId] = 0;
  while (queue.length) {
    const cur = queue.shift();
    (childMap[cur] || []).forEach(child => {
      if (levels[child] === undefined) {
        levels[child] = levels[cur] + 1;
        queue.push(child);
      }
    });
  }

  const byDepth = {};
  Object.entries(levels).forEach(([id, d]) => {
    if (!byDepth[d]) byDepth[d] = [];
    byDepth[d].push(Number(id));
  });

  const maxDepth = Math.max(...Object.keys(byDepth).map(Number));
  const maxRowW  = Math.max(
    ...Object.values(byDepth).map(row => row.length * NW + (row.length - 1) * HGAP)
  );

  const pos = {};
  for (let d = 0; d <= maxDepth; d++) {
    const row    = byDepth[d] || [];
    const rowW   = row.length * NW + (row.length - 1) * HGAP;
    const offset = (maxRowW - rowW) / 2;
    row.forEach((id, i) => {
      pos[id] = { x: offset + i * (NW + HGAP), y: d * (NH + VGAP) };
    });
  }

  const svgW = maxRowW + PAD * 2;
  const svgH = (maxDepth + 1) * (NH + VGAP) - VGAP + PAD * 2 + 20;
  return { pos, levels, byDepth, maxDepth, svgW, svgH };
}

function EdgePath({ from, to, label, pos, levels, visible }) {
  const fp = pos[from], tp = pos[to];
  if (!fp || !tp) return null;

  const fx = PAD + fp.x + NW / 2;
  const fy = PAD + fp.y + NH;
  const tx = PAD + tp.x + NW / 2;
  const ty = PAD + tp.y;
  const my = (fy + ty) / 2;

  const sameLevel = levels[from] === levels[to];
  let d;
  if (sameLevel) {
    const bend = 55;
    d = `M ${fx} ${fy - NH / 2} C ${fx} ${fy + bend}, ${tx} ${ty - bend}, ${tx} ${ty - NH / 2}`;
  } else if (Math.abs(fx - tx) < 2) {
    d = `M ${fx} ${fy} L ${tx} ${ty}`;
  } else {
    d = `M ${fx} ${fy} C ${fx} ${my}, ${tx} ${my}, ${tx} ${ty}`;
  }

  // edge becomes visible when the DESTINATION level is revealed
  const destLevel = levels[to];

  return (
    <g style={{
      opacity: visible ? 1 : 0,
      transition: `opacity 0.6s ease ${destLevel * LEVEL_DELAY + 150}ms`,
    }}>
      <path d={d} fill="none" stroke="#6366f1" strokeWidth="1.8" opacity="0.9" markerEnd="url(#arr)" />
      {label && (
        <text x={(fx + tx) / 2} y={my - 6} textAnchor="middle" fontSize="9"
          fontFamily="monospace" fill="#818cf8" letterSpacing="0.04em">
          {label}
        </text>
      )}
    </g>
  );
}

function NodeCard({ node, pos, isRoot, isActive, onClick, level, visible }) {
  const p = pos[node.id];
  if (!p) return null;

  const x = PAD + p.x;
  const y = PAD + p.y;
  const t = TYPE[node.type] || TYPE.function;
  const shortLabel = node.label.length > 22 ? node.label.slice(0, 21) + '...' : node.label;
  const shortFile  = node.file.length  > 24 ? '...' + node.file.slice(-23)   : node.file;

  const delay = level * LEVEL_DELAY;

  return (
    <g
      style={{
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(18px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
      onClick={() => onClick(node.id)}
    >
      {isRoot && (
        <rect x={x - 5} y={y - 5} width={NW + 10} height={NH + 10} rx={14}
          fill={t.accent} opacity={0.13} />
      )}
      {isActive && (
        <rect x={x - 3} y={y - 3} width={NW + 6} height={NH + 6} rx={12}
          fill={t.accent} opacity={0.22} />
      )}
      <rect x={x} y={y} width={NW} height={NH} rx={9}
        fill={t.bg}
        stroke={isRoot || isActive ? t.accent : t.border}
        strokeWidth={isRoot ? 1.8 : isActive ? 1.8 : 0.8} />
      <rect x={x} y={y} width={4} height={NH} rx={2} fill={t.accent} />
      <text x={x + 14} y={y + 18} fontSize="8.5" fontFamily="monospace"
        fontWeight="700" fill={t.accent} letterSpacing="0.10em">
        {t.label.toUpperCase()}{isRoot ? ' · ROOT' : ''}
      </text>
      <text x={x + 14} y={y + 37} fontSize="11.5" fontFamily="monospace"
        fontWeight="500" fill={t.text}>
        {shortLabel}
      </text>
      <text x={x + 14} y={y + 53} fontSize="9.5" fontFamily="monospace" fill="#475569">
        {shortFile} :{node.line}
      </text>
    </g>
  );
}

export default function FlowGraph({ flowData }) {
  const [activeId,  setActiveId]  = useState(null);
  const [animReady, setAnimReady] = useState(false);

  // reset and retrigger grow animation whenever flowData changes
  useEffect(() => {
    setActiveId(null);
    setAnimReady(false);
    const t = setTimeout(() => setAnimReady(true), 60);
    return () => clearTimeout(t);
  }, [flowData]);

  const handleNodeClick = useCallback(id => {
    setActiveId(prev => prev === id ? null : id);
  }, []);

  if (!flowData) return null;
  if (!flowData.nodes || flowData.edges === undefined) return null;

  const { nodes, edges, root: rootId } = flowData;
  const { pos, levels, svgW, svgH }    = buildTreeLayout(nodes, edges, rootId);
  const activeNode = nodes.find(n => n.id === activeId);
  const hasActive  = !!activeNode;

  return (
    <>
      <style>{`
        /* outer shell — viewport wide without leaking into parent layout */
        .fg-shell {
          position: relative;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          height: 100vh;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          contain: layout;
        }

        /* GRAPH PANEL — centered when no node selected, slides to left when one is */
        .fg-graph-panel {
          position: absolute;
          top: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;

          /* centered by default */
          left: 0;
          width: 100%;
          transition: width 0.45s cubic-bezier(0.4,0,0.2,1),
                      left  0.45s cubic-bezier(0.4,0,0.2,1);
        }
        .fg-graph-panel.has-active {
          width: 50%;
          left: 0;
          border-right: 1px solid rgba(71,85,105,0.3);
        }

        .fg-hint {
          text-align: center;
          font-size: 11px;
          color: #334155;
          font-family: 'JetBrains Mono', monospace;
          padding: 10px 0 6px;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          margin: 0;
        }
        .fg-scroll {
          flex: 1;
          overflow-x: auto;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;   /* keeps SVG centered inside the panel */
        }

        /* CODE PANEL — slides in from the right */
        .fg-code-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          overflow-y: auto;
          transform: translateX(100%);
          opacity: 0;
          transition: transform 0.45s cubic-bezier(0.4,0,0.2,1),
                      opacity  0.35s ease;
          pointer-events: none;
        }
        .fg-code-panel.has-active {
          transform: translateX(0);
          opacity: 1;
          pointer-events: all;
        }

        .fg-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #1e293b;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="fg-shell">

        {/* GRAPH — centered, slides left on click */}
        <div className={`fg-graph-panel ${hasActive ? 'has-active' : ''}`}>
          <p className="fg-hint">Click a node to view its code</p>
          <div className="fg-scroll">
            <svg
              width={svgW}
              height={svgH}
              viewBox={`0 0 ${svgW} ${svgH}`}
              style={{ display: 'block', flexShrink: 0 }}
            >
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M1 1L9 5L1 9" fill="none" stroke="#6366f1"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>

              {/* Edges — fade in when destination level is revealed */}
              {edges.map((e, i) => (
                <EdgePath key={i} from={e.from} to={e.to} label={e.label}
                  pos={pos} levels={levels} visible={animReady} />
              ))}

              {/* Nodes — grow level by level */}
              {nodes.map(nd => (
                <NodeCard
                  key={nd.id}
                  node={nd}
                  pos={pos}
                  isRoot={nd.id === rootId}
                  isActive={nd.id === activeId}
                  onClick={handleNodeClick}
                  level={levels[nd.id] ?? 0}
                  visible={animReady}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* CODE — slides in from right */}
        <div className={`fg-code-panel ${hasActive ? 'has-active' : ''}`}>
          {activeNode
            ? <CodePanel node={activeNode} onClose={() => setActiveId(null)} />
            : <div className="fg-empty" />
          }
        </div>

      </div>
    </>
  );
}