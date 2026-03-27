import { STEP_TYPES } from '../constants/stepTypes';

export default function FlowStep({ step, index, isLast, visible }) {
  const t = STEP_TYPES[step.type] || STEP_TYPES.function;

  return (
    <div
      className="flow-step-wrap"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.35s ease ${index * 60}ms, transform 0.35s ease ${index * 60}ms`,
      }}
    >
      {/* Card */}
      <div
        className="step-card"
        style={{
          background: t.bg,
          borderColor: t.border,
        }}
      >
        <div className="step-card-bar" style={{ background: t.color }} />

        <div className="step-card-body">
          <div className="step-meta">
            <span className="step-type-badge" style={{ color: t.color, background: `${t.color}22` }}>
              {t.label}
            </span>
            <span className="step-file">
              {step.file}:{step.line}
            </span>
          </div>
          <div className="step-label">{step.label}</div>
        </div>

        <div className="step-index">#{index + 1}</div>
      </div>

      {/* Connector */}
      {!isLast && (
        <div className="step-connector">
          <div className="connector-line" />
          <svg width="10" height="6" viewBox="0 0 10 6" className="connector-arrow">
            <path d="M5 6 L0 0 L10 0 Z" fill="#334155" />
          </svg>
        </div>
      )}
    </div>
  );
}
