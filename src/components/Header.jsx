import { useEffect, useState } from 'react';
import { href } from '../router.js';
import { worlds, mission } from '../data/worlds.js';
import { profile } from '../data/profile.js';

const base = import.meta.env.BASE_URL;

// Top bar: home, the world map, Mission Control and the résumé — always one
// click away.
export default function Header({ current = '' }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [current]);

  return (
    <header className="topbar">
      <a className="brand" href={href()} aria-label="Kunjal.exe — back to the universe">
        <img className="brand__avatar" src={`${base}mascot/avatar.webp`} alt="" width="34" height="34" />
        <span className="brand__word">
          Kunjal<span>.exe</span>
        </span>
      </a>

      <button type="button" className="topbar__toggle" aria-expanded={open} aria-controls="world-map" onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">{open ? '×' : '✦'}</span> World map
      </button>

      <nav id="world-map" className={`worldmap${open ? ' is-open' : ''}`} aria-label="World map">
        <ul>
          <li>
            <a href={href()} aria-current={current === '' ? 'page' : undefined}>
              <span className="worldmap__num" aria-hidden="true">
                00
              </span>
              Universe
            </a>
          </li>
          {worlds.map((w) => (
            <li key={w.id}>
              <a href={href(w.id)} aria-current={current === w.id ? 'page' : undefined}>
                <span className="worldmap__num" aria-hidden="true">
                  {w.index}
                </span>
                {w.name}
              </a>
            </li>
          ))}
          <li>
            <a href={href(mission.id)} aria-current={current === mission.id ? 'page' : undefined}>
              <span className="worldmap__num" aria-hidden="true">
                ✦
              </span>
              {mission.name}
            </a>
          </li>
        </ul>
      </nav>

      <a className="topbar__resume" href={`${base}${profile.links.resume}`} target="_blank" rel="noreferrer">
        Résumé<span className="visually-hidden"> (PDF, opens in a new tab)</span> <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
