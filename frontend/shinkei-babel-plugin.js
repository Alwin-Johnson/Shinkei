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
