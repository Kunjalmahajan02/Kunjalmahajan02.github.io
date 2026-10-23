import { useRef, useState } from 'react';
import { profile } from '../data/profile.js';
import { planets } from '../data/planets.js';
import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import { isReducedMotion } from '../motion.js';
import SolarSystem from '../components/SolarSystem.jsx';
import PlanetDot from '../components/PlanetDot.jsx';

export default function Universe() {
  useDocumentTitle(null);
  const [hovered, setHovered] = useState(null);
  const fieldRef = useRef(null);
  const indexRef = useRef(null);

  // "Explore the universe": bring the planets into view and put keyboard focus
  // on the first one. On narrow screens the planet index is the easier target.
  const explore = () => {
    const narrow = window.matchMedia('(max-width: 760px)').matches;
    const target = narrow ? indexRef.current : fieldRef.current;
    target?.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'center' });
    target?.querySelector('a')?.focus({ preventScroll: true });
  };

  return (
    <>
      <section className="hero" aria-labelledby="page-title">
        <div className="hero__copy">
          <p className="mono eyebrow">ONE GIRL · FIVE PLANETS · A FEW THOUSAND IDEAS</p>
          <h1 id="page-title" tabIndex={-1} className="hero__title">
            <span className="hero__wordmark">
              Kunjal<span className="hero__ext">.exe</span>
            </span>
            <span className="hero__subtitle">{profile.title}</span>
          </h1>
          <p className="hero__lead">{profile.intro}</p>
          <p className="mono hero__meta">
            {profile.name} · {profile.role} · creative technologist
          </p>
          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={explore}>
              Explore the universe
            </button>
            <a className="btn btn--ghost" href={href('lab')}>
              See my projects
            </a>
          </div>

          <div className="readout" aria-live="polite">
            <p className="mono readout__head">SYSTEM STATUS</p>
            {hovered ? (
              <p className="readout__body">
                <span className="mono">ORBIT {hovered.index} →</span> <strong>{hovered.name}</strong>
                <br />
                {hovered.blurb}
              </p>
            ) : (
              <p className="readout__body">
                5 planets in orbit. Hover or focus one to read its signal; select it to travel there.
              </p>
            )}
          </div>
        </div>

        <div className="hero__system">
          <SolarSystem ref={fieldRef} onHover={setHovered} guideLine={profile.guideLine} />
        </div>
      </section>

      <section className="planet-index" aria-labelledby="index-title" ref={indexRef}>
        <div className="section-head">
          <p className="mono eyebrow">PLANET INDEX</p>
          <h2 id="index-title">Every destination, at a glance</h2>
        </div>
        <ol className="planet-index__list">
          {planets.map((p) => (
            <li key={p.id}>
              <a href={href(p.id)} className="planet-row">
                <PlanetDot planet={p} size={40} />
                <span className="planet-row__text">
                  <span className="mono planet-row__orbit">ORBIT {p.index} · {p.kicker.toUpperCase()}</span>
                  <span className="planet-row__name">{p.name}</span>
                  <span className="planet-row__blurb">{p.blurb}</span>
                </span>
                <span className="planet-row__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="quick-look" aria-labelledby="quick-title">
        <div className="section-head">
          <p className="mono eyebrow">PROJECT LOG · QUICK LOOK</p>
          <h2 id="quick-title">Short on time? Start here.</h2>
        </div>
        <ul className="quick-look__grid">
          {projects.map((p) => (
            <li key={p.id} className="quick-card">
              <p className="mono quick-card__moon">{p.moon}</p>
              <h3>
                <a href={href(`lab/${p.id}`)} className="stretched">
                  {p.name}
                </a>
              </h3>
              <p>{p.tagline}</p>
              <p className="quick-card__stack mono">{p.stack.slice(0, 3).join(' · ')}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
