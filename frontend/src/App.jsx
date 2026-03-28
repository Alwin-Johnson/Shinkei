import { useState } from 'react';
import RepoInput from './components/RepoInput';
import FlowViewer from './components/FlowViewer';
import StatsBar from './components/StatsBar';

const MOCK_FLOWS = {
  login: [
    { type: "event",    label: "onClick → Login Button",          file: "LoginForm.jsx",                 line: 42 },
    { type: "function", label: "handleSubmit(e)",                 file: "LoginForm.jsx",                 line: 18 },
    { type: "function", label: "validateCredentials(form)",       file: "auth/utils.js",                 line: 7  },
    { type: "function", label: "loginUser(email, password)",      file: "auth/api.js",                   line: 23 },
    { type: "api",      label: "POST /api/auth/login",            file: "routes/auth.js",                line: 1  },
    { type: "route",    label: "authRouter.post('/login')",       file: "controllers/authController.js", line: 55 },
    { type: "function", label: "authController.login(req, res)",  file: "controllers/authController.js", line: 55 },
    { type: "function", label: "UserService.findByEmail(email)",  file: "services/userService.js",       line: 12 },
    { type: "function", label: "bcrypt.compare(password, hash)",  file: "services/userService.js",       line: 19 },
    { type: "function", label: "jwt.sign(payload, secret)",       file: "services/authService.js",       line: 8  },
    { type: "response", label: "res.json({ token, user })",       file: "controllers/authController.js", line: 78 },
    { type: "function", label: "navigate('/dashboard')",          file: "LoginForm.jsx",                 line: 31 },
  ],
  checkout: [
    { type: "event",    label: "onClick → Place Order Button",    file: "Checkout.jsx",                  line: 87 },
    { type: "function", label: "handleCheckout(cartItems)",       file: "Checkout.jsx",                  line: 54 },
    { type: "function", label: "validateCart(items)",             file: "cart/utils.js",                 line: 3  },
    { type: "api",      label: "POST /api/orders/create",         file: "routes/orders.js",              line: 1  },
    { type: "route",    label: "orderRouter.post('/create')",     file: "controllers/orderController.js",line: 11 },
    { type: "function", label: "OrderService.createOrder(data)",  file: "services/orderService.js",      line: 22 },
    { type: "function", label: "PaymentService.charge(amount)",   file: "services/paymentService.js",    line: 8  },
    { type: "function", label: "InventoryService.deduct(items)",  file: "services/inventoryService.js",  line: 15 },
    { type: "response", label: "res.json({ orderId, status })",   file: "controllers/orderController.js",line: 45 },
    { type: "function", label: "navigate('/order-confirmation')", file: "Checkout.jsx",                  line: 72 },
  ],
  search: [
    { type: "event",    label: "onSubmit → Search Form",          file: "SearchBar.jsx",                 line: 29 },
    { type: "function", label: "handleSearch(query)",             file: "SearchBar.jsx",                 line: 14 },
    { type: "function", label: "debounce(query, 300ms)",          file: "hooks/useSearch.js",            line: 5  },
    { type: "api",      label: "GET /api/search?q={query}",       file: "routes/search.js",              line: 1  },
    { type: "route",    label: "searchRouter.get('/')",           file: "controllers/searchController.js",line: 8 },
    { type: "function", label: "SearchService.query(params)",     file: "services/searchService.js",     line: 18 },
    { type: "function", label: "db.collection.find(filter)",      file: "models/Product.js",             line: 34 },
    { type: "response", label: "res.json({ results, total })",    file: "controllers/searchController.js",line: 27 },
    { type: "function", label: "setResults(data.results)",        file: "SearchBar.jsx",                 line: 22 },
  ],
};

function resolveFlowKey(url, fnText) {
  const combined = (url + fnText).toLowerCase();
  if (combined.includes('shop') || combined.includes('checkout') || combined.includes('order')) return 'checkout';
  if (combined.includes('search')) return 'search';
  return 'login';
}

function App() {
  const [flow, setFlow]       = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Make the function async
 const handleAnalyze = async (url, fnText) => {
    setFlow(null);
    setLoading(true);

    try {
        // STEP 1: Upload and get the local repoPath
        const uploadRes = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoUrl: url }), // Matches your uploadRepo controller
        });
        const uploadData = await uploadRes.json();

        if (!uploadData.success) throw new Error(uploadData.error);

        // STEP 2: Use the returned repoPath to Analyze
        const analyzeRes = await fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                repoPath: uploadData.repoPath, // The "Secret Sauce"
                entryFunction: fnText 
            }),
        });
        const analyzeData = await analyzeRes.json();

        if (analyzeData.success) {
            setFlow(analyzeData.flow);
        } else {
            throw new Error(analyzeData.error);
        }

    } catch (error) {
        console.error("Pipeline Error:", error);
        alert(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="app-shell">
      <div className="orb orb-purple" />
      <div className="orb orb-blue" />
      <div className="orb orb-green" />
      <div className="grid-overlay" />

      <div className="content-wrap">
        <header className="app-header">
          <div className="badge">⬡ Static AST Analysis Engine</div>
          <h1 className="app-title">
            <span className="title-accent">SHINKEI</span>
          </h1>
          <p className="app-kanji">神経 / Execution Flow Visualizer</p>
          <p className="app-subtitle">
            Trace every step from frontend interaction to backend response.
            Zero runtime overhead.
          </p>
        </header>

        <main className="app-main">
          <RepoInput onAnalyze={handleAnalyze} loading={loading} />

          {flow && !loading && <StatsBar flow={flow} />}

          <FlowViewer flowData={flow} loading={loading} />
        </main>
      </div>
    </div>
  );
}

export default App;
