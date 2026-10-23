import { useState } from 'react';
import { creativeQuote, realms } from '../data/creative.js';
import { useDocumentTitle } from '../router.js';
import Win from '../components/Win.jsx';
import Art from '../components/Art.jsx';

const base = import.meta.env.BASE_URL;

// Moodboard pieces from the reference board, used until real photos are
// added in src/data/creative.js.
const MOODBOARD = [
  { name: 'mood-dance', w: 636, h: 792, realm: 'dance', alt: 'Illustration of Mini Kunjal mid-dance in a studio, with “Rhythm Reigners” written on the wall.' },
  { name: 'mood-back', w: 572, h: 520, realm: 'fashion', alt: 'Illustration of Mini Kunjal from behind in a backless top, against a painted floral wall.' },
  { name: 'mood-portrait', w: 688, h: 378, realm: 'modeling', alt: 'Illustrated portrait of Mini Kunjal in sunglasses, hair blowing in warm light.' },
  { name: 'mood-sketch', w: 432, h: 312, realm: 'art', alt: 'A pencil sketch of Mini Kunjal looking over her shoulder.' },
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'dance', label: 'Dance' },
  { id: 'art', label: 'Art' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'modeling', label: 'Modeling' },
];

export default function CreativeRealm() {
  useDocumentTitle('The Creative Planet');
  const [filter, setFilter] = useState('all');

  const photos = realms.flatMap((r) => r.photos.map((ph) => ({ ...ph, realm: r.id, photo: true })));
  const items = [...photos, ...MOODBOARD].filter((i) => filter === 'all' || i.realm === filter);

  return (
    <div className="creative">
      <div className="page-head">
        <h1 id="page-title" tabIndex={-1} className="glow-title">
          The Creative Planet
        </h1>
        <p>Because creativity keeps me sane.</p>
      </div>

      <div className="creative__layout">
        <Win title="Gallery" icon="✿" bodyClass="creative__body">
          <div className="creative__filters" role="group" aria-label="Show">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="empty-note">Nothing in this corner yet — photos coming soon.</p>
          ) : (
            <ul className={`collage collage--${items.length}`}>
              {items.map((i) => (
                <li key={i.name ?? i.src} className="polaroid">
                  {i.photo ? (
                    <img src={`${base}${i.src}`} alt={i.alt} loading="lazy" />
                  ) : (
                    <Art name={i.name} widths={[i.w]} alt={i.alt} width={i.w} height={i.h} />
                  )}
                  <span className="polaroid__tag hand">{FILTERS.find((f) => f.id === i.realm)?.label}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="creative__note">
            ✦ Moodboard illustrations for now — real photos from dance, art, fashion and modeling are coming soon.
          </p>
        </Win>

        <aside className="creative__side">
          <p className="bubble bubble--down creative__quote">{creativeQuote} ♡</p>
          <figure className="creative__me">
            <Art name="camera-girl" widths={[352]} alt="Chibi Mini Kunjal holding a camera." width="352" height="468" />
          </figure>
          <p className="bubble bubble--up creative__aside">art is my other way of coding ♡</p>
          <ul className="creative__realms">
            {realms.map((r) => (
              <li key={r.id}>
                <strong>{r.name}</strong>
                <span>{r.line}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
