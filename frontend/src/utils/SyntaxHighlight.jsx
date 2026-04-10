// Minimal syntax highlighter for code panel display

export function highlight(code) {
  const line = String(code ?? '');
  const isComment = line.trim().startsWith('//');

  if (isComment) {
    return <span style={{ color: '#64748b' }}>{line}</span>;
  }

  const keywords = ['async','function','const','let','var','return','await',
    'if','else','for','of','try','catch','export','exports','import','new',
    'true','false','null','undefined','throw'];

  const parts = line.split(/(\b(?:async|function|const|let|var|return|await|if|else|for|of|try|catch|export|exports|import|new|true|false|null|undefined|throw)\b|'[^']*'|"[^"]*"|`[^`]*`)/g);

  return parts.map((part, i) => {
    if (keywords.includes(part.trim())) {
      return <span key={i} style={{ color: '#c084fc' }}>{part}</span>;
    }
    if (/^['"`]/.test(part)) {
      return <span key={i} style={{ color: '#86efac' }}>{part}</span>;
    }
    return <span key={i} style={{ color: '#e2e8f0' }}>{part}</span>;
  });
}
