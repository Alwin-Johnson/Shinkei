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
document.addEventListener("click", (event) => {
  if (!event.altKey) return; 
  event.preventDefault();
  event.stopPropagation();
  const target = event.target.closest('[data-shinkei-file]');
  if (target) {
    window.parent.postMessage({
      type: "SHINKEI_CLICK",
      file: target.getAttribute('data-shinkei-file'),
      line: target.getAttribute('data-shinkei-line')
    }, "*");
  }
}, { capture: true });
`;

module.exports = { BABEL_PLUGIN_CODE, CLIENT_SCRIPT_CODE };