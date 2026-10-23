import { useEffect, useState } from 'react';
import { topics, topicById } from '../data/research.js';
import { projectById } from '../data/projects.js';
import { href, replacePath } from '../router.js';
import Win from '../components/Win.jsx';

// Unique pairs of related topics, drawn as constellation lines.
const links = [];
topics.forEach((t) =>
  t.related.forEach((r) => {
    if (t.id < r) links.push([t.id, r]);
    else if (!topicById[r].related.includes(t.id)) links.push([r, t.id]);
  }),
);

export default function Observatory({ topicId }) {
  const [selected, setSelected] = useState(topicById[topicId] ? topicId : topics[0].id);

  useEffect(() => {
    if (topicById[topicId]) setSelected(topicId);
  }, [topicId]);

  const select = (id) => {
    setSelected(id);
    replacePath(`research/${id}`);
  };

  const t = topicById[selected];
  const near = new Set(t.related);

  return (
    <Win title="Star map · research interests" icon="✧" className="research__win">
      <p className="research__lead">Areas I’m studying and building toward — interests and explorations, not published research. Each star links to the work where it shows up so far.</p>
      <div className="observatory">
        <div className="constellation">
          <p className="mono constellation__head">STAR MAP · 6 TOPICS · SELECT A STAR</p>
          <div className="constellation__sky">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              {links.map(([a, b]) => {
                const A = topicById[a];
                const B = topicById[b];
                const lit = a === selected || b === selected;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    className={`constellation__line${lit ? ' is-lit' : ''}`}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>
            <ul aria-label="Research topics">
              {topics.map((tp) => (
                <li
                  key={tp.id}
                  className={`star${tp.id === selected ? ' is-selected' : ''}${near.has(tp.id) ? ' is-near' : ''}`}
                  style={{ left: `${tp.x}%`, top: `${tp.y}%` }}
                >
                  <button type="button" aria-pressed={tp.id === selected} onClick={() => select(tp.id)}>
                    <span className="star__point" aria-hidden="true" />
                    <span className="star__label">
                      <span className="mono star__greek" aria-hidden="true">
                        {tp.star}
                      </span>
                      {tp.short}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="topic" aria-live="polite" aria-labelledby="topic-title">
          <p className="mono eyebrow">STAR {t.star} · AREA OF INTEREST</p>
          <h2 id="topic-title">{t.name}</h2>
          <p className="topic__why">{t.why}</p>

          <h3 className="mono topic__sub">CURRENTLY EXPLORING</h3>
          <ul className="topic__list">
            {t.exploring.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>

          <h3 className="mono topic__sub">WHERE IT SHOWS UP</h3>
          {t.projects.length ? (
            <ul className="topic__projects">
              {t.projects.map((id) => (
                <li key={id}>
                  <a href={href(`projects/${id}`)}>{projectById[id].name} →</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">No project uses this directly yet — it’s on the list to build.</p>
          )}

          <h3 className="mono topic__sub">PAPERS & WRITE-UPS</h3>
          {t.papers.length || t.notes.length ? (
            <ul className="topic__projects">
              {[...t.papers, ...t.notes].map((n) => (
                <li key={n.href}>
                  <a href={n.href} target="_blank" rel="noreferrer">
                    {n.title}
                    {n.venue ? ` — ${n.venue}` : ''} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">Nothing published here yet. Papers, summaries and experiment notes will appear in this space.</p>
          )}

          <h3 className="mono topic__sub">NEARBY STARS</h3>
          <ul className="chips chips--buttons">
            {t.related.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => select(id)}>
                  {topicById[id].star} {topicById[id].short}
                </button>
              </li>
            ))}
          </ul>
          <p className="topic__map-link">
            <a href={href('research/map')}>See how this connects in the Data Realm →</a>
          </p>
        </section>
      </div>
    </Win>
  );
}
