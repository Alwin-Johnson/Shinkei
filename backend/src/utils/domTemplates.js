// backend/utils/domTemplates.js

const BABEL_PLUGIN_CODE = `
module.exports = function (babel) {
  const t = babel.types;
  return {
    visitor: {
      JSXOpeningElement(path, state) {
        const filename = state.file.opts.filename || "unknown";
        if (filename.includes("node_modules")) return;
        const line = path.node.loc ? path.node.loc.start.line : null;
        if (filename && line) {
          path.node.attributes.push(
            t.jsxAttribute(t.jsxIdentifier("data-shinkei-file"), t.stringLiteral(filename)),
            t.jsxAttribute(t.jsxIdentifier("data-shinkei-line"), t.stringLiteral(line.toString()))
          );
        }
      },
    },
  };
};
`;

const CLIENT_SCRIPT_CODE = `
(function() {
  console.log('💉 [Shinkei] Client Script Active');
  
  let isInspectMode = false;
  let highlightBox = null;
  let lastTarget = null;

  // Diagnostic: Check if components are tagged correctly
  // Diagnostic: Check if components are tagged correctly
  function runDiagnostics() {
    let attempts = 0;
    
    console.log('⏳ [Shinkei] Waiting for React to render...');
    
    // Check the DOM every 500ms
    const interval = setInterval(() => {
      const taggedElements = document.querySelectorAll('[data-shinkei-file]');
      
      if (taggedElements.length > 0) {
        // We found them! Stop checking.
        clearInterval(interval);
        console.log('✅ [Shinkei Diagnostics] Found ' + taggedElements.length + ' tagged components. Inspector ready.');
      } else {
        attempts++;
        // If we've checked 10 times (5 seconds) and still nothing, Babel definitely failed.
        if (attempts >= 10) {
          clearInterval(interval);
          console.error('❌ [Shinkei Error] No components tagged! Selection will not work.');
          console.warn('Reason: The Babel plugin did NOT run during the build step of this target application.');
        }
      }
    }, 500);
  }

  function initShinkeiUI() {
    if (!document.body) {
      setTimeout(initShinkeiUI, 50);
      return;
    }

    const badge = document.createElement('div');
    badge.innerHTML = '● SHINKEI ACTIVE';
    Object.assign(badge.style, {
      position: 'fixed', bottom: '10px', right: '10px',
      padding: '4px 8px', background: 'rgba(0,0,0,0.8)',
      color: '#22c993', fontSize: '10px', fontFamily: 'monospace',
      borderRadius: '4px', zIndex: '999999', pointerEvents: 'none',
      border: '1px solid #22c993'
    });
    document.body.appendChild(badge);
    
    runDiagnostics();
  }

  function createHighlightBox() {
    if (!document.body) return;
    if (highlightBox) return;
    highlightBox = document.createElement('div');
    highlightBox.id = 'shinkei-inspector-highlight';
    Object.assign(highlightBox.style, {
      position: 'fixed', pointerEvents: 'none',
      border: '2px solid #7c3aed', backgroundColor: 'rgba(124, 58, 237, 0.1)',
      zIndex: '1000000', transition: 'all 0.05s ease-out',
      display: 'none', borderRadius: '4px',
      boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)'
    });
    document.body.appendChild(highlightBox);
  }

  function updateHighlight(el) {
    if (!el || !isInspectMode || !highlightBox) {
      if (highlightBox) highlightBox.style.display = 'none';
      return;
    }
    const rect = el.getBoundingClientRect();
    Object.assign(highlightBox.style, {
      top: rect.top + 'px', left: rect.left + 'px',
      width: rect.width + 'px', height: rect.height + 'px',
      display: 'block'
    });
  }

  window.addEventListener('message', (event) => {
    if (event.data.type === 'SHINKEI_INSPECTOR_MODE') {
      isInspectMode = event.data.enabled;
      if (!isInspectMode && highlightBox) {
        highlightBox.style.display = 'none';
        document.body.style.cursor = 'default';
      } else {
        createHighlightBox();
        if (document.body) document.body.style.cursor = 'crosshair';
      }
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isInspectMode) return;
    const target = e.target.closest('[data-shinkei-file]');
    if (target !== lastTarget) {
      lastTarget = target;
      updateHighlight(target);
    }
  }, { passive: true });

  document.addEventListener('click', (event) => {
    if (!event.altKey && !isInspectMode) return;
    
    const target = event.target.closest('[data-shinkei-file]');
    if (target) {
      event.preventDefault();
      event.stopPropagation();
      
      const payload = {
        type: "SHINKEI_CLICK",
        file: target.getAttribute('data-shinkei-file'),
        line: target.getAttribute('data-shinkei-line')
      };
      
      window.parent.postMessage(payload, "*");

      if (isInspectMode) {
        isInspectMode = false;
        if (highlightBox) highlightBox.style.display = 'none';
        document.body.style.cursor = 'default';
        window.parent.postMessage({ type: "SHINKEI_INSPECTOR_DISABLED" }, "*");
      }
    }
  }, { capture: true });

  // Use window.onload instead of DOMContentLoaded to wait for external scripts (like React bundles)
  window.addEventListener('load', () => {
    initShinkeiUI();
  });
})();
`;

module.exports = { BABEL_PLUGIN_CODE, CLIENT_SCRIPT_CODE };