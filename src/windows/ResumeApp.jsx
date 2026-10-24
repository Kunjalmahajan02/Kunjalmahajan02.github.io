import { profile } from '../data/profile.js';
import { useDocumentTitle } from '../router.js';
import AppWindow from '../components/AppWindow.jsx';

const BASE = import.meta.env.BASE_URL;

// RESUME.PDF — the résumé, to read here or download.
export default function ResumeApp() {
  useDocumentTitle('Résumé');
  const { links } = profile;
  const pdf = `${BASE}${links.resume}`;

  return (
    <AppWindow file="RESUME.PDF" title="Résumé" tone="peach">
      <div className="resume__actions">
        <a className="btn" href={pdf} download>
          Download résumé (PDF)
        </a>
        <a className="btn btn--ghost" href={links.github} target="_blank" rel="noreferrer">
          GitHub profile ↗<span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>

      <section className="resume__doc" aria-label="Résumé">
        <object data={`${pdf}#view=FitH`} type="application/pdf" aria-label="Kunjal Mahajan’s résumé">
          <p className="note">
            Your browser can’t show the PDF here — <a href={pdf}>download the résumé</a> instead.
          </p>
        </object>
      </section>
    </AppWindow>
  );
}
