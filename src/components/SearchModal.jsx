import { useState, useEffect, useRef } from 'react';
import { ALL_PAGES } from '../nav.js';

export default function SearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [docsContent, setDocsContent] = useState(null);
  const inputRef = useRef(null);

  // Fetch all docs content on first mount
  useEffect(() => {
    let mounted = true;
    async function loadDocs() {
      try {
        const fetches = ALL_PAGES.map(async page => {
          const res = await fetch(page.file);
          if (!res.ok) return { ...page, text: '' };
          const text = await res.text();
          // Strip basic markdown syntax for cleaner search text
          const cleanText = text
            .replace(/```[\s\S]*?```/g, ' ') // remove code blocks
            .replace(/[#*`_\[\]()]/g, ' ') // remove some formatting
            .toLowerCase();
          return { ...page, text: cleanText, originalText: text };
        });
        const docs = await Promise.all(fetches);
        if (mounted) setDocsContent(docs);
      } catch (err) {
        console.error("Failed to load search index", err);
      }
    }
    loadDocs();
    return () => { mounted = false; };
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle search logic
  useEffect(() => {
    if (!query.trim() || !docsContent) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Find matching docs
    const matches = docsContent
      .map(doc => {
        // Boost score if title matches
        const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
        
        // Find snippet if body matches
        const bodyIndex = doc.text.indexOf(lowerQuery);
        let snippet = null;
        
        if (bodyIndex !== -1) {
          // Extract a ~80 char snippet around the match
          const start = Math.max(0, bodyIndex - 40);
          const end = Math.min(doc.text.length, bodyIndex + lowerQuery.length + 40);
          snippet = "..." + doc.text.substring(start, end).replace(/\s+/g, ' ') + "...";
        }
        
        if (titleMatch || bodyIndex !== -1) {
          return {
            ...doc,
            snippet,
            score: titleMatch ? 10 : 1 // Simple ranking
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    setResults(matches);
  }, [query, docsContent]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search documentation..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="search-close-btn" onClick={onClose}>ESC</button>
        </div>
        
        <div className="search-results">
          {!docsContent ? (
            <div className="search-state-msg">Loading search index...</div>
          ) : query.trim() && results.length === 0 ? (
            <div className="search-state-msg">No results found for "{query}"</div>
          ) : !query.trim() ? (
            <div className="search-state-msg">Type to start searching...</div>
          ) : (
            <ul className="search-results-list">
              {results.map((res, i) => (
                <li key={res.id}>
                  <button 
                    className="search-result-item" 
                    onClick={() => {
                      onNavigate(res);
                      onClose();
                    }}
                  >
                    <div className="search-result-title">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      {res.title}
                    </div>
                    {res.snippet && (
                      <div className="search-result-snippet">
                        {/* Highlight the matching part in the snippet */}
                        {res.snippet.split(new RegExp(`(${query})`, 'gi')).map((part, index) => 
                          part.toLowerCase() === query.toLowerCase() 
                            ? <mark key={index}>{part}</mark> 
                            : part
                        )}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
