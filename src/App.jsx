import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocsLayout from './components/DocsLayout.jsx';
import Landing from './components/Landing.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs/*" element={<DocsLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
