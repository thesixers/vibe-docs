import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { ALL_PAGES } from '../nav.js';

// Custom renderer — rewrites .md links to hash links
const renderer = new marked.Renderer();
renderer.link = function ({ href, text }) {
  if (href && href.endsWith('.md')) {
    const hash = href.split('/').pop().replace('.md', '');
    return `<a href="#${hash}" class="doc-link" data-page="${hash}">${text}</a>`;
  }
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="ext-link">${text}</a>`;
};

marked.use({ renderer, breaks: false, gfm: true });

export default function DocContent({ page, onNavigate }) {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setHtml('');

    const fileUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}${page.file}`;
    fetch(fileUrl)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(md => { if (!cancelled) { setHtml(marked.parse(md)); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [page.id]);

  // After HTML is set, apply hljs, inject copy buttons, wire doc-links
  useEffect(() => {
    const el = contentRef.current;
    if (!el || loading || !html) return;

    // Syntax highlight
    el.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block);
    });

    // Inject copy buttons — wrap each pre in .code-wrapper (only once)
    el.querySelectorAll('pre').forEach(pre => {
      if (pre.parentElement.classList.contains('code-wrapper')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = copyIcon();
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        if (!code) return;
        navigator.clipboard.writeText(code.innerText).then(() => {
          btn.innerHTML = checkIcon();
          btn.classList.add('copied');
          setTimeout(() => { btn.innerHTML = copyIcon(); btn.classList.remove('copied'); }, 2000);
        });
      });
      wrapper.appendChild(btn);
    });

    // Inject table wrappers (only once)
    el.querySelectorAll('table').forEach(table => {
      if (table.parentElement.classList.contains('table-wrapper')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // Wire internal doc links
    el.querySelectorAll('a.doc-link[data-page]').forEach(link => {
      const id = link.dataset.page;
      const target = ALL_PAGES.find(p => p.id === id);
      if (!target) return;
      link.addEventListener('click', e => {
        e.preventDefault();
        onNavigate(target);
      });
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [html, loading]);

  if (loading) {
    return (
      <div className="content-area">
        <div className="loading-state">
          <div className="spinner" />
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <div className="error-state">
          <h2>Failed to load page</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <article
        className="doc-article"
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <PageFooter page={page} onNavigate={onNavigate} />
    </div>
  );
}

function copyIcon() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
}

function checkIcon() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
}

function PageFooter({ page, onNavigate }) {
  const idx = ALL_PAGES.findIndex(p => p.id === page.id);
  const prev = idx > 0 ? ALL_PAGES[idx - 1] : null;
  const next = idx < ALL_PAGES.length - 1 ? ALL_PAGES[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="page-footer-nav">
      <div className="footer-nav-inner">
        {prev ? (
          <button className="footer-nav-btn prev" onClick={() => onNavigate(prev)}>
            <span className="footer-nav-dir">← Previous</span>
            <span className="footer-nav-title">{prev.title}</span>
          </button>
        ) : <span />}
        {next ? (
          <button className="footer-nav-btn next" onClick={() => onNavigate(next)}>
            <span className="footer-nav-dir">Next →</span>
            <span className="footer-nav-title">{next.title}</span>
          </button>
        ) : <span />}
      </div>
    </nav>
  );
}
