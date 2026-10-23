import { useEffect, useState } from 'react';
import { href } from '../router.js';

const base = import.meta.env.BASE_URL;

export const NAV = [
  { id: '', label: 'Home' },
  { id: 'universe', label: 'Universe' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'archive', label: 'Archive' },
  { id: 'creative', label: 'Creative' },
  { id: 'contact', label: 'Contact' },
];

export default function Header({ current = '' }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [current]);

  return (
    <header className="site-header">
      <a className="brand" href={href()} aria-label="Kunjal.exe — home">
        <img className="brand__avatar" src={`${base}mascot/avatar.webp`} alt="" width="34" height="34" />
        <span className="brand__word">
          Kunjal<span className="brand__ext">.exe</span>
        </span>
      </a>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">{open ? '×' : '☰'}</span> Menu
      </button>
      <nav id="site-nav" className={`site-nav${open ? ' is-open' : ''}`} aria-label="Main">
        <ul>
          {NAV.map((n) => (
            <li key={n.label}>
              <a href={href(n.id)} aria-current={current === n.id ? 'page' : undefined}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
