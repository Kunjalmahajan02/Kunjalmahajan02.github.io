import { worldById } from '../data/worlds.js';
import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import WorldShell from '../components/WorldShell.jsx';
import Schematic from '../components/Schematic.jsx';
import Pipeline from '../components/Pipeline.jsx';
import EvidenceBadge from '../components/EvidenceBadge.jsx';
import CustodySim from '../components/CustodySim.jsx';
import MorsePlay from '../components/MorsePlay.jsx';

const world = worldById.inventor;

// A project case study, laid out like an artefact recovered from the lab:
// problem, why it matters, approach, the system, stack, and what's next.
export default function ProjectCase({ project: p }) {
  useDocumentTitle(p.name);
  const i = projects.findIndex((x) => x.id === p.id);
  const next = projects[(i + 1) % projects.length];
  const repo = p.links.find((l) => l.href.includes('github.com'));
  const others = p.links.filter((l) => l !== repo);

  return (
    <WorldShell world={world} title={p.name} lead={p.tagline} crumb={p.name}>
      <div className="case">
        <div className="case__links">
          {repo && (
            <a className="btn btn--moon btn--small" href={repo.href} target="_blank" rel="noreferrer">
              GitHub repository<span className="visually-hidden"> (opens in a new tab)</span> ↗
            </a>
          )}
          {others.map((l) => (
            <a key={l.href} className="btn btn--ghost btn--small" href={l.href} target="_blank" rel="noreferrer">
              {l.label}
              <span className="visually-hidden"> (opens in a new tab)</span> ↗
            </a>
          ))}
          {!repo && <span className="case__norepo">Code isn’t public yet.</span>}
          <span className="case__status">{p.status}</span>
        </div>

        <section className="case__sheet" aria-labelledby="c-problem">
          <div className="case__cols">
            <div>
              <h2 id="c-problem">The problem</h2>
              <p>{p.problem}</p>
            </div>
            <div>
              <h2>Why it matters</h2>
              <p>{p.why}</p>
            </div>
          </div>
          <h2>My approach</h2>
          <p>{p.solution}</p>
          {p.highlights && (
            <ul className="case__list">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="case__sheet case__sheet--blue" aria-labelledby="c-system">
          <h2 id="c-system">The system</h2>
          <div className="case__schematic">
            <Schematic steps={p.flow} label={`${p.name} system`} />
          </div>
          <Pipeline steps={p.flow} label={`${p.name}, stage by stage`} />
        </section>

        {(p.id === 'blinkbridge' || p.id === 'chaintrack') && (
          <section className="case__sheet" aria-labelledby="c-try">
            <h2 id="c-try">{p.id === 'blinkbridge' ? 'Try the encoding' : 'Try the contract’s rules'}</h2>
            {p.id === 'blinkbridge' ? <MorsePlay /> : <CustodySim />}
          </section>
        )}

        <div className="case__cols">
          <section className="case__sheet" aria-labelledby="c-stack">
            <h2 id="c-stack">Technologies</h2>
            <ul className="tags tags--big">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            {p.languages && <p className="case__langs">Target languages: {p.languages.join(' · ')}</p>}
            <EvidenceBadge evidence={p.evidence} />
          </section>

          <section className="case__sheet" aria-labelledby="c-next">
            <h2 id="c-next">Learned &amp; next</h2>
            {p.lessons.length > 0 && (
              <ul className="case__list">
                {p.lessons.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            )}
            {p.improve?.length > 0 ? (
              <>
                <p className="case__subhead">What I’d improve</p>
                <ul className="case__list case__list--next">
                  {p.improve.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </>
            ) : (
              p.lessons.length === 0 && <p className="case__norepo">Not written up yet.</p>
            )}
          </section>
        </div>

        {(p.evaluation || p.tests) && (
          <section className="case__sheet" aria-labelledby="c-tests">
            <h2 id="c-tests">Testing</h2>
            {p.evaluation && <p>{p.evaluation}</p>}
            {p.tests && (
              <div className="table-wrap" tabIndex={0} role="region" aria-label="Test cases">
                <table className="tests">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Test</th>
                      <th scope="col">Documented result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.tests.map(([id, test, result]) => (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{test}</td>
                        <td>{result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        <a className="case__next" href={href(`inventor/${next.id}`)}>
          <span>next blueprint →</span>
          {next.name}
        </a>
      </div>
    </WorldShell>
  );
}
