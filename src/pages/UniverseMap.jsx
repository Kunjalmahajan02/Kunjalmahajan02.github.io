import { useState } from 'react';
import { core, worlds } from '../data/worlds.js';
import { go, href, useDocumentTitle } from '../router.js';
import { isReducedMotion } from '../motion.js';
import Art from '../components/Art.jsx';

// The illustrated universe: every planet in the artwork is a link. Picking
// one zooms the view toward it before travelling there.
export default function UniverseMap() {
  useDocumentTitle('Universe');
  const [active, setActive] = useState(null);
  const [zoom, setZoom] = useState(null);

  const travel = (e, w) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (isReducedMotion()) return go(w.route);
    setZoom(w);
    window.setTimeout(() => go(w.route), 650);
  };

  return (
    <section className="cosmos" aria-labelledby="page-title">
      <div
        className={`cosmos__stage${zoom ? ' is-zooming' : ''}${active ? ' has-active' : ''}`}
        style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
      >
        <Art
          name="universe"
          widths={[1100, 1800, 2600]}
          sizes="100vw"
          eager
          className="cosmos__art"
          alt="An illustrated pink universe: glowing planets on looping orbits around a large planet wrapped in a ribbon and bow labelled Kunjal.exe, her little universe, with Mini Kunjal watching from the corner."
          width="2600"
          height="1483"
        />

        <div className="cosmos__title">
          <h1 id="page-title" tabIndex={-1} className="cosmos__h1">
            The Research Observatory
          </h1>
          <p>
            Different worlds. Same girl.
            <br />
            Click on a planet to explore.
          </p>
        </div>

        <ul className="cosmos__worlds" aria-label="Planets">
          {worlds.map((w) => (
            <li key={w.id}>
              <a
                className={`world${active === w.id ? ' is-active' : ''}`}
                href={href(w.route)}
                onClick={(e) => travel(e, w)}
                onMouseEnter={() => setActive(w.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(w.id)}
                onBlur={() => setActive(null)}
                style={{ left: `${w.x}%`, top: `${w.y}%`, width: `${w.r * 2}%` }}
              >
                <span className="visually-hidden">
                  {w.name}: {w.lines.join(', ')}
                </span>
              </a>
              <p className="world-label" aria-hidden="true" style={{ left: `${w.label.x}%`, top: `${w.label.y}%` }}>
                <span className="world-label__name">{w.name}</span>
                {w.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </p>
            </li>
          ))}
          <li>
            <a
              className="world world--core"
              href={href(core.route)}
              onClick={(e) => travel(e, core)}
              style={{ left: `${core.x}%`, top: `${core.y}%`, width: `${core.r * 2}%` }}
            >
              <span className="visually-hidden">{core.name} — back home</span>
            </a>
          </li>
        </ul>

        <p className="bubble bubble--left cosmos__bubble">so many worlds… which one are we exploring first? ♡</p>
        <p className="cosmos__hint hand" aria-hidden="true">
          click a planet ♡
        </p>
      </div>

      {/* The same destinations as a plain list — easier on small screens. */}
      <div className="cosmos__list-wrap">
        <ul className="cosmos__list" aria-label="All planets">
          {worlds.map((w) => (
            <li key={w.id}>
              <a href={href(w.route)}>
                <strong>{w.name}</strong>
                <span>{w.lines.join(' · ')}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
