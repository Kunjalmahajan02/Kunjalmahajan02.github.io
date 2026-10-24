import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import AppWindow from '../components/AppWindow.jsx';
import Pipeline from '../components/Pipeline.jsx';
import EvidenceBadge from '../components/EvidenceBadge.jsx';
import CustodySim from '../components/CustodySim.jsx';
import MorsePlay from '../components/MorsePlay.jsx';

// PROJECTS.EXE — a folder of builds, and a case study for each one.
export default function ProjectsApp({ project }) {
  useDocumentTitle(project ? project.name : 'Projects');
  if (project) return <Case p={project} />;
  return (
    <AppWindow file="PROJECTS.EXE" title="Things I’ve built" tone="pink">
      <p className="window__lead">
        Computer vision, speech, blockchain and the odd game. Each one says plainly where its facts come from — checked
        against code, or taken from my résumé.
      </p>
      <ul className="folder">
        {projects.map((p, i) => (
          <li key={p.id}>
            <a className={`file-card file-card--${i % 4}`} href={href(`projects/${p.id}`)}>
              <span className="file-card__num display">{String(i + 1).padStart(2, '0')}</span>
              <span className="file-card__name">{p.name}</span>
              <span className="file-card__line">{p.tagline}</span>
              <span className="file-card__meta">
                <span>{p.status}</span>
                <span className={`chip chip--${p.evidence.level}`}>
                  {p.evidence.level === 'verified' ? '◆ verified' : '◇ from résumé'}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </AppWindow>
  );
}

function Case({ p }) {
  const i = projects.findIndex((x) => x.id === p.id);
  const next = projects[(i + 1) % projects.length];
  const repo = p.links.find((l) => l.href.includes('github.com'));
  const others = p.links.filter((l) => l !== repo);

  return (
    <AppWindow
      file="PROJECTS.EXE"
      crumb={p.name}
      title={p.name}
      back={{ to: 'projects', label: 'all projects' }}
      tone="pink"
    >
      <p className="window__lead">{p.tagline}</p>
      <div className="case__links">
        {repo && (
          <a className="btn" href={repo.href} target="_blank" rel="noreferrer">
            GitHub repository
            <span className="visually-hidden"> (opens in a new tab)</span> ↗
          </a>
        )}
        {others.map((l) => (
          <a key={l.href} className="btn btn--ghost" href={l.href} target="_blank" rel="noreferrer">
            {l.label}
            <span className="visually-hidden"> (opens in a new tab)</span> ↗
          </a>
        ))}
        {!repo && <span className="note">Code isn’t public yet.</span>}
        <span className="chip">{p.status}</span>
      </div>

      <div className="cols">
        <section className="card" aria-labelledby="c-problem">
          <h2 id="c-problem">The problem</h2>
          <p>{p.problem}</p>
        </section>
        <section className="card" aria-labelledby="c-why">
          <h2 id="c-why">Why it matters</h2>
          <p>{p.why}</p>
        </section>
      </div>

      <section className="card" aria-labelledby="c-approach">
        <h2 id="c-approach">My approach</h2>
        <p>{p.solution}</p>
        {p.highlights && (
          <ul className="hearts">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card card--lilac" aria-labelledby="c-system">
        <h2 id="c-system">How it works</h2>
        <Pipeline steps={p.flow} label={`${p.name}, stage by stage`} />
      </section>

      {(p.id === 'blinkbridge' || p.id === 'chaintrack') && (
        <section className="card" aria-labelledby="c-try">
          <h2 id="c-try">{p.id === 'blinkbridge' ? 'Try the encoding' : 'Try the contract’s rules'}</h2>
          {p.id === 'blinkbridge' ? <MorsePlay /> : <CustodySim />}
        </section>
      )}

      <div className="cols">
        <section className="card" aria-labelledby="c-stack">
          <h2 id="c-stack">Built with</h2>
          <ul className="tags">
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {p.languages && <p className="note">Target languages: {p.languages.join(' · ')}</p>}
          <EvidenceBadge evidence={p.evidence} />
        </section>

        <section className="card" aria-labelledby="c-next">
          <h2 id="c-next">Learned &amp; next</h2>
          {p.lessons.length > 0 && (
            <ul className="hearts">
              {p.lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          )}
          {p.improve?.length > 0 ? (
            <>
              <p className="subhead">What I’d improve</p>
              <ul className="hearts">
                {p.improve.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </>
          ) : (
            p.lessons.length === 0 && <p className="note">Not written up yet.</p>
          )}
        </section>
      </div>

      {(p.evaluation || p.tests) && (
        <section className="card" aria-labelledby="c-tests">
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

      <a className="next-link" href={href(`projects/${next.id}`)}>
        <span className="display">next file →</span>
        {next.name}
      </a>
    </AppWindow>
  );
}
