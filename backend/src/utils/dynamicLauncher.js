const fs = require("fs-extra");
const path = require("path");
const net = require("net");
const { execSync, exec } = require("child_process");

const { index } = require("../services/indexBuilder"); 
const sseService = require("../services/sseService"); 
const { TRACING_CODE, REQUIRE_HOOK_CODE } = require("./tracingTemplates");
const { BABEL_PLUGIN_CODE, CLIENT_SCRIPT_CODE } = require("./domTemplates"); // 👈 Your new templates safely imported here

let activeProcesses = [];

function findFreePort(startPort) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(startPort, () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
        server.on('error', () => resolve(findFreePort(startPort + 1)));
    });
}

async function stopActiveProcesses() {
    if (activeProcesses.length === 0) return;
    
    console.log(`🛑 Stopping ${activeProcesses.length} active processes...`);
    for (const proc of activeProcesses) {
        if (proc && !proc.killed) {
            try {
                if (process.platform === 'win32') {
                    execSync(`taskkill /pid ${proc.pid} /f /t`);
                } else {
                    proc.kill('SIGTERM');
                }
            } catch (e) { } // Ignore if already dead
        }
    }
    activeProcesses = [];
    console.log("✅ All target processes stopped.");
}

async function getEntryPoint(repoRoot) {
    const searchDirs = [repoRoot, path.join(repoRoot, 'server'), path.join(repoRoot, 'backend'), path.join(repoRoot, 'api')];

    for (const dir of searchDirs) {
        if (!await fs.pathExists(dir)) continue;

        const pkgPath = path.join(dir, 'package.json');
        if (await fs.pathExists(pkgPath)) {
            const pkg = await fs.readJson(pkgPath);
            if (pkg.main && await fs.pathExists(path.join(dir, pkg.main))) return path.join(dir, pkg.main);
            if (pkg.scripts?.start) {
                const match = pkg.scripts.start.match(/(?:node|nodemon|ts-node)\s+(.+)/);
                if (match && match[1]) {
                    const fullPath = path.join(dir, match[1].trim().split(' ')[0].replace(/['"]/g, ''));
                    if (await fs.pathExists(fullPath)) return fullPath;
                }
            }
        }

        const fallbacks = ['index.js', 'app.js', 'server.js', 'src/index.js', 'src/server.js'];
        for (const f of fallbacks) {
            const fullPath = path.join(dir, f);
            if (await fs.pathExists(fullPath)) return fullPath;
        }
    }
    throw new Error("Shinkei could not find a backend entry point.");
}

async function launchFrontend(repoRoot, options = {}) {
    const candidates = ['frontend', 'client', 'web', 'ui', '.'];
    let frontendPath = null;
    let startCommand = 'npm start';
    const FE_PORT = options.frontendPort;
    const BE_PORT = options.backendPort;

    for (const dir of candidates) {
        const checkPath = path.join(repoRoot, dir, 'package.json');
        if (await fs.pathExists(checkPath)) {
            frontendPath = path.join(repoRoot, dir);
            const pkg = await fs.readJson(checkPath);
            if (pkg.scripts && pkg.scripts.dev) startCommand = 'npm run dev';
            break;
        }
    }

    if (!frontendPath) return null;

    if (!fs.existsSync(path.join(frontendPath, 'node_modules'))) {
        console.log(`📦 [Shinkei] Installing dependencies in ${frontendPath}...`);
        execSync('npm install --no-audit --no-fund', { cwd: frontendPath, stdio: 'inherit' });
    }

    let finalCommand = startCommand.startsWith('npm') ? `${startCommand} -- --port ${FE_PORT}` : startCommand;

    const interceptorScript = `
    <script>
      (function() {
        const BE_PORT = '${BE_PORT}';
        const BACKEND_URL = 'http://' + window.location.hostname + ':' + BE_PORT;
        console.log('💉 [Shinkei] Interceptor Active: Routing API traffic to ' + BACKEND_URL);

        const rewrite = (url) => {
          if (typeof url === 'string' && (url.startsWith('/api') || url.startsWith('api/'))) {
             const normalized = url.startsWith('/') ? url : '/' + url;
             return BACKEND_URL + normalized;
          }
          return url;
        };

        const origFetch = window.fetch;
        window.fetch = (url, init) => origFetch(rewrite(url), init);
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(m, url) {
          return origOpen.apply(this, [m, rewrite(url), ...Array.from(arguments).slice(2)]);
        };
      })();
    </script>`;

    const htmlFiles = [
        path.join(frontendPath, 'public', 'index.html'),
        path.join(frontendPath, 'index.html'),
        path.join(frontendPath, 'src', 'index.html')
    ];

    for (const file of htmlFiles) {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            if (!content.includes('BACKEND_URL')) {
                content = content.replace('</head>', interceptorScript + '</head>');
                fs.writeFileSync(file, content);
                console.log("[Shinkei] ✅ Injected Network Interceptor into " + path.basename(file));
            }
        }
    }

    console.log(`🚀 Launching Frontend on PORT ${FE_PORT}...`);
    const child = exec(finalCommand, {
        cwd: frontendPath,
        env: { 
            ...process.env, PORT: FE_PORT, BROWSER: 'none', 
            REACT_APP_API_URL: `http://localhost:${BE_PORT}`, VITE_API_URL: `http://localhost:${BE_PORT}`
        }
    });

    const openCommand = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    setTimeout(() => {
        console.log(`🌐 Opening target app at http://localhost:${FE_PORT}...`);
        exec(`${openCommand} http://localhost:${FE_PORT}`);
        sseService.broadcast({ type: 'app_opened', url: `http://localhost:${FE_PORT}` });
    }, 3000);

    child.stdout.on('data', (data) => console.log(`[Target Frontend]: ${data.trim()}`));
    return child;
}

async function runDynamicEnvironment(repoRoot, options = {}) {
    try {
        await stopActiveProcesses(); 
        console.log("🛠️  Preparing Dynamic Tracing Infrastructure...");

        const BE_PORT = await findFreePort(options.backendPort || 8000);
        const FE_PORT = await findFreePort(options.frontendPort || 3000);

        console.log(`📡 Allocated Ports: Backend=${BE_PORT}, Frontend=${FE_PORT}`);

        // --- 1. INJECT OTEL TRACING ---
        await fs.writeFile(path.join(repoRoot, "tracing.js"), TRACING_CODE);
        await fs.writeFile(path.join(repoRoot, "requireHook.js"), REQUIRE_HOOK_CODE);

        // --- 2. INJECT SHINKEI DOM TRACKERS ---
        // Drop the Babel plugin into their root folder
        await fs.writeFile(path.join(repoRoot, "shinkei-babel-plugin.js"), BABEL_PLUGIN_CODE);
        
        // Drop the Client Script into their public/ folder so their index.html can load it
        const publicDir = path.join(repoRoot, "public");
        if (await fs.pathExists(publicDir)) {
            await fs.writeFile(path.join(publicDir, "shinkei-client.js"), CLIENT_SCRIPT_CODE);
            console.log("✅ [Shinkei] Injected Client Script into public folder.");
        }

        // --- 3. BUILD AST MAP ---
        const astMap = {};
        for (const [relativePath, data] of index.files.entries()) {
            if (data.functions) {
                data.functions.forEach(fn => {
                    const isAnon = !fn.name || fn.name.includes('anonymous');
                    if (!isAnon) {
                        astMap[relativePath + ":" + fn.name] = { file: relativePath, line: fn.startLine, name: fn.name };
                    }
                });
            }
        }
        await fs.writeJson(path.join(repoRoot, "ast_map.json"), astMap);

        // --- 4. LAUNCH BACKEND ---
        const globalNodeModules = execSync('npm root -g').toString().trim();
        const entryFile = await getEntryPoint(repoRoot);

        console.log(`🚀 Launching Backend (${entryFile}) on PORT ${BE_PORT}...`);
        const backendProcess = exec(`node --require ./tracing.js --require ./requireHook.js ${entryFile}`, { 
            cwd: repoRoot,
            env: { ...process.env, NODE_PATH: globalNodeModules, PORT: BE_PORT, SHINKEI_REPO_ROOT: repoRoot }
        });

        activeProcesses.push(backendProcess); 
        backendProcess.stdout.on('data', (data) => console.log(`[Target Backend]: ${data.trim()}`));

        // --- 5. LAUNCH FRONTEND ---
        const frontendProcess = await launchFrontend(repoRoot, { frontendPort: FE_PORT, backendPort: BE_PORT });
        if (frontendProcess) activeProcesses.push(frontendProcess); 

    } catch (err) {
        console.error("❌ Dynamic setup failed:", err.message);
    }
}

module.exports = { runDynamicEnvironment, stopActiveProcesses };