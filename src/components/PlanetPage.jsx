import { createPortal } from 'react-dom';
import { planets } from '../data/planets.js';
import { href } from '../router.js';
import PlanetDot from './PlanetDot.jsx';

// Shared frame for every destination. The planet itself is drawn by the
// persistent <Scene> behind the page; this adds the breadcrumb, heading,
// optional actions, a fixed way back to the universe, and onward links.
export default function PlanetPage({ planet, title, lead, crumbs = [], actions, children }) {
  const i = planets.findIndex((p) => p.id === planet.id);
  const prev = planets[(i - 1 + planets.length) % planets.length];
  const next = planets[(i + 1) % planets.length];

  return (
    <article className="dest" style={{ '--accent': planet.palette.base, '--accent-light': planet.palette.light }}>
      {createPortal(
        <a className="back-pill" href={href()}>
          <span aria-hidden="true">←</span> Universe <kbd aria-hidden="true">Esc</kbd>
        </a>,
        document.body,
      )}
      <header className="dest__hero">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <a href={href()}>Universe</a>
            </li>
            {crumbs.length === 0 ? (
              <li aria-current="page">{planet.name}</li>
            ) : (
              <>
                <li>
                  <a href={href(planet.id)}>{planet.name}</a>
                </li>
                {crumbs.map((c) => (
                  <li key={c} aria-current="page">
                    {c}
                  </li>
                ))}
              </>
            )}
          </ol>
        </nav>
        <p className="mono eyebrow">
          ORBIT {planet.index} · {planet.name.toUpperCase()}
        </p>
        <h1 id="page-title" tabIndex={-1}>
          {title}
        </h1>
        {lead && <p className="dest__lead">{lead}</p>}
        {actions && <div className="dest__actions">{actions}</div>}
      </header>

      <div className="dest__body">{children}</div>

      <nav className="orbit-nav" aria-label="Other planets">
        <a href={href(prev.id)} className="orbit-nav__link">
          <span className="mono">← ORBIT {prev.index}</span>
          <span className="orbit-nav__name">
            <PlanetDot planet={prev} size={16} /> {prev.name}
          </span>
        </a>
        <a href={href()} className="orbit-nav__home">
          <span className="planet-nav__sun" aria-hidden="true" /> Return to the universe
        </a>
        <a href={href(next.id)} className="orbit-nav__link orbit-nav__link--next">
          <span className="mono">ORBIT {next.index} →</span>
          <span className="orbit-nav__name">
            <PlanetDot planet={next} size={16} /> {next.name}
          </span>
        </a>
      </nav>
    </article>
  );
}
