import { useState } from 'react';
import { planetById } from '../data/planets.js';
import { categories, entries } from '../data/archive.js';
import { projectById } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import PlanetPage from '../components/PlanetPage.jsx';
import Terminal from '../components/Terminal.jsx';

const labelOf = Object.fromEntries(categories.map((c) => [c.id, c.label]));

export default function IdeaArchive() {
  useDocumentTitle('The Idea Archive');
  const [cat, setCat] = useState('all');
  const shown = cat === 'all' ? entries : entries.filter((e) => e.category === cat);

  return (
    <PlanetPage
      planet={planetById.archive}
      title="The Idea Archive"
      lead="A notebook of the thinking behind the work — what broke, what I changed, and what I want to try next."
    >
      <div className="archive">
        <nav className="archive__cats" aria-label="Notebook sections">
          <p className="mono">SECTIONS</p>
          <ul>
            {categories.map((c) => {
              const count = c.id === 'all' ? entries.length : entries.filter((e) => e.category === c.id).length;
              return (
                <li key={c.id}>
                  <button type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                    <span>{c.label}</span>
                    <span className="mono archive__count">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="archive__pages">
          <p className="archive__notice">
            <span className="mono">STARTER ENTRIES</span> These first notes are drawn from what’s documented in my project
            repositories; each one links to its source.
          </p>
          {shown.length === 0 ? (
            <div className="empty-page">
              <p className="mono">{labelOf[cat].toUpperCase()} · EMPTY</p>
              <p>No {labelOf[cat].toLowerCase()} filed yet. This page is waiting for its first entry.</p>
            </div>
          ) : (
            <ul className="notes">
              {shown.map((e) => (
                <li key={e.id} className="note">
                  <p className="mono note__meta">
                    {labelOf[e.category].toUpperCase()}
                    {e.project && (
                      <>
                        {' · '}
                        <a href={href(`lab/${e.project}`)}>{projectById[e.project].name}</a>
                      </>
                    )}
                  </p>
                  <h2>{e.title}</h2>
                  {e.note && <p className="note__aside">{e.note}</p>}
                  {e.body?.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                  {e.list && (
                    <ul className="note__list">
                      {e.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {e.source && (
                    <p className="note__source mono">
                      SOURCE ·{' '}
                      <a href={e.source.href} target="_blank" rel="noreferrer">
                        {e.source.label}
                        <span className="visually-hidden"> (opens in a new tab)</span> ↗
                      </a>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <section className="archive__terminal" aria-labelledby="terminal-title">
        <h2 id="terminal-title" className="mono eyebrow">
          ARCHIVE TERMINAL
        </h2>
        <p className="section-hint">Prefer typing? Navigate the universe from here — try “ls”, then “open observatory”.</p>
        <Terminal />
      </section>
    </PlanetPage>
  );
}
