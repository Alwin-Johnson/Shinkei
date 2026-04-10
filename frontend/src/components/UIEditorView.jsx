import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Code2, Monitor, MousePointer2, RefreshCcw, Check, AlertCircle, Search, Zap } from 'lucide-react';
import { highlight } from '../utils/SyntaxHighlight';

export default function UIEditorView({ 
  isOpen, 
  appUrl, 
  onClose,
  repoRoot,
  isAppReady 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [line, setLine] = useState(null);
  const [snippetStartLine, setSnippetStartLine] = useState(1); // 👈 Track where snippet starts
  const [activeRange, setActiveRange] = useState(null); // 👈 Store snippet boundaries
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [isDesignMode, setIsDesignMode] = useState(true); // Default to design-focused
  const [showReadyToast, setShowReadyToast] = useState(false);
  const [scrollTop, setScrollTop] = useState(0); // 👈 Track scroll position
  const iframeRef = useRef(null);
  const textareaRef = useRef(null);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  // ── Relative line for highlight ──
  const relativeLine = isDesignMode ? (line - snippetStartLine + 1) : line;

  // ── Auto-scroll to selected line ──
  useEffect(() => {
    if (textareaRef.current && line) {
      const lineHeight = 1.6 * 13;
      const scrollLine = isDesignMode ? relativeLine : line;
      const scrollTop = (scrollLine - 1) * lineHeight;
      textareaRef.current.scrollTo({ top: Math.max(0, scrollTop - 100), behavior: 'smooth' });
      textareaRef.current.focus();
    }
  }, [line, fileContent, isDesignMode, relativeLine]);

  useEffect(() => {
    if (isAppReady && isOpen) {
      setShowReadyToast(true);
      const timer = setTimeout(() => setShowReadyToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAppReady, isOpen]);

  // ── Listen for SHINKEI_CLICK from Iframe ──
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('📬 [Shinkei-Parent] Message from Iframe:', event.data);
      if (event.data?.type === 'SHINKEI_CLICK') {
        const { file, line } = event.data;
        console.log('🎯 UI Click detected:', file, 'line:', line);
        handleFileSelect(file, line);
        setIsInspectMode(false); // Auto-turn off on click
      }
      if (event.data?.type === 'SHINKEI_INSPECTOR_DISABLED') {
        setIsInspectMode(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const toggleInspector = () => {
    const nextState = !isInspectMode;
    setIsInspectMode(nextState);
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SHINKEI_INSPECTOR_MODE',
        enabled: nextState
      }, '*');
    }
  };

  const handleFileSelect = async (filePath, lineNum) => {
    setLoading(true);
    setSelectedFile(filePath);
    setLine(lineNum);
    try {
      // 🎯 Request specific line to get design snippet
      const url = `http://${window.location.hostname}:5000/api/editor/read?file=${encodeURIComponent(filePath)}${isDesignMode ? `&line=${lineNum}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setFileContent(data.content);
        setOriginalContent(data.content);
        setActiveRange(data.range || null);
        setSnippetStartLine(data.snippetStartLine || 1); // 👈 Save the offset
      }
    } catch (err) {
      console.error('Failed to read file:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || saving) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/editor/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: selectedFile,
          newCode: fileContent,
          repoRoot: repoRoot,
          range: activeRange // 👈 Surgical update!
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('success');
        setOriginalContent(fileContent);
        // Refresh iframe to see changes
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src;
        }
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (!isOpen) return null;

  const isDirty = fileContent !== originalContent;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#07070a' }}
    >
      {/* ── Top Bar ── */}
      <div style={{
        height: '60px',
        background: 'rgba(7,7,10,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139,92,246,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} />
            Exit
          </button>
          <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={toggleInspector}
              disabled={!isAppReady}
              style={{
                background: isInspectMode ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isInspectMode ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
                color: isInspectMode ? '#c4b5fd' : '#94a3b8',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isAppReady ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                opacity: isAppReady ? 1 : 0.5,
                boxShadow: isInspectMode ? '0 0 15px rgba(124,58,237,0.15)' : 'none',
              }}
            >
              <Search style={{ width: 14, height: 14 }} />
              Inspect
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontSize: '11px',
            color: isAppReady ? '#22c993' : '#64748b',
            background: isAppReady ? 'rgba(34,201,147,0.05)' : 'rgba(255,255,255,0.02)',
            padding: '4px 12px',
            borderRadius: '100px',
            border: `1px solid ${isAppReady ? 'rgba(34,201,147,0.2)' : 'rgba(255,255,255,0.05)'}`,
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{ 
              width: 6, height: 6, borderRadius: '50%', 
              background: isAppReady ? '#22c993' : '#475569',
              animation: isAppReady ? 'sk-pulse 2s infinite' : 'none'
            }} />
            {isAppReady ? (isInspectMode ? 'SELECT MODE ACTIVE' : 'EDITOR READY') : 'INITIALIZING...'}
          </div>
          
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            style={{
              background: isDirty ? 'linear-gradient(135deg, #7c3aed, #6366f1)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '8px',
              color: isDirty ? '#fff' : '#475569',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isDirty ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {saving ? <RefreshCcw style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: 14, height: 14 }} />}
            {saveStatus === 'success' ? 'Saved!' : 'Sync Changes'}
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* Iframe Panel */}
        <div style={{ flex: 1, position: 'relative', background: '#fff' }}>
          {!isAppReady && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5,
              background: '#07070a', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '20px'
            }}>
              <RefreshCcw style={{ width: 32, height: 32, color: '#7c3aed', animation: 'spin 2s linear infinite' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#f1f5f9', fontWeight: 600, margin: 0 }}>Starting environment...</p>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>This may take a few seconds depending on the project size.</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={appUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Target Website"
          />
        </div>

        {/* Editor Panel */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '500px',
                background: '#0f0a1e',
                borderLeft: '1px solid rgba(139,92,246,0.2)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-20px 0 40px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(139,92,246,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      onClick={() => setIsDesignMode(!isDesignMode)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', 
                        cursor: 'pointer', background: isDesignMode ? 'rgba(167,139,250,0.1)' : 'transparent',
                        padding: '4px 10px', borderRadius: '6px', border: `1px solid ${isDesignMode ? 'rgba(167,139,250,0.3)' : 'transparent'}`
                      }}
                    >
                      <Zap style={{ width: 14, height: 14, color: isDesignMode ? '#a78bfa' : '#64748b' }} />
                      <span style={{ color: isDesignMode ? '#e2e8f0' : '#64748b', fontSize: '12px', fontWeight: 600 }}>Design Mode</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  >✕</button>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {selectedFile.split('/').pop()} {line && `(Line ${line})`}
                </div>
              </div>

              <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                {loading ? (
                  <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                    <RefreshCcw style={{ width: 24, height: 24, color: '#7c3aed', animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : (
                  <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                    {/* Active line highlight background */}
                    {line && (
                      <div style={{
                        position: 'absolute',
                        top: 20 + (relativeLine - 1) * (1.6 * 13) - scrollTop, // 👈 Account for scroll!
                        left: 0, right: 0, height: 1.6 * 13,
                        background: 'rgba(124,58,237,0.25)', 
                        borderLeft: '4px solid #7c3aed', 
                        pointerEvents: 'none',
                        zIndex: 0,
                      }} />
                    )}
                    <textarea
                      ref={textareaRef}
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      onScroll={handleScroll} // 👈 Sync scroll
                      spellCheck={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        color: isDesignMode ? '#94a3b8' : '#cbd5e1', 
                        border: 'none',
                        outline: 'none',
                        padding: '20px',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        resize: 'none',
                        position: 'relative',
                        zIndex: 1,
                        caretColor: '#7c3aed',
                      }}
                    />
                  </div>
                )}
              </div>

              {saveStatus && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    background: saveStatus === 'success' ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    zIndex: 100,
                  }}
                >
                  {saveStatus === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                  {saveStatus === 'success' ? 'Changes synced successfully' : 'Failed to save changes'}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ready Toast */}
        <AnimatePresence>
          {showReadyToast && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              style={{
                position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(124,58,237,0.95)', color: '#fff', padding: '12px 24px',
                borderRadius: '100px', boxShadow: '0 10px 40px rgba(124,58,237,0.4)',
                display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1000,
                backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Zap size={18} fill="currentColor" />
              <span style={{ fontWeight: 600, fontSize: '14px' }}>Editor Ready! You can now use the Inspect tool.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sk-pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
}
