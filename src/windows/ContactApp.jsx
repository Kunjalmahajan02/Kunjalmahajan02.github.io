import { useState } from 'react';
import { profile } from '../data/profile.js';
import { useDocumentTitle } from '../router.js';
import AppWindow from '../components/AppWindow.jsx';

const BASE = import.meta.env.BASE_URL;

// CONTACT.ME — the about page and the ways to reach her.
export default function ContactApp() {
  useDocumentTitle('Contact');
  const { links } = profile;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  };

  return (
    <AppWindow file="CONTACT.ME" title="Say hi ♡" tone="mint">
      <p className="window__lead">{profile.summary}</p>

      <div className="letter">
        <p className="hand letter__to">dear visitor,</p>
        <p>Want to talk about a project, an opportunity or an idea? Write to me — I read every message.</p>
        <div className="letter__actions">
          <a className="btn" href={`mailto:${links.email}`}>
            {links.email}
          </a>
          <button type="button" className="btn btn--ghost" onClick={copy}>
            {copied ? 'Copied ♡' : 'Copy email'}
          </button>
          <span className="visually-hidden" role="status">
            {copied ? 'Email address copied' : ''}
          </span>
        </div>
        <ul className="letter__links">
          <li>
            <a href={`${BASE}${links.resume}`} target="_blank" rel="noreferrer">
              Résumé (PDF) ↗<span className="visually-hidden"> (opens in a new tab)</span>
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
        </ul>
        <p className="hand letter__sign">— Kunjal, {profile.location}</p>
      </div>

      <div className="cols">
        <section className="card" aria-labelledby="a-edu">
          <h2 id="a-edu">Education</h2>
          <ul className="timeline-list">
            {profile.education.map((e) => (
              <li key={e.what}>
                <strong>{e.what}</strong>
                <span>{e.where}</span>
                <span className="note">{e.when}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card" aria-labelledby="a-lead">
          <h2 id="a-lead">Leadership</h2>
          <ul className="hearts">
            {profile.leadership.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h2 className="card__h2-next">Certifications</h2>
          <ul className="hearts">
            {profile.certifications.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card card--lilac" aria-labelledby="a-skills">
        <h2 id="a-skills">Skills</h2>
        <dl className="skills">
          {profile.skills.map((g) => (
            <div key={g.group}>
              <dt>{g.group}</dt>
              <dd>
                <ul className="tags">
                  {g.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </AppWindow>
  );
}
