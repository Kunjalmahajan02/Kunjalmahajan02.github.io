import { planetById } from '../data/planets.js';
import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import { isReducedMotion } from '../motion.js';
import PlanetPage from '../components/PlanetPage.jsx';
import Pipeline from '../components/Pipeline.jsx';
import EvidenceBadge from '../components/EvidenceBadge.jsx';
import CustodySim from '../components/CustodySim.jsx';

function Section({ id, title, children }) {
  return (
    <section className="case__section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}

export default function ProjectDetail({ project: p }) {
  useDocumentTitle(p.name);

  const i = projects.findIndex((x) => x.id === p.id);
  const next = projects[(i + 1) % projects.length];

  const sections = [
    ['overview', 'Problem & solution'],
    ['workflow', 'How it works'],
    p.id === 'chaintrack' && ['try', 'Try the rules'],
    ['decisions', 'Design decisions'],
    (p.evaluation || p.tests) && ['testing', 'Testing & evaluation'],
    p.lessons.length > 0 && ['lessons', 'Lessons & limits'],
  ].filter(Boolean);

  // In-page jumps use buttons (the URL hash is reserved for routing).
  const jump = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    el?.querySelector('h2')?.setAttribute('tabindex', '-1');
    el?.querySelector('h2')?.focus({ preventScroll: true });
  };

  return (
    <PlanetPage
      planet={planetById.lab}
      title={p.name}
      lead={p.tagline}
      crumbs={[p.name]}
      actions={
        p.links.length > 0 ? (
          p.links.slice(0, 2).map((l, n) => (
            <a key={l.href} className={`btn btn--small${n === 0 ? ' btn--accent' : ''}`} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
              <span className="visually-hidden"> (opens in a new tab)</span> ↗
            </a>
          ))
        ) : (
          <span className="empty-note">Code not public yet — details below are from the project description.</span>
        )
      }
    >
      <div className="case">
        <aside className="case__file" aria-label="Case file">
          <p className="mono case__file-head">CASE FILE · {p.moon}</p>
          <dl>
            <div>
              <dt className="mono">STATUS</dt>
              <dd>{p.status}</dd>
            </div>
            <div>
              <dt className="mono">STACK</dt>
              <dd>
                <ul className="chips">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </dd>
            </div>
            {p.languages && (
              <div>
                <dt className="mono">TARGET LANGUAGES</dt>
                <dd>{p.languages.join(' · ')}</dd>
              </div>
            )}
            <div>
              <dt className="mono">LINKS</dt>
              <dd>
                {p.links.length === 0 ? (
                  <span className="empty-note">Repository not public yet — no demo link available.</span>
                ) : (
                  <ul className="case__links">
                    {p.links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noreferrer">
                          {l.label}
                          <span className="visually-hidden"> (opens in a new tab)</span> ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          </dl>
          <EvidenceBadge evidence={p.evidence} />
          <nav aria-label="On this page" className="case__toc">
            <p className="mono">ON THIS PAGE</p>
            <ul>
              {sections.map(([id, label]) => (
                <li key={id}>
                  <button type="button" className="link-button" onClick={() => jump(id)}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="case__main">
          <Section id="overview" title="Problem & solution">
            <p className="case__summary">{p.summary}</p>
            <div className="case__pair">
              <div>
                <h3 className="mono">THE PROBLEM</h3>
                <p>{p.problem}</p>
              </div>
              <div>
                <h3 className="mono">THE APPROACH</h3>
                <p>{p.solution}</p>
              </div>
            </div>
          </Section>

          <Section id="workflow" title="How it works">
            <Pipeline steps={p.flow} label={`${p.name} workflow`} />
          </Section>

          {p.id === 'chaintrack' && (
            <Section id="try" title="Try the rules">
              <CustodySim />
            </Section>
          )}

          <Section id="decisions" title="Design decisions">
            <ul className="decisions">
              {p.decisions.map((d) => (
                <li key={d.title}>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </li>
              ))}
            </ul>
          </Section>

          {(p.evaluation || p.tests) && (
            <Section id="testing" title="Testing & evaluation">
              {p.evaluation && <p>{p.evaluation}</p>}
              {p.tests && (
                <div className="table-wrap" tabIndex={0} role="region" aria-label="ChainTrack test cases">
                  <table className="tests">
                    <caption className="visually-hidden">ChainTrack test cases, as documented in the repository</caption>
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
                          <td className="mono">{id}</td>
                          <td>{test}</td>
                          <td>{result}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          )}

          {p.lessons.length > 0 && (
            <Section id="lessons" title="Lessons & limits">
              <ul className="lessons">
                {p.lessons.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </Section>
          )}

          <a className="next-moon" href={href(`lab/${next.id}`)}>
            <span className="mono">NEXT MOON · {next.moon}</span>
            <span className="next-moon__name">{next.name} →</span>
          </a>
        </div>
      </div>
    </PlanetPage>
  );
}
