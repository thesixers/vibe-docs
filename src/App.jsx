import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing.jsx';

const DocsLayout = lazy(() => import('./components/DocsLayout.jsx'));

const basename = window.location.pathname.startsWith('/vibegx') ? '/vibegx' : '/';

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Suspense fallback={
        <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading Docs...</span>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs/*" element={<DocsLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
