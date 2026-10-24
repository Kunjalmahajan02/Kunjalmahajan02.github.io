import { useEffect, useRef, useState } from 'react';
import { worlds } from '../data/worlds.js';
import { profile } from '../data/profile.js';
import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import { discover, say } from '../mascot.js';
import { isReducedMotion } from '../motion.js';

const base = import.meta.env.BASE_URL;
const FEATURED = ['blinkbridge', 'speech', 'chaintrack', 'tb-detection'];

function visited() {
  try {
    return JSON.parse(localStorage.getItem('kx-visited') || '[]');
  } catch {
    return [];
  }
}

// The opening: title, the Kunjal.exe planet with four worlds around it, and
// the crescent moon Mini Kunjal sits on. The intro plays once per visit and
// can be skipped; everything is clickable from the first frame.
export default function Home() {
  useDocumentTitle(null);
  const [intro, setIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('kx-intro') && !isReducedMotion();
    } catch {
      return false;
    }
  });
  const [entered, setEntered] = useState(false);
  const [moonClicks, setMoonClicks] = useState(0);
  const seen = visited();
  const worldsRef = useRef(null);

  useEffect(() => {
    if (!intro) return undefined;
    const t = window.setTimeout(() => endIntro(), 2600);
    return () => window.clearTimeout(t);
  }, [intro]); // eslint-disable-line react-hooks/exhaustive-deps

  function endIntro() {
    setIntro(false);
    try {
      sessionStorage.setItem('kx-intro', '1');
    } catch {
      /* ignore */
    }
  }

  const enter = () => {
    setEntered(true);
    say('pick a world ✦ — or click anywhere in the sky and i’ll follow you.', 'wow');
    const first = worldsRef.current?.querySelector('a');
    first?.focus({ preventScroll: true });
    worldsRef.current?.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  };

  const tapMoon = () => {
    const n = moonClicks + 1;
    setMoonClicks(n);
    if (n === 5) discover('moon', 'you found the moon’s secret: it’s where i sit and overthink ✦');
    else if (n < 5) say(['hey, that tickles.', 'careful, it’s a little wobbly.', 'keep going…', 'one more…'][n - 1], 'think');
  };

  return (
    <>
      <section className={`opening${intro ? ' is-intro' : ''}${entered ? ' is-entered' : ''}`} aria-labelledby="page-title">
        {intro && (
          <button type="button" className="opening__skip" onClick={endIntro}>
            Skip intro
          </button>
        )}

        <div className="opening__copy">
          <p className="opening__kicker">an interactive dreamscape</p>
          <h1 id="page-title" tabIndex={-1} className="opening__title">
            <span className="opening__word" aria-label="Kunjal.exe">
              {'Kunjal.exe'.split('').map((c, i) => (
                <span key={i} aria-hidden="true" style={{ '--i': i }}>
                  {c}
                </span>
              ))}
            </span>
            <span className="opening__sub">Her Little Universe</span>
          </h1>
          <p className="opening__tagline hand">{profile.tagline}</p>
          <p className="opening__who">
            {profile.name} · AI &amp; Data Science Engineer — computer vision, deep learning &amp; GenAI.
          </p>
          <div className="opening__actions">
            <button type="button" className="btn btn--moon" onClick={enter}>
              Enter the Dreamscape
            </button>
            <a className="btn btn--ghost" href={`${base}${profile.links.resume}`} target="_blank" rel="noreferrer">
              Résumé<span className="visually-hidden"> (PDF, opens in a new tab)</span> ↗
            </a>
          </div>
        </div>

        <div className="system">
          <svg className="system__orbits" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <ellipse cx="50" cy="52" rx="44" ry="38" />
            <ellipse cx="50" cy="52" rx="30" ry="24" className="system__orbit--inner" />
            {worlds.map((w) => (
              <line key={w.id} x1="50" y1="52" x2={w.home.x} y2={w.home.y} className={`system__ray system__ray--${w.id}`} />
            ))}
          </svg>
          <div className="system__core">
            <img src={`${base}dream/planet-core-900.webp`} alt="The Kunjal.exe planet, wrapped in a ribbon tied in a pink bow." width="900" height="649" />
            <span className="system__moon" aria-hidden="true">
              <img src={`${base}dream/planet-moonlet-205.webp`} alt="" width="205" height="172" />
            </span>
          </div>
          <ul className="system__worlds" ref={worldsRef} aria-label="Worlds">
            {worlds.map((w, i) => (
              <li key={w.id} className={`portal portal--${w.id}`} style={{ left: `${w.home.x}%`, top: `${w.home.y}%`, '--d': `${i * -2.3}s` }}>
                <a
                  href={href(w.id)}
                  onMouseEnter={() => say(w.hint, 'wow')}
                  onFocus={() => say(w.hint, 'wow')}
                  onClick={() => {
                    try {
                      localStorage.setItem('kx-visited', JSON.stringify([...new Set([...seen, w.id])]));
                    } catch {
                      /* ignore */
                    }
                  }}
                >
                  <span className="portal__planet">
                    <img src={`${base}dream/${w.planet.file}.webp`} alt="" width={w.planet.w} height={w.planet.h} />
                  </span>
                  <span className="portal__label">
                    <span className="portal__index">WORLD {w.index}</span>
                    <span className="portal__name">{w.name}</span>
                    <span className="portal__theme">{w.theme}</span>
                    {seen.includes(w.id) && <span className="portal__visited">✓ visited</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button type="button" className="crescent" onClick={tapMoon} aria-label="The crescent moon Mini Kunjal sits on">
          <svg viewBox="0 0 300 150" focusable="false" aria-hidden="true">
            <defs>
              <linearGradient id="crescent-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFF7FB" />
                <stop offset="0.55" stopColor="#F3CFE2" />
                <stop offset="1" stopColor="#B9AED8" />
              </linearGradient>
            </defs>
            <path d="M6 48 Q150 196 294 48 Q150 120 6 48 Z" fill="url(#crescent-g)" />
            <path d="M6 48 Q150 120 294 48" fill="none" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="2" />
          </svg>
        </button>

        <p className="opening__hint hand" aria-hidden="true">
          psst — click anywhere in the sky ✦
        </p>
      </section>

      <section className="shortversion" aria-labelledby="short-title">
        <div className="shortversion__inner">
          <p className="opening__kicker">the short version</p>
          <h2 id="short-title">Kunjal, in a minute.</h2>
          <div className="shortversion__grid">
            <div className="journal">
              <h3>Who</h3>
              <p>{profile.summary}</p>
            </div>
            <div className="journal">
              <h3>Builds</h3>
              <ul className="shortversion__builds">
                {FEATURED.map((id) => {
                  const p = projects.find((x) => x.id === id);
                  return (
                    <li key={id}>
                      <a href={href(`inventor/${id}`)}>{p.name}</a>
                      <span>{p.tagline}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="journal">
              <h3>Find me</h3>
              <ul className="shortversion__links">
                <li>
                  <a href={`${base}${profile.links.resume}`} target="_blank" rel="noreferrer">
                    Résumé (PDF) ↗
                  </a>
                </li>
                <li>
                  <a href={profile.links.github} target="_blank" rel="noreferrer">
                    GitHub ↗
                  </a>
                </li>
                <li>
                  <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn ↗
                  </a>
                </li>
                <li>
                  <a href={`mailto:${profile.links.email}`}>{profile.links.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
