import { STEP_TYPES } from '../constants/stepTypes';

export default function Legend() {
  return (
    <div className="legend">
      {Object.entries(STEP_TYPES).map(([key, val]) => (
        <div key={key} className="legend-item">
          <div className="legend-dot" style={{ background: val.color }} />
          <span className="legend-label">{val.label}</span>
        </div>
      ))}
    </div>
  );
}
