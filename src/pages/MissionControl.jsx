import { profile } from '../data/profile.js';
import { useDocumentTitle } from '../router.js';
import { say } from '../mascot.js';
import { SECRET_TOTAL, secrets } from '../mascot.js';
import Terminal from '../components/Terminal.jsx';

const base = import.meta.env.BASE_URL;

// Mission Control: the less dreamy details — who, education, skills,
// certifications, and every way to get in touch.
export default function MissionControl() {
  useDocumentTitle('Mission Control');
  const { github, linkedin, email, resume } = profile.links;
  const found = secrets().length;

  return (
    <article className="mission">
      <header className="mission__head">
        <p className="world__index">MISSION CONTROL · ABOUT, RÉSUMÉ & CONTACT</p>
        <h1 id="page-title" tabIndex={-1}>
          {profile.name}
        </h1>
        <p className="mission__headline">{profile.headline}</p>
        <p className="mission__summary">{profile.summary}</p>
        <div className="mission__actions">
          <a className="btn btn--moon" href={`${base}${resume}`} target="_blank" rel="noreferrer">
            Open my résumé (PDF)<span className="visually-hidden">, opens in a new tab</span> ↗
          </a>
          <a className="btn btn--ghost" href={`mailto:${email}`}>
            Email me
          </a>
          <a className="btn btn--ghost" href={linkedin} target="_blank" rel="noreferrer">
            LinkedIn<span className="visually-hidden"> (opens in a new tab)</span> ↗
          </a>
          <a className="btn btn--ghost" href={github} target="_blank" rel="noreferrer">
            GitHub<span className="visually-hidden"> (opens in a new tab)</span> ↗
          </a>
        </div>
      </header>

      <div className="dossier">
        <section className="dossier__card" aria-labelledby="edu">
          <h2 id="edu">Education</h2>
          <ul className="dossier__list">
            {profile.education.map((e) => (
              <li key={e.what}>
                <strong>{e.what}</strong>
                <span>{e.where}</span>
                <span className="dossier__when">{e.when}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="dossier__card" aria-labelledby="skills">
          <h2 id="skills">Skills</h2>
          {profile.skills.map((g) => (
            <div key={g.group} className="dossier__skill">
              <h3>{g.group}</h3>
              <ul className="tags">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="dossier__card" aria-labelledby="certs">
          <h2 id="certs">Certifications & hackathons</h2>
          <ul className="dossier__plain">
            {profile.certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <h2 className="dossier__h2b">Leadership</h2>
          <ul className="dossier__plain">
            {profile.leadership.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section className="dossier__card dossier__card--term" aria-labelledby="term">
          <h2 id="term">Terminal</h2>
          <p className="dossier__hint">Prefer typing? Try <code>help</code>, <code>whoami</code> or <code>open garden</code>.</p>
          <Terminal actions={{ whoami: () => say('that’s me ♡', 'hello') }} />
          <p className="dossier__secrets">
            Secrets found: {found}/{SECRET_TOTAL}
          </p>
        </section>
      </div>
    </article>
  );
}
