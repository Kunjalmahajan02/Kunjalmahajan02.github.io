import { worldById } from '../data/worlds.js';
import { alsoMe, creativeQuote, stages } from '../data/creative.js';
import { useDocumentTitle } from '../router.js';
import { discover, say } from '../mascot.js';
import WorldShell from '../components/WorldShell.jsx';

const base = import.meta.env.BASE_URL;
const world = worldById.daydream;

const LINES = {
  dance: 'kathak, folk, contemporary — and leading the crew ♡',
  art: 'sketching is my other way of debugging my brain.',
  fashion: 'colour, silhouette, detail. same as good UI, honestly.',
  modeling: 'Miss Fresher 2023 ✦ the other side of the camera.',
};

// Floating stages for each creative world. Images are moodboard
// illustrations from the reference board until real photos are added in
// src/data/creative.js.
export default function Daydream() {
  useDocumentTitle(world.name);

  return (
    <WorldShell world={world} lead="A dream city of floating stages — where the creative side of my brain lives.">
      <blockquote className="daydream__quote hand">“{creativeQuote}”</blockquote>

      <ul className="stages">
        {stages.map((s, i) => (
          <li key={s.id} className={`stage stage--${i % 2 ? 'right' : 'left'}`}>
            <figure className="stage__art" onMouseEnter={() => say(LINES[s.id], i === 0 ? 'dance' : 'wow')}>
              {s.photo ? (
                <img src={`${base}${s.photo}`} alt={s.art.alt} loading="lazy" />
              ) : (
                <img
                  src={`${base}art/${s.art.name}-${s.art.w}.webp`}
                  alt={s.art.alt}
                  width={s.art.w}
                  height={s.art.h}
                  loading="lazy"
                  style={{ '--natural': `${s.art.w}px` }}
                />
              )}
              {!s.photo && <figcaption>moodboard illustration</figcaption>}
            </figure>
            <div className="stage__text">
              <p className="stage__num">STAGE 0{i + 1}</p>
              <h2>{s.name}</h2>
              <p>{s.line}</p>
              {s.credits.length > 0 && (
                <ul className="stage__credits">
                  {s.credits.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
            <span className="stage__platform" aria-hidden="true" />
          </li>
        ))}
      </ul>

      <section className="alsome" aria-labelledby="alsome-title">
        <h2 id="alsome-title">Also, somehow</h2>
        <ul>
          {alsoMe.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      <button type="button" className="wish" onClick={() => discover('wish', 'you caught a shooting star — make a wish ✦')} aria-label="A shooting star — make a wish">
        <span aria-hidden="true">✦</span>
      </button>
    </WorldShell>
  );
}
