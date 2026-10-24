import { href } from '../router.js';
import { profile } from '../data/profile.js';
import { projectById } from '../data/projects.js';

const BASE = import.meta.env.BASE_URL;
const FEATURED = ['blinkbridge', 'chaintrack', 'tb-detection'];

export const APPS = [
  {
    id: 'projects',
    file: 'PROJECTS.EXE',
    icon: '⌨',
    tone: 'pink',
    blurb: 'things i’ve built',
  },
  {
    id: 'research',
    file: 'RESEARCH.TXT',
    icon: '✎',
    tone: 'lilac',
    blurb: 'what i’m reading',
  },
  {
    id: 'creative',
    file: 'CREATIVE.EXE',
    icon: '✿',
    tone: 'peach',
    blurb: 'dance, art & stage',
  },
  {
    id: 'contact',
    file: 'CONTACT.ME',
    icon: '✉',
    tone: 'mint',
    blurb: 'say hi ♡',
  },
];

// The cream card on the left: who she is, the four apps, featured projects
// and the links a recruiter is looking for.
export default function Panel() {
  const { links } = profile;
  return (
    <aside className="panel" aria-labelledby="hello-name">
      <p className="panel__hello hand">hi, i’m</p>
      <h1 id="hello-name" className="panel__name display">
        Kunjal
        <br />
        Mahajan
        <span className="panel__heart" aria-hidden="true">
          ♡
        </span>
      </h1>
      <p className="panel__headline">{profile.headline}</p>
      <p className="panel__tagline hand">{profile.tagline}</p>

      <nav className="apps" aria-label="Apps">
        {APPS.map((a) => (
          <a key={a.id} className={`app app--${a.tone}`} href={href(a.id)}>
            <span className="app__icon" aria-hidden="true">
              {a.icon}
            </span>
            <span className="app__file display">{a.file}</span>
            <span className="app__blurb">{a.blurb}</span>
          </a>
        ))}
      </nav>

      <section className="featured" aria-labelledby="featured-title">
        <h2 id="featured-title" className="panel__label display">
          ✦ featured builds
        </h2>
        <ul>
          {FEATURED.map((id) => {
            const p = projectById[id];
            return (
              <li key={id}>
                <a href={href(`projects/${id}`)}>
                  <span className="featured__name">{p.name}</span>
                  <span className="featured__line">{p.tagline}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <ul className="panel__links" aria-label="Elsewhere">
        <li>
          <a href={`${BASE}${links.resume}`} target="_blank" rel="noreferrer">
            Résumé ↗<span className="visually-hidden"> (PDF, opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a href={links.github} target="_blank" rel="noreferrer">
            GitHub ↗<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a href={`mailto:${links.email}`}>Email</a>
        </li>
      </ul>
    </aside>
  );
}
