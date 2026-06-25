import { useState } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const [pkgManager, setPkgManager] = useState("pkt");
  const cmds = {
    pkt: "pkt add vibe-gx",
    npm: "npm install vibe-gx",
    pnpm: "pnpm add vibe-gx",
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="logo-text">
            Vibe<span className="logo-gx">-GX</span>
          </span>
        </div>
        <div className="landing-nav-links">
          <Link to="/docs#getting-started" className="nav-btn primary">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="btn-icon"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span className="btn-text">Documentation</span>
          </Link>
          <a
            href="https://github.com/thesixers/vibe"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn secondary"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="btn-icon"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span className="btn-text">GitHub</span>
          </a>
        </div>
      </nav>

      <main className="landing-main">
        <header className="hero-section">
          <h1 className="hero-title">
            The Sub-Millisecond
            <br />
            <span className="hero-highlight">Node.js Framework</span>
          </h1>
          <p className="hero-subtitle">
            Minimalist, high-performance HTTP framework designed for speed and
            simplicity. Zero dependencies, O(log n) routing, and out-of-the-box
            schema serialization.
          </p>
          {/* <div className="hero-cta">
            <div className="quick-start-card">
              <div className="qs-terminal">
                <div className="pkg-tabs">
                  {Object.keys(cmds).map(mgr => (
                    <button 
                      key={mgr} 
                      className={`pkg-tab ${pkgManager === mgr ? 'active' : ''}`}
                      onClick={() => setPkgManager(mgr)}
                    >
                      {mgr}
                    </button>
                  ))}
                </div>
                <div className="code-install">
                  <code style={{display: 'flex', gap: '12px'}}>
                    <span style={{color: 'var(--text-muted)', userSelect: 'none'}}>$</span>
                    {cmds[pkgManager]}
                  </code>
                  <button 
                    className="copy-btn" 
                    onClick={() => navigator.clipboard.writeText(cmds[pkgManager])}
                    aria-label="Copy command"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <Link to="/docs#getting-started" className="qs-btn">
                <span>Get Started</span>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div> */}
        </header>

        <section className="bento-grid">
          <div className="bento-card">
            <div className="bento-icon">⚡</div>
            <h3>O(log n) Routing</h3>
            <p>
              Radix-trie based dynamic routing ensures maximum performance even
              with thousands of parameterized routes.
            </p>
          </div>
          <div className="bento-card">
            <div className="bento-icon">📦</div>
            <h3>Zero Dependencies</h3>
            <p>
              Built purely on top of the native Node.js HTTP module. No bloat,
              no vulnerabilities, just raw speed.
            </p>
          </div>
          <div className="bento-card">
            <div className="bento-icon">🔄</div>
            <h3>Schema Serialization</h3>
            <p>
              First-class support for fast JSON serialization. Automatically
              strips sensitive data before the response is sent.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
