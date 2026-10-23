import { planets } from '../data/planets.js';
import { href } from '../router.js';
import PlanetDot from './PlanetDot.jsx';

const base = import.meta.env.BASE_URL;

export default function Header({ current }) {
  return (
    <header className="site-header">
      <a className="brand" href={href()} aria-label="Kunjal.exe — back to the universe">
        <img className="brand__avatar" src={`${base}mascot/avatar.webp`} alt="" width="34" height="34" />
        <span className="brand__word">
          Kunjal<span className="brand__ext">.exe</span>
        </span>
      </a>
      <nav className="planet-nav" aria-label="Planets">
        <ul>
          <li>
            <a href={href()} aria-current={current === undefined ? 'page' : undefined} className="planet-nav__home">
              <span className="planet-nav__sun" aria-hidden="true" />
              <span>Universe</span>
            </a>
          </li>
          {planets.map((p) => (
            <li key={p.id}>
              <a href={href(p.id)} aria-current={current === p.id ? 'page' : undefined}>
                <PlanetDot planet={p} size={14} />
                <span className="planet-nav__num" aria-hidden="true">
                  {p.index}
                </span>
                <span className="planet-nav__full">{p.name}</span>
                <span className="planet-nav__short" aria-hidden="true">
                  {p.short}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
