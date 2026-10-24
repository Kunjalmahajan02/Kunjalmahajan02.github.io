import { topics, topicById, fields } from '../data/research.js';
import { projectById } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import AppWindow from '../components/AppWindow.jsx';

// RESEARCH.TXT — the areas she reads about and works in. These are
// interests, not publications; papers and notes show up when they exist.
export default function ResearchApp({ topicId }) {
  const topic = topicById[topicId];
  useDocumentTitle(topic ? topic.short : 'Research');

  if (topic) {
    return (
      <AppWindow
        file="RESEARCH.TXT"
        crumb={topic.short}
        title={topic.name}
        back={{ to: 'research', label: 'all topics' }}
        tone="lilac"
      >
        <p className="window__lead">{topic.why}</p>
        <section className="card" aria-labelledby="r-exploring">
          <h2 id="r-exploring">What I’m exploring</h2>
          <ul className="hearts">
            {topic.exploring.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <div className="cols">
          <section className="card" aria-labelledby="r-projects">
            <h2 id="r-projects">Where it shows up</h2>
            {topic.projects.length ? (
              <ul className="links-list">
                {topic.projects.map((id) => (
                  <li key={id}>
                    <a href={href(`projects/${id}`)}>{projectById[id].name} →</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="note">No project of mine uses this yet — it’s on the reading list.</p>
            )}
          </section>
          <section className="card" aria-labelledby="r-related">
            <h2 id="r-related">Connected topics</h2>
            <ul className="links-list">
              {topic.related.map((id) => (
                <li key={id}>
                  <a href={href(`research/${id}`)}>{topicById[id].short} →</a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <Papers topic={topic} />
      </AppWindow>
    );
  }

  return (
    <AppWindow file="RESEARCH.TXT" title="What I’m reading & exploring" tone="lilac">
      <p className="window__lead">
        The areas I keep coming back to — in AI and engineering, and out in the universe. They’re interests and working
        notes, not published research.
      </p>
      {fields.map((f) => (
        <section key={f.id} className="notebook-group" aria-labelledby={`field-${f.id}`}>
          <h2 id={`field-${f.id}`} className="notebook-group__title display">
            {f.name}
          </h2>
          <ul className="notebook">
            {topics
              .filter((t) => t.field === f.id)
              .map((t) => (
                <li key={t.id}>
                  <a href={href(`research/${t.id}`)}>
                    <span className="notebook__star" aria-hidden="true">
                      {t.star}
                    </span>
                    <span className="notebook__name">{t.name}</span>
                    <span className="notebook__why">{t.why}</span>
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </AppWindow>
  );
}

function Papers({ topic }) {
  if (!topic.papers.length && !topic.notes.length) {
    return <p className="note">No papers or write-ups here yet — they’ll appear as I publish them.</p>;
  }
  return (
    <section className="card" aria-labelledby="r-papers">
      <h2 id="r-papers">Papers &amp; notes</h2>
      <ul className="links-list">
        {[...topic.papers, ...topic.notes].map((p) => (
          <li key={p.href}>
            <a href={p.href} target="_blank" rel="noreferrer">
              {p.title}
              {p.venue && ` — ${p.venue}`} ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
