export default function StatsBar({ flow }) {
  const stats = [
    {
      label: 'Total steps',
      value: flow.length,
      color: '#a78bfa',
    },
    {
      label: 'Frontend',
      value: flow.filter(
        s => ['event', 'function'].includes(s.type) &&
          !s.file.includes('Controller') &&
          !s.file.includes('Service') &&
          !s.file.includes('routes')
      ).length,
      color: '#60a5fa',
    },
    {
      label: 'Backend',
      value: flow.filter(
        s => s.file && (
          s.file.includes('Controller') ||
          s.file.includes('Service') ||
          s.file.includes('routes')
        )
      ).length,
      color: '#34d399',
    },
    {
      label: 'API calls',
      value: flow.filter(s => s.type === 'api').length,
      color: '#fbbf24',
    },
  ];

  return (
    <div className="stats-bar">
      {stats.map(s => (
        <div key={s.label} className="stat-card">
          <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
