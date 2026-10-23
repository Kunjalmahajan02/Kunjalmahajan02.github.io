import { useEffect, useState } from 'react';
import { projects, projectById } from '../data/projects.js';
import { href, replacePath, useDocumentTitle } from '../router.js';
import Win from '../components/Win.jsx';
import Art from '../components/Art.jsx';
import Pipeline from '../components/Pipeline.jsx';
import EvidenceBadge from '../components/EvidenceBadge.jsx';
import CustodySim from '../components/CustodySim.jsx';
import MorsePlay from '../components/MorsePlay.jsx';

const ICONS = { blinkbridge: null, speech: '〰', chaintrack: '⛓' };

function tabsFor(p) {
  return [
    { id: 'overview', label: 'Overview' },
    { id: 'how', label: 'How it works' },
    { id: 'stack', label: 'Tech stack' },
    { id: 'results', label: 'Results' },
    { id: 'future', label: 'Future scope' },
    ...(p.id === 'chaintrack' || p.id === 'blinkbridge' ? [{ id: 'try', label: 'Try it ♡' }] : []),
  ];
}

const FUTURE = {
  blinkbridge: [
    'Adaptive timing in live webcam mode',
    'Telling intentional blinks from involuntary ones',
    'Video integrity checks for edited or tampered footage',
    'Running on low-power edge hardware such as a Raspberry Pi',
  ],
  chaintrack: [
    'Linking products to trusted real-world inputs — QR codes, tamper-proof tags or IoT sensors — so verification covers the physical item',
    'Deploying beyond the local test network',
  ],
};

export default function Projects({ projectId }) {
  const p = projectById[projectId] ?? projects[0];
  useDocumentTitle(p.name);
  const tabs = tabsFor(p);
  const [tab, setTab] = useState('overview');
  useEffect(() => setTab('overview'), [p.id]);
  useEffect(() => {
    if (!projectById[projectId]) replacePath(`projects/${p.id}`);
  }, [projectId, p.id]);

  const onKey = (e) => {
    const i = tabs.findIndex((t) => t.id === tab);
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const t = tabs[(next + tabs.length) % tabs.length];
    setTab(t.id);
    document.getElementById(`tab-${t.id}`)?.focus();
  };

  const repo = p.links.find((l) => l.href.includes('github.com'));
  const others = p.links.filter((l) => l !== repo);

  return (
    <div className="projects">
      <div className="page-head">
        <h1 id="page-title" tabIndex={-1} className="glow-title">
          My Projects
        </h1>
        <p>Engineering case studies — what each one solves, how it works, and what I learned.</p>
      </div>

      <Win className="projects__win" title={`Projects  ›  ${p.name}`} bodyClass="projects__body" icon="✦">
        <nav className="projects__side" aria-label="Projects">
          <ul>
            {projects.map((x) => (
              <li key={x.id}>
                <a href={href(`projects/${x.id}`)} aria-current={x.id === p.id ? 'page' : undefined}>
                  <span className="projects__side-icon" aria-hidden="true">
                    {x.id === 'blinkbridge' ? '◉' : ICONS[x.id]}
                  </span>
                  {x.name.replace(' & Translation Engine', '')}
                </a>
              </li>
            ))}
            <li className="projects__soon">
              <span aria-hidden="true">✧</span> More projects
              <small>(coming soon)</small>
            </li>
          </ul>
        </nav>

        <article className="projects__main" aria-labelledby="project-name">
          <header className="projects__head">
            <div className="projects__logo" aria-hidden="true">
              {p.id === 'blinkbridge' ? (
                <Art name="blinkbridge-icon" widths={[260]} alt="" width="260" height="256" />
              ) : (
                <span>{ICONS[p.id]}</span>
              )}
            </div>
            <div>
              <h2 id="project-name">{p.name}</h2>
              <p className="projects__tagline">{p.tagline}</p>
              <ul className="chips">
                {p.stack.slice(0, 4).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="projects__actions">
                {repo && (
                  <a className="btn btn--dark btn--small" href={repo.href} target="_blank" rel="noreferrer">
                    GitHub<span className="visually-hidden"> (opens in a new tab)</span> ↗
                  </a>
                )}
                {others.map((l) => (
                  <a key={l.href} className="btn btn--light btn--small" href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                    <span className="visually-hidden"> (opens in a new tab)</span> ↗
                  </a>
                ))}
                {!repo && <span className="empty-note">Code isn’t public yet.</span>}
              </div>
            </div>
          </header>

          <div className="tabs" role="tablist" aria-label={`${p.name} sections`} onKeyDown={onKey}>
            {tabs.map((t) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="tab-panel"
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="tab-panel" id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
            {tab === 'overview' && (
              <>
                <h3>The Problem</h3>
                <p>{p.problem}</p>
                <h3>My Solution</h3>
                <p>{p.solution}</p>
                <h3>Key decisions</h3>
                <ul className="decisions">
                  {p.decisions.map((d) => (
                    <li key={d.title}>
                      <strong>{d.title}.</strong> {d.body}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {tab === 'how' && <Pipeline steps={p.flow} label={`${p.name} pipeline`} />}
            {tab === 'stack' && (
              <>
                <ul className="chips chips--big">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {p.languages && (
                  <p className="projects__langs">
                    <strong>Target languages:</strong> {p.languages.join(' · ')}
                  </p>
                )}
                <EvidenceBadge evidence={p.evidence} />
              </>
            )}
            {tab === 'results' && (
              <>
                {p.evaluation ? <p>{p.evaluation}</p> : <p className="empty-note">No results documented yet.</p>}
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
                {p.lessons.length > 0 && (
                  <>
                    <h3>Lessons & limits</h3>
                    <ul className="lessons">
                      {p.lessons.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            {tab === 'future' &&
              (FUTURE[p.id] ? (
                <ul className="checklist">
                  {FUTURE[p.id].map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-note">Future scope isn’t documented yet for this project.</p>
              ))}
            {tab === 'try' && (p.id === 'chaintrack' ? <CustodySim /> : <MorsePlay />)}
          </div>
        </article>

        <aside className="projects__aside" aria-label="Note">
          <div className="projects__sticker">
            <Art name="project-girl" widths={[296]} alt="Chibi Mini Kunjal with headphones, hugging a white cat plush." width="296" height="488" />
            <p className="bubble bubble--left projects__bubble">
              {p.id === 'blinkbridge' ? 'this was one of my favourite projects! ♡' : p.id === 'chaintrack' ? 'try breaking the rules in “Try it” ♡' : 'six languages, one pipeline ♡'}
            </p>
          </div>
          <EvidenceBadge evidence={p.evidence} compact />
          <p className="projects__status">
            <span className="mono">STATUS</span> {p.status}
          </p>
        </aside>
      </Win>
    </div>
  );
}
