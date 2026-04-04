import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, GitBranch, Zap, Cpu, Radio, ChevronDown, Sparkles } from 'lucide-react';
import { GodRays } from '@paper-design/shaders-react';
import { useMemo } from 'react';

// ── Floating particles field ──
function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.4 + 0.1,
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            y: [0, -30 - Math.random() * 40],
            x: [0, (Math.random() - 0.5) * 20],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(167,139,250,${p.opacity + 0.2}), transparent)`,
          }}
        />
      ))}
    </div>
  );
}

// ── Animated dot grid ──
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        opacity: 0.3,
        backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.15) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 20%, transparent 70%)',
      }}
    />
  );
}

// ── Feature pill data ──
const FEATURES = [
  { icon: GitBranch, label: 'AST Traversal' },
  { icon: Zap, label: 'Zero Overhead' },
  { icon: Radio, label: 'Live Tracing' },
  { icon: Cpu, label: 'Full-Stack' },
];

export default function HeroView({ isActive, onOpenWorkspace }) {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6 py-12 sm:py-20"
      style={{ background: '#07070a' }}
    >
      {/* ── Noise grain overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.032,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          zIndex: 1,
        }}
      />

      {/* ── GodRays Background ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <GodRays
          colorBack="#00000000"
          colors={['#5b21b650', '#4f46e550', '#3b0764 38', '#0284c730']}
          colorBloom="#6d28d9"
          offsetX={0.78}
          offsetY={-0.9}
          intensity={0.55}
          spotty={0.5}
          midSize={8}
          midIntensity={0}
          density={0.34}
          bloom={0.28}
          speed={0.45}
          scale={1.7}
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>

      {/* ── Dot grid ── */}
      <DotGrid />

      {/* ── Floating particles ── */}
      <ParticleField />

      {/* ── Radial vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #07070a 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Hero Content ── */}
      <div className="relative flex flex-col items-center gap-5 sm:gap-7 text-center" style={{ zIndex: 3 }}>

        {/* Orbital ring decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            width: 'clamp(280px, 50vw, 500px)',
            height: 'clamp(280px, 50vw, 500px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            pointerEvents: 'none',
          }}
        >
          {/* Outer ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(139,92,246,0.07)',
            animation: 'sk-orbit 60s linear infinite',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(167,139,250,0.5)',
              boxShadow: '0 0 12px rgba(139,92,246,0.4)',
            }} />
          </div>
          {/* Inner ring */}
          <div style={{
            position: 'absolute',
            inset: '20%',
            borderRadius: '50%',
            border: '1px solid rgba(139,92,246,0.05)',
            animation: 'sk-orbit 45s linear infinite reverse',
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translate(-50%, 50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.5)',
              boxShadow: '0 0 8px rgba(99,102,241,0.3)',
            }} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative' }}
        >
          {/* Subtle title glow plate */}
          <div
            style={{
              position: 'absolute',
              inset: '-24px -32px',
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(109,40,217,0.18), transparent 70%)',
              filter: 'blur(18px)',
              pointerEvents: 'none',
            }}
          />
          <h1
            style={{
              fontFamily: "'Syne', 'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(4rem, 14vw, 9rem)',
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              background: 'linear-gradient(160deg, #ffffff 20%, rgba(196,181,253,0.85) 60%, rgba(139,92,246,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              position: 'relative',
              margin: 0,
            }}
          >
            SHINKEI
          </h1>
        </motion.div>

        {/* Kanji + descriptor row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '13px',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(148,163,184,0.6)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: 'rgba(196,181,253,0.45)', fontSize: '20px', fontFamily: 'serif', fontWeight: 300, textTransform: 'none' }}>神経</span>
          <span style={{ width: '1px', height: '16px', background: 'rgba(148,163,184,0.15)' }} />
          <span style={{ fontSize: '11px' }}>Execution Flow Visualizer</span>
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: '320px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)',
          }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '460px',
            fontSize: 'clamp(14px, 2.4vw, 16px)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            lineHeight: 1.75,
            color: 'rgba(148,163,184,0.6)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Trace every execution path from your entry point.{' '}
          <span style={{ color: 'rgba(196,181,253,0.65)', fontWeight: 500 }}>Zero runtime overhead</span>{' '}
          — full AST traversal across your entire codebase.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="hero-features"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="hero-feature-pill"
            >
              <f.icon className="pill-icon" />
              {f.label}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.45, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative', marginTop: '12px' }}
            >
              {/* Button glow */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-10px -16px',
                  borderRadius: '100px',
                  background: 'radial-gradient(ellipse 70% 80% at 50% 60%, rgba(109,40,217,0.35), transparent 65%)',
                  filter: 'blur(16px)',
                  pointerEvents: 'none',
                }}
              />
              <button
                onClick={onOpenWorkspace}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  height: '56px',
                  padding: '0 32px',
                  borderRadius: '100px',
                  border: '1px solid rgba(139,92,246,0.35)',
                  background: 'linear-gradient(135deg, rgba(109,40,217,0.92) 0%, rgba(79,70,229,0.92) 100%)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                  boxShadow: '0 0 0 1px rgba(139,92,246,0.15) inset, 0 1px 0 0 rgba(255,255,255,0.08) inset, 0 8px 32px rgba(109,40,217,0.25)',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.2) inset, 0 1px 0 0 rgba(255,255,255,0.1) inset, 0 16px 48px rgba(109,40,217,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.15) inset, 0 1px 0 0 rgba(255,255,255,0.08) inset, 0 8px 32px rgba(109,40,217,0.25)';
                }}
                onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px) scale(0.98)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)'; }}
              >
                {/* Scanning light */}
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: '-40%',
                  width: '40%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                  animation: 'sk-scan 4s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
                {/* Inner top highlight */}
                <span style={{
                  position: 'absolute',
                  top: '1px',
                  left: '20%',
                  right: '20%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  pointerEvents: 'none',
                }} />
                Get Started
                <ArrowRight style={{ width: '16px', height: '16px', opacity: 0.85 }} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}