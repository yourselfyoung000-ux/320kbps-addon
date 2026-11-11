export function renderHomeHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#050505" />
    <title>320kbps Addon</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" />
    <style>
      :root {
        color-scheme: dark;
        --bg: #050505;
        --surface: rgba(18, 18, 18, 0.75);
        --surface-solid: #0e0e0e;
        --surface-hover: rgba(255, 255, 255, 0.05);
        --border: rgba(255, 255, 255, 0.1);
        --border-hover: rgba(255, 255, 255, 0.25);
        --text: #f4f4f4;
        --text-secondary: #b0b0b0;
        --text-muted: #888888;
        --accent: #ffffff;
        --accent-text: #000000;
        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 16px;
        --font-sans: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
      }

      *, *::before, *::after { box-sizing: border-box; }
      [hidden] { display: none !important; }

      body {
        margin: 0;
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font: 400 14px/1.6 var(--font-sans);
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 48px 48px;
        mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, #000 20%, transparent 80%);
        pointer-events: none;
        z-index: -1;
      }

      .navbar {
        position: sticky;
        top: 0;
        backdrop-filter: blur(16px);
        background: rgba(5, 5, 5, 0.85);
        border-bottom: 1px solid var(--border);
        z-index: 50;
        padding: 0 24px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: inherit;
      }

      .eq-mark {
        display: inline-flex;
        align-items: flex-end;
        gap: 2.5px;
        height: 18px;
        padding: 0 2px;
      }

      .eq-mark i {
        display: block;
        width: 3px;
        background: #fff;
        border-radius: 1px;
        animation: eqPulse 1.2s ease-in-out infinite alternate;
      }
      .eq-mark i:nth-child(1) { height: 7px; animation-delay: 0.1s; }
      .eq-mark i:nth-child(2) { height: 16px; animation-delay: 0.3s; }
      .eq-mark i:nth-child(3) { height: 11px; animation-delay: 0.2s; }
      .eq-mark i:nth-child(4) { height: 14px; animation-delay: 0.4s; }

      @keyframes eqPulse {
        from { transform: scaleY(0.4); opacity: 0.6; }
        to { transform: scaleY(1.05); opacity: 1; }
      }

      .brand-title {
        font-weight: 600;
        font-size: 15px;
        letter-spacing: -0.01em;
      }

      .badge {
        font-size: 11px;
        font-family: var(--font-mono);
        padding: 2px 7px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--text-secondary);
      }
      .badge.ok {
        border-color: rgba(255, 255, 255, 0.3);
        color: #fff;
      }

      .nav-tabs {
        display: flex;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 3px;
        gap: 4px;
      }

      .nav-tab {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font: 500 13px var(--font-sans);
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .nav-tab:hover {
        color: #fff;
      }

      .nav-tab.active {
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
      }

      .container {
        max-width: 1040px;
        margin: 0 auto;
        padding: 48px 24px 80px;
      }

      .hero {
        text-align: center;
        margin-bottom: 48px;
      }

      .hero h1 {
        font-size: 40px;
        font-weight: 700;
        letter-spacing: -0.03em;
        margin: 0 0 12px;
        background: linear-gradient(180deg, #ffffff 40%, #a0a0a0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .hero p {
        font-size: 17px;
        color: var(--text-secondary);
        max-width: 620px;
        margin: 0 auto 20px;
      }

      .hero-badges {
        display: flex;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 24px;
        margin-bottom: 24px;
        transition: border-color 0.2s ease;
      }
      .card:hover {
        border-color: var(--border-hover);
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .card-title {
        font-size: 15px;
        font-weight: 600;
        margin: 0;
      }

      .addon-box {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #000;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 10px 14px;
        font-family: var(--font-mono);
        font-size: 13px;
        word-break: break-all;
      }

      .addon-url {
        flex: 1;
        color: #fff;
      }

      button.btn, a.btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: #fff;
        color: #000;
        border: none;
        border-radius: var(--radius-sm);
        padding: 8px 16px;
        font: 600 13px var(--font-sans);
        cursor: pointer;
        transition: background 0.15s ease, transform 0.05s ease;
        text-decoration: none;
      }
      button.btn:hover, a.btn:hover {
        background: #e4e4e4;
      }
      button.btn:active, a.btn:active {
        transform: scale(0.98);
      }

      button.btn-secondary {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
        border: 1px solid var(--border);
      }
      button.btn-secondary:hover {
        background: rgba(255, 255, 255, 0.14);
      }

      .grid-2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 20px;
        margin-top: 24px;
      }

      .deploy-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .deploy-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .deploy-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.06);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
      }

      .deploy-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }

      .deploy-desc {
        color: var(--text-secondary);
        font-size: 13px;
        margin: 0 0 16px;
      }

      .code-snippet {
        background: #000;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 10px 14px;
        font-family: var(--font-mono);
        font-size: 12px;
        color: #ddd;
        overflow-x: auto;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .docs-wrap {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 36px;
      }

      @media (max-width: 768px) {
        .docs-wrap {
          grid-template-columns: 1fr;
        }
      }

      .docs-sidebar {
        position: sticky;
        top: 96px;
        align-self: start;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .docs-link {
        color: var(--text-muted);
        text-decoration: none;
        font-size: 13px;
        padding: 6px 12px;
        border-radius: 6px;
        transition: all 0.15s ease;
      }
      .docs-link:hover, .docs-link.active {
        color: #fff;
        background: rgba(255, 255, 255, 0.06);
      }

      .doc-section {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 24px;
        margin-bottom: 24px;
      }

      .endpoint-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }

      .method {
        font-family: var(--font-mono);
        font-size: 11px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
        padding: 3px 8px;
        border-radius: 4px;
      }

      .endpoint-path {
        font-family: var(--font-mono);
        font-size: 15px;
        font-weight: 600;
      }

      .param-table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
        font-size: 13px;
      }
      .param-table th, .param-table td {
        text-align: left;
        padding: 8px 12px;
        border-bottom: 1px solid var(--border);
      }
      .param-table th {
        color: var(--text-muted);
        font-weight: 500;
        font-size: 12px;
      }

      pre {
        background: #000;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 14px;
        font-family: var(--font-mono);
        font-size: 12px;
        overflow-x: auto;
        color: #ddd;
        margin: 10px 0 0;
      }

      .toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #fff;
        color: #000;
        font-weight: 500;
        padding: 10px 18px;
        border-radius: var(--radius-sm);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        opacity: 0;
        transform: translateY(12px);
        transition: all 0.2s ease;
        pointer-events: none;
        z-index: 100;
      }
      .toast.show {
        opacity: 1;
        transform: translateY(0);
      }
    </style>
  </head>
  <body>
    <header class="navbar">
      <a class="brand" href="/">
        <span class="eq-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <span class="brand-title">320kbps Addon</span>
      </a>
      <div class="nav-tabs">
        <button type="button" class="nav-tab active" id="tab-deploy" onclick="switchTab('deploy')">Deploy</button>
        <button type="button" class="nav-tab" id="tab-docs" onclick="switchTab('docs')">API Docs</button>
      </div>
    </header>

    <main class="container">
      <div class="hero">
        <h1>320kbps Addon</h1>
        <p>Streaming addon providing 320 kbps high-bitrate AAC and 96 kbps Data Saver streams with 24-hour edge caching.</p>
        <div class="hero-badges">
          <span class="badge ok">320 kbps</span>
          <span class="badge ok">96 kbps</span>
          <span class="badge ok">24h Cache</span>
          <span class="badge ok">Direct URL</span>
        </div>
      </div>

      <section id="view-deploy">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Addon URL</h2>
            <span class="badge ok">Ready</span>
          </div>
          <p style="color: var(--text-secondary); margin: 0 0 12px; font-size: 13px;">
            Copy this URL directly into your player's addon settings:
          </p>
          <div class="addon-box">
            <span class="addon-url" id="addon-url-text">Loading...</span>
            <button type="button" class="btn" onclick="copyAddonUrl()">Copy URL</button>
          </div>
        </div>

        <div class="grid-2">
          <div class="deploy-card">
            <div>
              <div class="deploy-header">
                <div class="deploy-icon">
                  <svg width="18" height="18" viewBox="0 0 1155 1000" fill="#fff"><path d="m577.3 0 577.4 1000H0z"/></svg>
                </div>
                <h3 class="deploy-title">Vercel</h3>
              </div>
              <p class="deploy-desc">Deploy directly to Vercel's Edge Network.</p>
              <div class="code-snippet">
                <span>npx vercel --prod</span>
                <button type="button" class="badge" onclick="copyText('npx vercel --prod')">Copy</button>
              </div>
            </div>
            <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fajisth69%2F320kbps-addon" target="_blank" rel="noreferrer" class="btn" style="width: 100%;">
              <svg width="14" height="14" viewBox="0 0 1155 1000" fill="#000"><path d="m577.3 0 577.4 1000H0z"/></svg>
              Deploy to Vercel
            </a>
          </div>

          <div class="deploy-card">
            <div>
              <div class="deploy-header">
                <div class="deploy-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
                </div>
                <h3 class="deploy-title">Cloudflare Workers</h3>
              </div>
              <p class="deploy-desc">Deploy directly to Cloudflare's Edge network with 24-hour cache.</p>
              <div class="code-snippet">
                <span>npx wrangler deploy</span>
                <button type="button" class="badge" onclick="copyText('npx wrangler deploy')">Copy</button>
              </div>
            </div>
            <a href="https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fajisth69%2F320kbps-addon" target="_blank" rel="noreferrer" class="btn" style="width: 100%;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
              Deploy to Cloudflare
            </a>
          </div>
        </div>
      </section>

      <section id="view-docs" hidden>
        <div class="docs-wrap">
          <aside class="docs-sidebar">
            <a href="#doc-manifest" class="docs-link active">Manifest</a>
            <a href="#doc-search" class="docs-link">Search</a>
            <a href="#doc-stream" class="docs-link">Stream</a>
            <a href="#doc-prewarm" class="docs-link">Prewarm</a>
            <a href="#doc-health" class="docs-link">Health</a>
          </aside>

          <div class="docs-content">
            <div class="doc-section" id="doc-manifest">
              <div class="endpoint-header">
                <span class="method">GET</span>
                <span class="endpoint-path">/manifest.json</span>
              </div>
              <pre><code>curl -s "https://your-addon-domain/manifest.json"</code></pre>
              <pre><code>{
  "id": "320kbps-addon",
  "name": "320kbps Addon",
  "version": "1.0.0",
  "resources": ["search", "stream"]
}</code></pre>
            </div>

            <div class="doc-section" id="doc-search">
              <div class="endpoint-header">
                <span class="method">GET</span>
                <span class="endpoint-path">/search</span>
              </div>
              <table class="param-table">
                <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
                <tbody>
                  <tr>
                    <td><code>q</code></td>
                    <td>string</td>
                    <td>Search query</td>
                  </tr>
                  <tr>
                    <td><code>quality</code></td>
                    <td>string</td>
                    <td><code>high</code> (320 kbps) or <code>low</code> (96 kbps)</td>
                  </tr>
                </tbody>
              </table>
              <pre><code>curl -s "https://your-addon-domain/search?q=Kesariya&quality=high"</code></pre>
            </div>

            <div class="doc-section" id="doc-stream">
              <div class="endpoint-header">
                <span class="method">GET</span>
                <span class="endpoint-path">/stream/:id</span>
              </div>
              <table class="param-table">
                <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
                <tbody>
                  <tr>
                    <td><code>id</code></td>
                    <td>string</td>
                    <td>Track ID</td>
                  </tr>
                  <tr>
                    <td><code>quality</code></td>
                    <td>string</td>
                    <td><code>high</code> or <code>low</code></td>
                  </tr>
                </tbody>
              </table>
              <pre><code>curl -s "https://your-addon-domain/stream/rjkrTnma?quality=high"</code></pre>
              <pre><code>{
  "url": "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4",
  "codec": "mp4a",
  "format": "mp4",
  "quality": "high",
  "audioQuality": "high",
  "bitrate": 320000,
  "sampleRate": 44100,
  "encrypted": false
}</code></pre>
            </div>

            <div class="doc-section" id="doc-prewarm">
              <div class="endpoint-header">
                <span class="method">GET</span>
                <span class="endpoint-path">/prewarm/:id</span>
              </div>
              <pre><code>{ "state": "started" }</code></pre>
            </div>

            <div class="doc-section" id="doc-health">
              <div class="endpoint-header">
                <span class="method">GET</span>
                <span class="endpoint-path">/health</span>
              </div>
              <pre><code>{ "status": "ok", "service": "jiosaavn-addon", "cacheTtlHours": 24 }</code></pre>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div id="toast" class="toast">Copied to clipboard</div>

    <script>
      function updateAddonUrl() {
        const origin = window.location.origin;
        const box = document.getElementById('addon-url-text');
        if (box) box.textContent = origin;
      }
      updateAddonUrl();

      function switchTab(tab) {
        document.getElementById('view-deploy').hidden = (tab !== 'deploy');
        document.getElementById('view-docs').hidden = (tab !== 'docs');
        document.getElementById('tab-deploy').classList.toggle('active', tab === 'deploy');
        document.getElementById('tab-docs').classList.toggle('active', tab === 'docs');
      }

      function showToast(msg) {
        const t = document.getElementById('toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
      }

      function copyText(str) {
        navigator.clipboard.writeText(str).then(() => {
          showToast('Copied: ' + str);
        }).catch(() => {
          showToast('Failed to copy');
        });
      }

      function copyAddonUrl() {
        copyText(window.location.origin);
      }
    </script>
  </body>
</html>`;
}
