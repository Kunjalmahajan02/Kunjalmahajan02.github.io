import { planetById } from '../data/planets.js';
import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import PlanetPage from '../components/PlanetPage.jsx';
import EvidenceBadge from '../components/EvidenceBadge.jsx';

export default function AiLab() {
  useDocumentTitle('AI Lab');
  return (
    <PlanetPage
      planet={planetById.lab}
      title="AI Lab"
      lead="Three projects, each a moon of this planet: what problem it tackles, how it works, and what I learned building it."
    >
      <ul className="moon-list">
        {projects.map((p) => (
          <li key={p.id} className="moon-card">
            <div className="moon-card__orb" aria-hidden="true" />
            <div className="moon-card__text">
              <p className="mono moon-card__meta">
                {p.moon} · {p.status.toUpperCase()}
              </p>
              <h2>
                <a href={href(`lab/${p.id}`)} className="stretched">
                  {p.name}
                </a>
              </h2>
              <p className="moon-card__tagline">{p.tagline}</p>
              <p>{p.summary}</p>
              <ul className="chips" aria-label="Technologies">
                {p.stack.slice(0, 5).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <EvidenceBadge evidence={p.evidence} compact />
            </div>
            <span className="moon-card__cta mono" aria-hidden="true">
              OPEN CASE FILE →
            </span>
          </li>
        ))}
      </ul>
    </PlanetPage>
  );
}
