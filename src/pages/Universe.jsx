import { profile } from '../data/profile.js';
import { planets } from '../data/planets.js';
import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import PlanetDot from '../components/PlanetDot.jsx';

// The overview. The universe itself is the persistent <Scene>; this page only
// adds a quiet corner of text over it, and — below the first screen — a short
// version for anyone who wants the work without exploring.
export default function Universe() {
  useDocumentTitle(null);

  const explore = () => document.querySelector('.scene-planet a')?.focus();

  return (
    <>
      <section className="home-hero" aria-labelledby="page-title">
        <div className="home-hero__copy">
          <p className="mono eyebrow">{profile.title.toUpperCase()}</p>
          <h1 id="page-title" tabIndex={-1} className="home-hero__title">
            Kunjal<span className="home-hero__ext">.exe</span>
          </h1>
          <p className="home-hero__lead">{profile.intro}</p>
          <div className="home-hero__actions">
            <button type="button" className="btn btn--primary" onClick={explore}>
              Explore the universe
            </button>
            <a className="btn btn--ghost" href={href('lab')}>
              View projects
            </a>
          </div>
        </div>
        <p className="home-hero__hint mono" aria-hidden="true">
          SELECT A PLANET · OR SCROLL FOR THE SHORT VERSION ↓
        </p>
      </section>

      <div className="home-brief">
        <section className="quick-look" aria-labelledby="quick-title">
          <div className="section-head">
            <p className="mono eyebrow">PROJECT LOG · THE SHORT VERSION</p>
            <h2 id="quick-title">Three builds</h2>
          </div>
          <ul className="quick-look__grid">
            {projects.map((p) => {
              const repo = p.links.find((l) => l.href.includes('github.com'));
              return (
                <li key={p.id} className="quick-card">
                  <p className="mono quick-card__moon">
                    {p.moon} · {p.evidence.level === 'verified' ? 'VERIFIED FROM REPO' : 'NOT YET VERIFIED'}
                  </p>
                  <h3>{p.name}</h3>
                  <p>{p.tagline}</p>
                  <p className="quick-card__flow mono">{p.flow.map((s) => s.label).join(' → ')}</p>
                  <ul className="chips" aria-label="Technologies">
                    {p.stack.slice(0, 4).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <p className="quick-card__links">
                    <a href={href(`lab/${p.id}`)}>Case study →</a>
                    {repo && (
                      <a href={repo.href} target="_blank" rel="noreferrer">
                        GitHub<span className="visually-hidden"> repository for {p.name} (opens in a new tab)</span> ↗
                      </a>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="planet-index" aria-labelledby="index-title">
          <div className="section-head">
            <p className="mono eyebrow">PLANET INDEX</p>
            <h2 id="index-title">Every destination</h2>
          </div>
          <ol className="planet-index__list">
            {planets.map((p) => (
              <li key={p.id}>
                <a href={href(p.id)} className="planet-row">
                  <PlanetDot planet={p} size={44} />
                  <span className="planet-row__text">
                    <span className="mono planet-row__orbit">
                      ORBIT {p.index} · {p.kicker.toUpperCase()}
                    </span>
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
      </div>
    </>
  );
}
