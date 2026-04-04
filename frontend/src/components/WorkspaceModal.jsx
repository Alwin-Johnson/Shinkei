import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, GitBranch, Cpu, Radio, Layers, Sparkles } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import RepoInput from './RepoInput';


export default function WorkspaceModal({ isOpen, onClose, onAnalyze, loading }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: '#07070a' }}
        >
          <motion.div
            layoutId="cta-card"
            transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
            style={{ background: '#0f0a1e' }}
            layout
            className="relative flex w-full h-full overflow-hidden"
          >
            {/* MeshGradient Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none"
            >
              <MeshGradient
                speed={0.6}
                colors={["#2e1065", "#1e1b4b", "#0f0a2a", "#1a0f3a"]}
                distortion={0.8}
                swirl={0.1}
                grainMixer={0.15}
                grainOverlay={0}
                style={{ height: '100%', width: '100%' }}
              />
            </motion.div>

            {/* Noise grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0.025,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'repeat',
                backgroundSize: '128px 128px',
                zIndex: 1,
              }}
            />

            {/* Back Button — top-left */}
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={onClose}
              className="absolute left-5 top-5 sm:left-8 sm:top-7 z-50 cursor-pointer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px 8px 12px',
                borderRadius: '100px',
                background: 'rgba(139,92,246,0.06)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(139,92,246,0.12)',
                color: '#a78bfa',
                fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                letterSpacing: '0.01em',
                transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
                e.currentTarget.style.color = '#c4b5fd';
                e.currentTarget.style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.12)';
                e.currentTarget.style.color = '#a78bfa';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              Back
            </motion.button>

            {/* Two-column layout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="relative z-10 flex h-full w-full"
              style={{ flexDirection: 'row' }}
            >
              {/* ── Left Panel: Brand Showcase ── */}
              <div
                className="hidden lg:flex"
                style={{
                  flex: '0 0 45%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '48px 40px 48px 48px',
                  gap: '36px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative glow */}
                <div style={{
                  position: 'absolute',
                  width: '300px',
                  height: '300px',
                  top: '10%',
                  left: '-60px',
                  background: 'radial-gradient(circle, rgba(109,40,217,0.15), transparent 70%)',
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                }} />

                {/* Brand header */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                  }}>
                  </div>
                  <h2 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    color: '#f8fafc',
                    margin: 0,
                  }}>
                    Map Your Code's{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      Execution Flow
                    </span>
                  </h2>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: 'rgba(148,163,184,0.7)',
                    lineHeight: 1.7,
                    marginTop: '12px',
                    maxWidth: '380px',
                  }}>
                    Paste a GitHub URL, pick your entry function, and Shinkei will trace the complete execution graph in seconds.
                  </p>
                </motion.div>
              </div>
              {/* ── Vertical divider ── */}
              <div
                className="hidden lg:block"
                style={{
                  width: '1px',
                  alignSelf: 'stretch',
                  margin: '48px 0',
                  background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.15), transparent)',
                }}
              />

              {/* ── Right Panel: Form ── */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  overflowY: 'auto',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="workspace-form-card"
                  style={{ margin: '24px' }}
                >
                  <RepoInput onAnalyze={onAnalyze} loading={loading} analyzed={false} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
