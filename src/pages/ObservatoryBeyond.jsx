import { useEffect, useRef, useState } from 'react';
import { worldById } from '../data/worlds.js';
import { topics, topicById } from '../data/research.js';
import { projectById } from '../data/projects.js';
import { href, replacePath, useDocumentTitle } from '../router.js';
import { discover, say } from '../mascot.js';
import WorldShell from '../components/WorldShell.jsx';

const world = worldById.observatory;
// each topic tints the telescope's sky a little differently
const HUES = { vision: 200, deep: 265, nlp: 320, speech: 290, data: 175, hci: 340 };

const links = [];
topics.forEach((t) =>
  t.related.forEach((r) => {
    if (t.id < r || !topicById[r].related.includes(t.id)) links.push(t.id < r ? [t.id, r] : [r, t.id]);
  }),
);

export default function ObservatoryBeyond({ topicId }) {
  useDocumentTitle(world.name);
  const [selected, setSelected] = useState(topicById[topicId] ? topicId : topics[0].id);
  const seen = useRef(new Set([selected]));

  useEffect(() => {
    if (topicById[topicId]) setSelected(topicId);
  }, [topicId]);

  const select = (id) => {
    setSelected(id);
    replacePath(`observatory/${id}`);
    seen.current.add(id);
    if (seen.current.size === topics.length) discover('sky', 'you mapped my whole sky ✦ every question i’m chasing, in one constellation.');
    else say(`${topicById[id].short} — ${topics.length - seen.current.size} more stars to map.`, 'think');
  };

  const t = topicById[selected];
  const near = new Set(t.related);

  return (
    <WorldShell
      world={world}
      lead="A telescope pointed at the questions I keep looking up at. These are interests and directions I’m exploring — not published research. Choose a star."
    >
      <div className="observatory" style={{ '--hue': HUES[selected] ?? 280 }}>
        <div className="telescope">
          <div className="telescope__lens">
            <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <circle cx="50" cy="50" r="49" className="telescope__ring" />
              <path d="M50 2 V12 M50 88 V98 M2 50 H12 M88 50 H98" className="telescope__tick" />
              {links.map(([a, b]) => {
                const A = topicById[a];
                const B = topicById[b];
                const lit = a === selected || b === selected;
                return (
                  <line key={`${a}-${b}`} x1={14 + A.x * 0.72} y1={14 + A.y * 0.72} x2={14 + B.x * 0.72} y2={14 + B.y * 0.72} className={`telescope__line${lit ? ' is-lit' : ''}`} />
                );
              })}
            </svg>
            <ul aria-label="Research topics">
              {topics.map((tp) => (
                <li
                  key={tp.id}
                  className={`star${tp.id === selected ? ' is-selected' : ''}${near.has(tp.id) ? ' is-near' : ''}`}
                  style={{ left: `${14 + tp.x * 0.72}%`, top: `${14 + tp.y * 0.72}%` }}
                >
                  <button type="button" aria-pressed={tp.id === selected} onClick={() => select(tp.id)}>
                    <span className="star__point" aria-hidden="true" />
                    <span className="star__label">
                      <span aria-hidden="true">{tp.star} </span>
                      {tp.short}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="telescope__caption">
            {seen.current.size}/{topics.length} stars observed
          </p>
        </div>

        <section className="obslog" aria-live="polite" aria-labelledby="topic-title">
          <p className="obslog__date">OBSERVATION · STAR {t.star}</p>
          <h2 id="topic-title">{t.name}</h2>
          <p className="obslog__why hand">{t.why}</p>
          <h3>Directions I’m exploring</h3>
          <ul>
            {t.exploring.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <h3>Where it shows up</h3>
          {t.projects.length ? (
            <ul className="obslog__projects">
              {t.projects.map((id) => (
                <li key={id}>
                  <a href={href(`inventor/${id}`)}>{projectById[id].name} →</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="obslog__empty">Not in a project yet — it’s on the list to build.</p>
          )}
          <h3>Papers & write-ups</h3>
          {t.papers.length || t.notes.length ? (
            <ul className="obslog__projects">
              {[...t.papers, ...t.notes].map((n) => (
                <li key={n.href}>
                  <a href={n.href} target="_blank" rel="noreferrer">
                    {n.title} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="obslog__empty">None published yet — they’ll appear here.</p>
          )}
          <p className="obslog__next">
            <a href={href('garden')}>See how this grows into everything else in the Thought Garden →</a>
          </p>
        </section>
      </div>
    </WorldShell>
  );
}
