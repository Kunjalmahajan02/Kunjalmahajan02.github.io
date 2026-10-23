import { useEffect, useState } from 'react';
import { profile } from '../data/profile.js';
import { href, useDocumentTitle } from '../router.js';
import { toggleVibe } from '../vibe.js';
import Win from '../components/Win.jsx';
import Art from '../components/Art.jsx';
import Terminal from '../components/Terminal.jsx';

const base = import.meta.env.BASE_URL;

// Kunjal.exe OS — the contact page as a little desktop. Icons either open a
// window here or travel to that part of the universe.
const ICONS = [
  { id: 'me', label: 'me.txt', open: 'info' },
  { id: 'projects', label: 'projects', to: 'projects' },
  { id: 'research', label: 'research', to: 'research' },
  { id: 'creative', label: 'creative', to: 'creative' },
  { id: 'archive', label: 'archive', to: 'archive' },
  { id: 'terminal', label: 'terminal', open: 'terminal' },
  { id: 'resume', label: 'resume', open: 'resume' },
  { id: 'trash', label: 'trash', open: 'trash' },
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function OsDesktop() {
  useDocumentTitle('Contact');
  const now = useClock();
  const [open, setOpen] = useState(['terminal', 'info', 'contact']);
  const [top, setTop] = useState('terminal');
  const [termFocus, setTermFocus] = useState(0);

  const show = (id) => {
    setOpen((o) => (o.includes(id) ? o : [...o, id]));
    setTop(id);
    if (id === 'terminal') setTermFocus((n) => n + 1);
    window.setTimeout(() => document.getElementById(`os-${id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50);
  };
  const close = (id) => setOpen((o) => o.filter((x) => x !== id));
  const z = (id) => ({ style: { zIndex: top === id ? 5 : 2 }, onMouseDown: () => setTop(id), onFocusCapture: () => setTop(id) });
  const { github, linkedin, email, resume } = profile.links;

  return (
    <div className="os">
      <h1 id="page-title" tabIndex={-1} className="visually-hidden">
        Contact — Kunjal.exe OS
      </h1>
      <div className="os__screen" style={{ '--wall': `url(${base}art/hero-1800.webp)` }}>
        <div className="os__bar">
          <span className="os__brand">
            <span aria-hidden="true">✦</span> KUNJAL.EXE OS
          </span>
          <span className="os__status" aria-hidden="true">
            ♡ ✦ ☾
          </span>
          <time dateTime={now.toISOString()}>
            {now.toLocaleDateString([], { weekday: 'short' })} {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </time>
        </div>

        <div className="os__desk">
          <ul className="os__icons" aria-label="Desktop">
            {ICONS.map((i) => (
              <li key={i.id}>
                {i.to ? (
                  <a href={href(i.to)} className="os__icon">
                    <img src={`${base}art/icon-${i.id}.webp`} alt="" width="48" height="48" />
                    <span>{i.label}</span>
                  </a>
                ) : (
                  <button type="button" className="os__icon" onClick={() => show(i.open)}>
                    <img src={`${base}art/icon-${i.id}.webp`} alt="" width="48" height="48" />
                    <span>{i.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="os__windows">
            {open.includes('terminal') && (
              <Win id="os-terminal" title="Kunjal Terminal" icon="›_" className="os__win os__win--terminal" onClose={() => close('terminal')} bodyClass="os__term-body" {...z('terminal')}>
                <Terminal autoFocus={termFocus} actions={{ whoami: () => show('info'), contact: () => show('contact'), vibe: toggleVibe }} />
              </Win>
            )}

            {open.includes('info') && (
              <Win id="os-info" title="System Info" icon="✦" className="os__win os__win--info" onClose={() => close('info')} {...z('info')}>
                <div className="os__info">
                  <Art name="portrait" widths={[392]} alt="Illustrated portrait of Kunjal in sunglasses, chin resting on her hand." width="392" height="436" />
                  <div>
                    <h2>{profile.name.toUpperCase()}</h2>
                    <p>
                      {profile.role}
                      <br />
                      {profile.college}
                      <br />
                      {profile.location}
                    </p>
                  </div>
                </div>
                <div className="os__currently">
                  <p className="os__currently-head">
                    <span className="status-dot" aria-hidden="true" /> Currently:
                  </p>
                  <ul>
                    {profile.doing.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </Win>
            )}

            {open.includes('contact') && (
              <Win id="os-contact" title="contact.txt — let’s connect" icon="✉" className="os__win os__win--contact" onClose={() => close('contact')} {...z('contact')}>
                <p className="hand os__hello">say hi ♡</p>
                <ul className="os__links">
                  {github && (
                    <li>
                      <a className="btn btn--dark btn--small" href={github} target="_blank" rel="noreferrer">
                        GitHub · Kunjalmahajan02<span className="visually-hidden"> (opens in a new tab)</span> ↗
                      </a>
                    </li>
                  )}
                  {linkedin && (
                    <li>
                      <a className="btn btn--light btn--small" href={linkedin} target="_blank" rel="noreferrer">
                        LinkedIn<span className="visually-hidden"> (opens in a new tab)</span> ↗
                      </a>
                    </li>
                  )}
                  {email && (
                    <li>
                      <a className="btn btn--light btn--small" href={`mailto:${email}`}>
                        Email me
                      </a>
                    </li>
                  )}
                </ul>
                {!linkedin && !email && <p className="empty-note">More ways to reach me are coming soon.</p>}
              </Win>
            )}

            {open.includes('resume') && (
              <Win id="os-resume" title="resume.pdf" icon="▤" className="os__win" onClose={() => close('resume')} {...z('resume')}>
                {resume ? (
                  <a className="btn btn--dark btn--small" href={resume}>
                    Open my résumé
                  </a>
                ) : (
                  <p className="empty-note">My résumé isn’t online yet — ask me on GitHub and I’ll send it ♡</p>
                )}
              </Win>
            )}

            {open.includes('trash') && (
              <Win id="os-trash" title="Trash" icon="♲" className="os__win" onClose={() => close('trash')} {...z('trash')}>
                <p className="empty-note">Empty — overthinking was emptied this morning ♡</p>
              </Win>
            )}
          </div>

          <figure className="os__robot">
            <p className="bubble bubble--down os__robot-bubble">
              need help? try typing <strong>projects</strong> ♡
            </p>
            <Art name="robot-os" widths={[336]} alt="A little astronaut robot with a pink bow." width="336" height="460" />
          </figure>
        </div>
      </div>
    </div>
  );
}
