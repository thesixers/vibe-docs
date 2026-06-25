import { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import DocContent from './DocContent.jsx';
import SearchModal from './SearchModal.jsx';
import { ALL_PAGES } from '../nav.js';

function getPageFromHash() {
  const hash = window.location.hash.slice(1);
  return ALL_PAGES.find(p => p.id === hash) || ALL_PAGES[0];
}

export default function DocsLayout() {
  const [currentPage, setCurrentPage] = useState(getPageFromHash);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleHashChange() {
      setCurrentPage(getPageFromHash());
      setSidebarOpen(false);
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (!searchOpen) {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  function navigate(page) {
    window.location.hash = page.id;
    setCurrentPage(page);
    setSidebarOpen(false);
  }

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <main className="main-content">
        <Topbar 
          onMenuClick={() => setSidebarOpen(o => !o)} 
          onSearchClick={() => setSearchOpen(true)}
        />
        <DocContent page={currentPage} onNavigate={navigate} />
      </main>
      
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onNavigate={navigate}
      />
    </div>
  );
}
