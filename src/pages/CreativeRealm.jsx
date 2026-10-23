import { useState } from 'react';
import { planetById } from '../data/planets.js';
import { creativeQuote, realms } from '../data/creative.js';
import { useDocumentTitle } from '../router.js';
import PlanetPage from '../components/PlanetPage.jsx';

const base = import.meta.env.BASE_URL;

// Fine-line motifs standing in for each realm until photos are added.
function Motif({ kind }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round' };
  switch (kind) {
    case 'wave':
      return (
        <g {...common}>
          <path d="M10 70 C40 20 70 120 100 60 S160 20 190 70" />
          <path d="M10 90 C40 40 70 140 100 80 S160 40 190 90" opacity="0.5" />
          <circle cx="100" cy="36" r="6" />
        </g>
      );
    case 'sketch':
      return (
        <g {...common}>
          <path d="M40 120 L120 40 L140 60 L60 140 Z" />
          <path d="M120 40 L132 28 L152 48 L140 60" />
          <path d="M30 150 C70 130 110 160 170 135" opacity="0.5" />
        </g>
      );
    case 'drape':
      return (
        <g {...common}>
          <path d="M100 20 L70 50 L60 160 L140 160 L130 50 Z" />
          <path d="M70 50 C85 70 115 70 130 50" />
          <path d="M80 160 C90 110 85 90 95 60 M120 160 C110 110 115 90 105 60" opacity="0.5" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <rect x="45" y="25" width="110" height="130" rx="4" />
          <circle cx="100" cy="72" r="18" />
          <path d="M65 145 C70 110 130 110 135 145" />
        </g>
      );
  }
}

export default function CreativeRealm() {
  useDocumentTitle('Creative Realm');
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? realms : realms.filter((r) => r.id === filter);

  return (
    <PlanetPage
      planet={planetById.creative}
      title="Creative Realm"
      lead="The orbit outside engineering — dance, art, fashion and modeling. Different instruments, same curiosity."
    >
      <blockquote className="creative__quote">
        <p>“{creativeQuote}”</p>
      </blockquote>

      <div className="creative__filters" role="group" aria-label="Show realm">
        {[{ id: 'all', name: 'All' }, ...realms].map((r) => (
          <button key={r.id} type="button" aria-pressed={filter === r.id} onClick={() => setFilter(r.id)}>
            {r.id === 'all' ? 'All' : r.name.split(/[ ,&]/)[0]}
          </button>
        ))}
      </div>

      <ul className={`gallery${shown.length === 1 ? ' gallery--single' : ''}`}>
        {shown.map((r) => (
          <li key={r.id} className="frame">
            {r.photos.length > 0 ? (
              <div className="frame__photos">
                {r.photos.map((ph) => (
                  <img key={ph.src} src={`${base}${ph.src}`} alt={ph.alt} loading="lazy" />
                ))}
              </div>
            ) : (
              <div className="frame__art">
                <svg viewBox="0 0 200 180" aria-hidden="true" focusable="false">
                  <Motif kind={r.motif} />
                </svg>
                <p className="mono frame__empty">PHOTOS COMING SOON</p>
              </div>
            )}
            <div className="frame__caption">
              <h2>{r.name}</h2>
              <p>{r.line}</p>
            </div>
          </li>
        ))}
      </ul>
    </PlanetPage>
  );
}
