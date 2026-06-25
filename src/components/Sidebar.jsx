import { Link } from 'react-router-dom';
import { NAV_STRUCTURE } from '../nav.js';

export default function Sidebar({ currentPage, onNavigate, open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <span className="logo-text">Vibe<span className="logo-gx">-GX</span></span>
        </Link>
        <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
          ✕
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_STRUCTURE.map(group => (
          <div key={group.group} className="nav-group">
            <h3 className="nav-group-title">{group.group}</h3>
            <ul className="nav-list">
              {group.items.map(item => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`nav-link ${currentPage.id === item.id ? 'active' : ''}`}
                    onClick={e => { e.preventDefault(); onNavigate(item); }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="version-badge">v4.1.3</span>
      </div>
    </aside>
  );
}
