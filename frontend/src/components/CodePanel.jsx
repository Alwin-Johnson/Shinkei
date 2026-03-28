// CodePanel.jsx
// Displays the code snippet for a clicked graph node.
// In production, replace MOCK_CODE with real file contents fetched from your backend/GitHub API.

const TYPE_COLOR = {
  event:    '#EF9F27',
  function: '#7F77DD',
  api:      '#1D9E75',
  response: '#378ADD',
};

// Mock code snippets keyed by node label.
// Replace these with real fetched code in production.
const MOCK_CODE = {
  'handleSubmit': `async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const isValid = validateCredentials(form);
  if (!isValid) return;

  try {
    const result = await loginUser(
      form.email.value,
      form.password.value
    );
    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  }
}`,

  'validateCredentials': `function validateCredentials(form) {
  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !email.includes('@')) {
    setError('Invalid email address');
    return false;
  }
  if (password.length < 8) {
    setError('Password too short');
    return false;
  }
  return true;
}`,

  'loginUser': `export async function loginUser(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}`,

  'POST /api/auth/login': `router.post('/login', authController.login);

// Route: POST /api/auth/login
// Controller: authController.login
// Middleware: validateBody, rateLimiter`,

  'authController.login': `exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserService
      .findByEmail(email);
    if (!user) return res
      .status(401)
      .json({ error: 'Not found' });

    const token = await jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};`,

  'UserService.findByEmail': `exports.findByEmail = async (email) => {
  const user = await User.findOne({ email })
    .select('+password')
    .lean();

  if (!user) return null;

  const match = await bcrypt.compare(
    password, user.password
  );
  if (!match) return null;
  return user;
};`,

  'bcrypt.compare': `// bcrypt.compare — from 'bcryptjs'
const match = await bcrypt.compare(
  plainPassword,   // from request body
  hashedPassword   // stored in DB
);
// returns true if match, false otherwise`,

  'jwt.sign': `// jwt.sign — from 'jsonwebtoken'
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);`,

  "res.json({token,user})": `// Final response sent to client
res.status(200).json({
  token,           // JWT for auth headers
  user: {
    id: user._id,
    email: user.email,
    name: user.name,
  }
});`,

  "navigate('/dashboard')": `// React Router navigation
// Called after successful login
navigate('/dashboard', {
  replace: true,   // removes /login from history
  state: { fromLogin: true },
});`,

  'handleCheckout': `async function handleCheckout(cartItems) {
  const valid = validateCart(cartItems);
  if (!valid) return;

  const res = await fetch('/api/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cartItems }),
  });
  const data = await res.json();
  navigate('/order-confirmation/' + data.orderId);
}`,

  'validateCart': `function validateCart(items) {
  if (!items || items.length === 0) {
    setError('Cart is empty');
    return false;
  }
  const hasInvalid = items.some(
    i => !i.id || i.qty < 1
  );
  if (hasInvalid) {
    setError('Invalid item in cart');
    return false;
  }
  return true;
}`,

  'POST /api/orders': `router.post('/create',
  authenticate,
  orderController.create
);`,

  'OrderService.create': `exports.createOrder = async (data) => {
  const order = await Order.create({
    items: data.items,
    user: data.userId,
    status: 'pending',
  });
  await PaymentService.charge(order.total);
  await InventoryService.deduct(order.items);
  return order;
};`,

  'PaymentService.charge': `exports.charge = async (amount) => {
  const intent = await stripe.paymentIntents
    .create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    });
  return intent;
};`,

  'InventoryService.deduct': `exports.deduct = async (items) => {
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.id,
      { $inc: { stock: -item.qty } },
      { new: true }
    );
  }
};`,

  "res.json({orderId})": `res.status(201).json({
  orderId: order._id,
  status: order.status,
  total: order.total,
});`,

  'handleSearch': `function handleSearch(query) {
  const debounced = debounce(query, 300);
  fetch('/api/search?q=' + debounced)
    .then(r => r.json())
    .then(data => setResults(data.results));
}`,

  'debounce': `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(
      () => fn(...args), delay
    );
  };
}`,

  'GET /api/search': `router.get('/',
  cacheMiddleware(60),
  searchController.query
);`,

  'SearchService.query': `exports.query = async (params) => {
  const { q, page = 1, limit = 20 } = params;
  const results = await Product.find({
    $text: { $search: q }
  })
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();
  return { results, total: results.length };
};`,

  'db.collection.find': `// MongoDB query
db.products.find({
  $text: { $search: query },
  stock: { $gt: 0 },
})
.sort({ score: { $meta: 'textScore' } })
.limit(20)`,

  "res.json({results})": `res.status(200).json({
  results,
  total,
  page,
  hasMore: total === limit,
});`,

  'setResults': `// React state update
setResults(data.results);
setTotal(data.total);
setLoading(false);`,
};

function getCode(node) {
  return MOCK_CODE[node.label] || `// ${node.file}
// Function: ${node.label}
// Line: ${node.line}

// Source code not available in mock mode.
// In production this would show the real
// file contents fetched from your repository.`;
}

// Very simple syntax highlighter — colours keywords, strings, comments
function highlight(code) {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    const isComment = line.trim().startsWith('//');
    let content = line;

    if (isComment) {
      return (
        <span key={i} style={{ color: '#475569' }}>
          {line}{'\n'}
        </span>
      );
    }

    // Colour keywords
    const keywords = ['async','function','const','let','var','return','await',
      'if','else','for','of','try','catch','export','exports','import','new',
      'true','false','null','undefined','throw'];

    const parts = line.split(/(\b(?:async|function|const|let|var|return|await|if|else|for|of|try|catch|export|exports|import|new|true|false|null|undefined|throw)\b|'[^']*'|"[^"]*"|`[^`]*`)/g);

    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (keywords.includes(part.trim())) {
            return <span key={j} style={{ color: '#c084fc' }}>{part}</span>;
          }
          if (/^['"`]/.test(part)) {
            return <span key={j} style={{ color: '#86efac' }}>{part}</span>;
          }
          return <span key={j} style={{ color: '#e2e8f0' }}>{part}</span>;
        })}
        {'\n'}
      </span>
    );
  });
}

export default function CodePanel({ node, onClose }) {
  const t      = TYPE_COLOR[node.type] || '#7F77DD';
  const code   = getCode(node);
  const lines  = code.split('\n');

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(7,13,26,0.95)',
      fontFamily: 'JetBrains Mono, monospace',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(71,85,105,0.3)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            color: t,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {node.type}
          </span>
          <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>
            {node.label}
          </span>
          <span style={{ fontSize: 10, color: '#475569' }}>
            {node.file} · line {node.line}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
            padding: '4px 6px',
          }}
        >
          ✕
        </button>
      </div>

      {/* File path bar */}
      <div style={{
        padding: '6px 16px',
        background: 'rgba(15,23,42,0.8)',
        borderBottom: '1px solid rgba(71,85,105,0.2)',
        fontSize: 10,
        color: '#64748b',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: t, display: 'inline-block', flexShrink: 0,
        }} />
        {node.file}
      </div>

      {/* Code block with line numbers */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
      }}>
        {/* Line numbers */}
        <div style={{
          padding: '16px 0',
          minWidth: 36,
          background: 'rgba(15,23,42,0.6)',
          borderRight: '1px solid rgba(71,85,105,0.15)',
          textAlign: 'right',
          userSelect: 'none',
          flexShrink: 0,
        }}>
          {lines.map((_, i) => (
            <div key={i} style={{
              fontSize: 11,
              color: '#334155',
              lineHeight: '1.6',
              paddingRight: 10,
              paddingLeft: 8,
            }}>
              {node.line + i}
            </div>
          ))}
        </div>

        {/* Code */}
        <pre style={{
          margin: 0,
          padding: '16px 20px',
          fontSize: 12,
          lineHeight: '1.6',
          overflowX: 'auto',
          flex: 1,
          whiteSpace: 'pre',
          color: '#e2e8f0',
        }}>
          {highlight(code)}
        </pre>
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid rgba(71,85,105,0.2)',
        fontSize: 10,
        color: '#334155',
        flexShrink: 0,
        display: 'flex',
        gap: 16,
      }}>
        <span>{lines.length} lines</span>
        <span style={{ color: t }}>{node.type}</span>
        <span>mock mode — connect repo for live code</span>
      </div>
    </div>
  );
}