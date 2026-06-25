import './style.css';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// Navigation Structure
const navStructure = [
  {
    group: 'Introduction',
    items: [
      { id: 'index', title: 'Overview', file: '/docs/index.md' },
      { id: 'getting-started', title: 'Getting Started', file: '/docs/getting-started.md' },
      { id: 'architecture', title: 'Architecture', file: '/docs/architecture.md' }
    ]
  },
  {
    group: 'HTTP Layer',
    items: [
      { id: 'routing', title: 'Routing', file: '/docs/routing.md' },
      { id: 'request', title: 'Request', file: '/docs/request.md' },
      { id: 'response', title: 'Response', file: '/docs/response.md' }
    ]
  },
  {
    group: 'Middleware',
    items: [
      { id: 'interceptors', title: 'Interceptors', file: '/docs/interceptors.md' },
      { id: 'plugins', title: 'Plugins', file: '/docs/plugins.md' },
      { id: 'decorators', title: 'Decorators', file: '/docs/decorators.md' }
    ]
  },
  {
    group: 'Features',
    items: [
      { id: 'logging', title: 'Logging', file: '/docs/logging.md' },
      { id: 'error-handling', title: 'Error Handling', file: '/docs/error-handling.md' },
      { id: 'file-uploads', title: 'File Uploads', file: '/docs/file-uploads.md' },
      { id: 'static-files', title: 'Static Files', file: '/docs/static-files.md' }
    ]
  },
  {
    group: 'Performance',
    items: [
      { id: 'caching', title: 'Caching', file: '/docs/caching.md' },
      { id: 'rate-limiting', title: 'Rate Limiting', file: '/docs/rate-limiting.md' },
      { id: 'cors', title: 'CORS', file: '/docs/cors.md' },
      { id: 'clustering', title: 'Clustering', file: '/docs/clustering.md' },
      { id: 'schema-serialization', title: 'Schema Serialization', file: '/docs/schema-serialization.md' }
    ]
  }
];

// Flat list of items for quick lookup
const allPages = navStructure.flatMap(group => group.items);

// Configure marked to use highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {}
    }
    return code; // use external default escaping
  },
  langPrefix: 'hljs language-',
});

// Custom renderer for markdown links to rewrite .md links to hashes
const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  if (href.endsWith('.md')) {
    // e.g., "./getting-started.md" -> "#getting-started"
    const hash = href.split('/').pop().replace('.md', '');
    return `<a href="#${hash}">${text}</a>`;
  }
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};
marked.use({ renderer });

// Build Sidebar Navigation
function renderSidebar() {
  const container = document.getElementById('nav-groups');
  container.innerHTML = navStructure.map(group => `
    <div class="nav-group">
      <h3>${group.group}</h3>
      <ul>
        ${group.items.map(item => `
          <li>
            <a href="#${item.id}" class="nav-link" data-id="${item.id}">${item.title}</a>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

// Fetch and render markdown
async function loadContent(id) {
  const page = allPages.find(p => p.id === id) || allPages[0];
  const contentEl = document.getElementById('content');
  
  contentEl.innerHTML = '<div class="loader">Loading...</div>';
  
  try {
    const res = await fetch(page.file);
    if (!res.ok) throw new Error('Failed to load content');
    const md = await res.text();
    contentEl.innerHTML = marked.parse(md);
    
    // Add copy buttons to code blocks
    addCopyButtons();
    
    // Update active nav state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.id === page.id);
    });
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Close mobile menu if open
    document.getElementById('sidebar').classList.remove('open');
  } catch (error) {
    contentEl.innerHTML = `<div class="error-msg">Error loading page: ${error.message}</div>`;
  }
}

function addCopyButtons() {
  document.querySelectorAll('pre').forEach(pre => {
    // Only add button if it's a code block
    if (!pre.querySelector('code')) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
    
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code').innerText;
      try {
        await navigator.clipboard.writeText(code);
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
    
    wrapper.appendChild(btn);
  });
}

// Router
function handleRoute() {
  const hash = window.location.hash.slice(1);
  loadContent(hash || 'index');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // initial load
  
  // Mobile menu toggle
  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
});
