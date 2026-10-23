import { profile } from '../data/profile.js';
import { setMotion, useMotion } from '../motion.js';

export default function Footer() {
  const motion = useMotion();
  const reduced = motion === 'reduced';
  const { github, linkedin, email, resume } = profile.links;

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="mono site-footer__status">
          <span className="status-dot" aria-hidden="true" /> SYSTEM STATUS · ONLINE · {profile.location.toUpperCase()}
        </p>
        <ul className="site-footer__links">
          {github && (
            <li>
              <a href={github} target="_blank" rel="noreferrer">
                GitHub<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          )}
          {linkedin && (
            <li>
              <a href={linkedin} target="_blank" rel="noreferrer">
                LinkedIn<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          )}
          {email && (
            <li>
              <a href={`mailto:${email}`}>Email</a>
            </li>
          )}
          {resume && (
            <li>
              <a href={resume}>Résumé</a>
            </li>
          )}
          <li>
            <button
              type="button"
              className="link-button"
              aria-pressed={reduced}
              onClick={() => setMotion(reduced ? 'full' : 'reduced')}
            >
              Reduce motion: {reduced ? 'on' : 'off'}
            </button>
          </li>
        </ul>
        <p className="site-footer__small">
          © {new Date().getFullYear()} {profile.name} · Built with React &amp; Vite · Hosted on GitHub Pages
        </p>
      </div>
    </footer>
  );
}
