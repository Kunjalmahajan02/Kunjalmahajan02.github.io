import { planetById } from '../data/planets.js';
import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import PlanetPage from '../components/PlanetPage.jsx';
import EvidenceBadge from '../components/EvidenceBadge.jsx';
import Pipeline from '../components/Pipeline.jsx';

// Everything a recruiter needs is on this first screen: what each project
// does, its pipeline, the verified stack and the repository.
export default function AiLab() {
  useDocumentTitle('AI Lab');
  return (
    <PlanetPage
      planet={planetById.lab}
      title="AI Lab"
      lead="Three projects — computer vision, speech, and blockchain. Each shows its pipeline, its stack and where the code lives; open a case study for the full design."
    >
      <ul className="lab-list">
        {projects.map((p) => {
          const repo = p.links.find((l) => l.href.includes('github.com'));
          return (
            <li key={p.id} className="lab-case">
              <div className="lab-case__head">
                <p className="mono lab-case__meta">
                  {p.moon} · {p.status.toUpperCase()}
                </p>
                <h2>{p.name}</h2>
                <p className="lab-case__tagline">{p.tagline}</p>
              </div>

              <p className="lab-case__summary">{p.summary}</p>

              <div className="lab-case__block">
                <h3 className="mono">PIPELINE</h3>
                <Pipeline steps={p.flow} label={`${p.name} pipeline`} compact />
              </div>

              <div className="lab-case__block">
                <h3 className="mono">STACK</h3>
                <ul className="chips" aria-label={`${p.name} technologies`}>
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="lab-case__foot">
                <EvidenceBadge evidence={p.evidence} compact />
                <div className="lab-case__actions">
                  <a className="btn btn--small btn--accent" href={href(`lab/${p.id}`)}>
                    Read the case study →
                  </a>
                  {repo ? (
                    <a className="btn btn--small" href={repo.href} target="_blank" rel="noreferrer">
                      GitHub<span className="visually-hidden"> repository for {p.name} (opens in a new tab)</span> ↗
                    </a>
                  ) : (
                    <span className="empty-note lab-case__norepo">Code not public yet</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </PlanetPage>
  );
}
