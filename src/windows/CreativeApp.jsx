import { stages, alsoMe, creativeQuote } from '../data/creative.js';
import { useDocumentTitle } from '../router.js';
import AppWindow from '../components/AppWindow.jsx';

const BASE = import.meta.env.BASE_URL;

// CREATIVE.EXE — dance, art, fashion and modelling, with the credits from
// her résumé.
export default function CreativeApp() {
  useDocumentTitle('Creative');
  return (
    <AppWindow file="CREATIVE.EXE" title="Dance, art & the stage" tone="peach">
      <p className="window__lead hand window__quote">“{creativeQuote}”</p>
      <ul className="polaroids">
        {stages.map((s, i) => (
          <li key={s.id} className={`polaroid polaroid--${i % 4}`}>
            <figure>
              <img
                src={`${BASE}${s.photo ?? `art/${s.art.name}-${s.art.w}.webp`}`}
                width={s.art.w}
                height={s.art.h}
                alt={s.art.alt}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="hand">{s.name}</figcaption>
            </figure>
            <div className="polaroid__text">
              <p>{s.line}</p>
              {s.credits.length > 0 && (
                <ul className="hearts">
                  {s.credits.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
      <section className="card" aria-labelledby="also-me">
        <h2 id="also-me">Also me</h2>
        <ul className="tags tags--soft">
          {alsoMe.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
    </AppWindow>
  );
}
