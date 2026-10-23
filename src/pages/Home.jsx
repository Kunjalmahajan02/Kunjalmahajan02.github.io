import { useEffect, useState } from 'react';
import { profile } from '../data/profile.js';
import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import Art from '../components/Art.jsx';
import { isVibing, toggleVibe } from '../vibe.js';

// The menu card in her room. Every line is a real destination.
const MENU = [
  { icon: '☺', label: 'whoami', to: 'contact' },
  { icon: '◎', label: 'show universe', to: 'universe' },
  { icon: '▣', label: 'my projects', to: 'projects' },
  { icon: '✧', label: 'research interests', to: 'research' },
  { icon: '✎', label: 'creative side', to: 'creative' },
  { icon: '›_', label: 'open a terminal', to: 'contact' },
  { icon: '♫', label: 'just vibe ♡', vibe: true },
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function Home() {
  useDocumentTitle(null);
  const now = useClock();
  const [vibe, setVibe] = useState(isVibing);

  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <>
      <section className="room" aria-labelledby="page-title">
        <div className="room__stage">
          <div className="room__frame">
            <Art
              name="hero"
              widths={[1100, 1800, 2600]}
              sizes="(max-width: 860px) 180vw, 100vw"
              eager
              className="room__art"
              alt="Mini Kunjal — long dark wavy hair and oversized black sunglasses — resting her chin on her hands at a laptop covered in planet stickers that reads Kunjal.exe, in a pink room at night with a sleeping white cat, stacked books, a little astronaut robot with a bow, and a window onto a glowing city."
              width="2600"
              height="1161"
            />
            <p className="bubble bubble--down room__hello-mini" aria-hidden="true">
              hey, i’m kunjal! ♡
            </p>
          </div>

          <div className="room__title">
            <h1 id="page-title" tabIndex={-1}>
              <span className="glow-title room__word">Kunjal.exe</span>
              <span className="room__welcome">
                <span className="sparkle" aria-hidden="true">
                  ✦{' '}
                </span>
                Welcome to her little universe
                <span className="sparkle" aria-hidden="true">
                  {' '}✦
                </span>
              </span>
            </h1>
            <p className="room__tagline">{profile.tagline.join(' · ')}</p>
          </div>

          <p className="bubble bubble--down room__hello">{profile.hello}</p>

          <nav className="room__menu" aria-label="Explore">
            <ul>
              {MENU.map((m) => (
                <li key={m.label}>
                  {m.vibe ? (
                    <button type="button" onClick={() => setVibe(toggleVibe())} aria-pressed={vibe}>
                      <span className="room__menu-icon" aria-hidden="true">
                        {m.icon}
                      </span>
                      {m.label}
                    </button>
                  ) : (
                    <a href={href(m.to)}>
                      <span className="room__menu-icon" aria-hidden="true">
                        {m.icon}
                      </span>
                      {m.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <a className="bubble bubble--left room__robot" href={href('universe')}>
            explore with me! ♡
          </a>
        </div>

        <div className="room__bar">
          <p className="room__currently">
            <span className="room__currently-label">currently:</span>
            {profile.currently.map((c) => (
              <span key={c} className="room__chip">
                {c}
              </span>
            ))}
          </p>
          <p className="room__clock">
            <time dateTime={now.toISOString()}>{time}</time>
            <span>{profile.location}</span>
          </p>
        </div>
      </section>

      <section className="home-projects" aria-labelledby="home-projects-title">
        <div className="home-projects__head">
          <h2 id="home-projects-title" className="glow-title">
            Project log
          </h2>
          <p>The short version — three builds, what they do, and where the code lives.</p>
        </div>
        <ul className="home-projects__grid">
          {projects.map((p) => {
            const repo = p.links.find((l) => l.href.includes('github.com'));
            return (
              <li key={p.id} className="win home-card">
                <div className="win__bar">
                  <span className="win__icon" aria-hidden="true">
                    ✦
                  </span>
                  <span className="win__title">{p.moon.replace('MOON', 'project')}</span>
                  <span className="win__lights" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <div className="win__body">
                  <h3>{p.name}</h3>
                  <p className="home-card__tag">{p.tagline}</p>
                  <p className="home-card__flow">{p.flow.map((s) => s.label).join(' → ')}</p>
                  <ul className="chips">
                    {p.stack.slice(0, 4).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <p className="home-card__links">
                    <a className="btn btn--dark btn--small" href={href(`projects/${p.id}`)}>
                      Open project
                    </a>
                    {repo ? (
                      <a className="btn btn--light btn--small" href={repo.href} target="_blank" rel="noreferrer">
                        GitHub<span className="visually-hidden"> repository for {p.name} (opens in a new tab)</span> ↗
                      </a>
                    ) : (
                      <span className="empty-note">code not public yet</span>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
