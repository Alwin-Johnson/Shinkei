import { useState, useEffect } from 'react';
import { Layers, Monitor, Server, Zap } from 'lucide-react';

function AnimatedNumber({ value, delay = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 700;
      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return display;
}

// Animated progress bar
function ProgressFill({ percentage, color, delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), delay + 400);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div style={{
      width: '100%',
      height: '3px',
      background: `${color}10`,
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '10px',
    }}>
      <div style={{
        width: `${width}%`,
        height: '100%',
        background: `linear-gradient(90deg, ${color}60, ${color})`,
        borderRadius: '2px',
        transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Shimmer effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          animation: 'sk-shimmer 2s ease-in-out infinite 1s',
        }} />
      </div>
    </div>
  );
}

const STAT_CONFIG = [
  {
    key: 'total',
    label: 'Total Nodes',
    color: '#a78bfa',
    Icon: Layers,
  },
  {
    key: 'frontend',
    label: 'Frontend',
    color: '#60a5fa',
    Icon: Monitor,
  },
  {
    key: 'backend',
    label: 'Backend',
    color: '#34d399',
    Icon: Server,
  },
  {
    key: 'api',
    label: 'API Calls',
    color: '#fbbf24',
    Icon: Zap,
  },
];

export default function StatsBar({ flow }) {
  const values = {
    total:    flow.length,
    frontend: flow.filter(s => s.layer === 'frontend' || s.type === 'event').length,
    backend:  flow.filter(s => s.layer === 'backend'  || s.type === 'route').length,
    api:      flow.filter(s => s.type === 'api'       || s.type === 'external').length,
  };

  const maxVal = Math.max(1, ...Object.values(values));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      marginBottom: '12px',
    }}>
      {STAT_CONFIG.map((s, i) => (
        <div
          key={s.key}
          style={{
            position: 'relative',
            background: 'rgba(15,10,30,0.6)',
            border: `1px solid ${s.color}18`,
            borderRadius: '14px',
            padding: '16px 14px 14px',
            textAlign: 'center',
            overflow: 'hidden',
            transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
            cursor: 'default',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = `${s.color}40`;
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = `0 12px 32px -4px ${s.color}18`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = `${s.color}18`;
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Top edge glow */}
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '20%',
            right: '20%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${s.color}40, transparent)`,
            borderRadius: '0 0 4px 4px',
          }} />

          {/* Background glow */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '80px',
            background: `radial-gradient(circle, ${s.color}08, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <div style={{
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `${s.color}0a`,
              border: `1px solid ${s.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <s.Icon style={{
                width: 13, height: 13,
                color: s.color,
                opacity: 0.6,
              }} />
            </div>
          </div>

          {/* Value */}
          <div style={{
            fontSize: '26px',
            fontWeight: 800,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1,
            color: s.color,
            position: 'relative',
          }}>
            <AnimatedNumber value={values[s.key]} delay={i * 80 + 250} />
          </div>

          {/* Label */}
          <div style={{
            fontSize: '10px',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: '7px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
          }}>
            {s.label}
          </div>

          {/* Progress fill */}
          <ProgressFill
            percentage={Math.round((values[s.key] / maxVal) * 100)}
            color={s.color}
            delay={i * 80 + 250}
          />
        </div>
      ))}
    </div>
  );
}