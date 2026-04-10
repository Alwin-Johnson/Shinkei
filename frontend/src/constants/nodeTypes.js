// Shared node type configuration used by FlowGraph and CodePanel

export const NODE_TYPES = {
  event:    { label: 'Event',    accent: '#EF9F27', bg: 'rgba(239,159,39,0.08)',  border: 'rgba(239,159,39,0.3)',  text: '#FDD68A', glow: 'rgba(239,159,39,0.25)' },
  function: { label: 'Function', accent: '#8B7FE8', bg: 'rgba(139,127,232,0.08)', border: 'rgba(139,127,232,0.3)', text: '#D4D0F9', glow: 'rgba(139,127,232,0.25)' },
  route:    { label: 'Route',    accent: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.3)',  text: '#FED7AA', glow: 'rgba(245,158,11,0.25)' },
  api:      { label: 'API',      accent: '#22C993', bg: 'rgba(34,201,147,0.08)',   border: 'rgba(34,201,147,0.3)',  text: '#B5ECDA', glow: 'rgba(34,201,147,0.25)' },
  response: { label: 'Response', accent: '#60A5FA', bg: 'rgba(96,165,250,0.08)',   border: 'rgba(96,165,250,0.3)',  text: '#C8DFF7', glow: 'rgba(96,165,250,0.25)' },
};

export const TYPE_COLOR = {
  event:    '#EF9F27',
  function: '#8B7FE8',
  route:    '#F59E0B',
  api:      '#22C993',
  response: '#60A5FA',
};

export const TYPE_LABEL = {
  event: 'Event Handler',
  function: 'Function',
  route: 'Route Handler',
  api: 'API Route',
  response: 'Response',
};

export const LAYER_COLOR = {
  frontend: '#60A5FA',
  backend: '#22C993',
};
