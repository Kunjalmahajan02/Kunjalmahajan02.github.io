import { useState } from 'react';
import { categories, entries } from '../data/archive.js';
import { projectById } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import Win from '../components/Win.jsx';
import Art from '../components/Art.jsx';

const labelOf = Object.fromEntries(categories.map((c) => [c.id, c.label]));
const ICON = { all: '♡', log: '✎', research: '✧', experiment: '⚗', concept: '◇', ideas: '☁', lesson: '★' };

export default function IdeaArchive() {
  useDocumentTitle('The Idea Archive');
  const [cat, setCat] = useState('all');
  const shown = cat === 'all' ? entries : entries.filter((e) => e.category === cat);

  return (
    <div className="archive">
      <div className="page-head">
        <h1 id="page-title" tabIndex={-1} className="glow-title">
          The Idea Archive
        </h1>
        <p>A digital diary of how I learn, experiment and build.</p>
      </div>

      <div className="archive__layout">
        <aside className="archive__side">
          <Win title="Notebook" icon="✎" bodyClass="archive__cats">
            <ul>
              {categories.map((c) => {
                const count = c.id === 'all' ? entries.length : entries.filter((e) => e.category === c.id).length;
                return (
                  <li key={c.id}>
                    <button type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                      <span className="archive__cat-icon" aria-hidden="true">
                        {ICON[c.id]}
                      </span>
                      <span className="archive__cat-name">{c.label}</span>
                      <span className="archive__count">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Win>
          <figure className="archive__me">
            <Art
              name="archive-girl"
              widths={[720]}
              alt="Chibi Mini Kunjal with headphones, writing notes in a sketchbook at her desk."
              width="720"
              height="583"
            />
            <figcaption className="archive__sticky hand">
              Just a girl who loves research, pretty notebooks &amp; big ideas <span aria-hidden="true">♡</span>
            </figcaption>
          </figure>
        </aside>

        <div className="archive__pages">
          <p className="archive__notice">
            ✦ Starter entries — drawn from what’s documented in my project repositories; each links to its source.
          </p>
          {shown.length === 0 ? (
            <div className="paper archive__empty">
              <p className="hand">{labelOf[cat]}</p>
              <p>Nothing filed here yet — this page is waiting for its first entry.</p>
            </div>
          ) : (
            <ul className="notes">
              {shown.map((e) => (
                <li key={e.id} className="paper note">
                  <span className="note__heart" aria-hidden="true">
                    ♡
                  </span>
                  <h2>{e.title}</h2>
                  <p className="note__meta">
                    {labelOf[e.category]}
                    {e.project && (
                      <>
                        {' · '}
                        <a href={href(`projects/${e.project}`)}>{projectById[e.project].name}</a>
                      </>
                    )}
                  </p>
                  {e.note && <p className="note__aside hand">{e.note}</p>}
                  {e.body?.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                  {e.list && (
                    <ul className="checklist">
                      {e.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {e.source && (
                    <p className="note__source">
                      source:{' '}
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
    </div>
  );
}
