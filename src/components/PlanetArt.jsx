import { useId } from 'react';

// One planet, drawn in SVG: a lit sphere, a slowly drifting surface pattern,
// a terminator shadow and an optional ring split into back and front halves.

const R = 40;

function Surface({ feature, band, light }) {
  // Drawn twice, 80 units apart, so the drift animation loops seamlessly.
  const tile = (dx) => {
    switch (feature) {
      case 'craters':
        return (
          <g key={dx} transform={`translate(${dx} 0)`}>
            <circle cx="-22" cy="-14" r="7" fill={band} opacity="0.55" />
            <circle cx="6" cy="10" r="10" fill={band} opacity="0.4" />
            <circle cx="24" cy="-20" r="4" fill={band} opacity="0.5" />
            <circle cx="-8" cy="26" r="5" fill={band} opacity="0.45" />
            <ellipse cx="-30" cy="18" rx="9" ry="3" fill={light} opacity="0.25" />
          </g>
        );
      case 'network':
        return (
          <g key={dx} transform={`translate(${dx} 0)`} stroke={light} strokeWidth="0.9" opacity="0.6">
            <path d="M-30 -18 L-8 -4 L14 -22 M-8 -4 L2 18 L26 8 M-30 -18 L-24 12 L2 18" fill="none" />
            {[[-30, -18], [-8, -4], [14, -22], [2, 18], [26, 8], [-24, 12]].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="2.1" fill={light} stroke="none" />
            ))}
          </g>
        );
      case 'swirl':
        return (
          <g key={dx} transform={`translate(${dx} 0)`} fill="none" stroke={band} strokeLinecap="round">
            <path d="M-40 -16 C-20 -28 0 -4 20 -16 S40 -10 40 -10" strokeWidth="7" opacity="0.55" />
            <path d="M-40 10 C-24 0 -4 22 16 8 S40 14 40 14" strokeWidth="5" opacity="0.45" />
            <path d="M-40 28 C-20 22 0 34 40 26" strokeWidth="3" stroke={light} opacity="0.3" />
          </g>
        );
      default: // bands
        return (
          <g key={dx} transform={`translate(${dx} 0)`} fill={band}>
            <path d="M-40 -22 C-20 -27 0 -17 20 -22 S40 -22 40 -22 V-15 C20 -10 0 -19 -40 -14 Z" opacity="0.55" />
            <path d="M-40 2 C-24 -3 -6 6 12 0 S40 2 40 2 V12 C18 16 -2 6 -40 12 Z" opacity="0.4" />
            <ellipse cx="-10" cy="22" rx="12" ry="3.5" fill={light} opacity="0.35" />
            <path d="M-40 -34 H40 V-30 H-40 Z" opacity="0.25" />
          </g>
        );
    }
  };
  return <g className="planet-art__surface">{[-80, 0, 80].map(tile)}</g>;
}

export default function PlanetArt({ planet, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { light, base, dark, band } = planet.palette;
  const ring = planet.ring;

  return (
    <svg className={`planet-art ${className}`} viewBox="-64 -64 128 128" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`body${uid}`} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.45" stopColor={base} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <radialGradient id={`shade${uid}`} cx="30%" cy="26%" r="90%">
          <stop offset="0.5" stopColor="#1a0f22" stopOpacity="0" />
          <stop offset="1" stopColor="#1a0f22" stopOpacity="0.7" />
        </radialGradient>
        <radialGradient id={`glow${uid}`}>
          <stop offset="0.55" stopColor={base} stopOpacity="0.35" />
          <stop offset="1" stopColor={base} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip${uid}`}>
          <circle r={R} />
        </clipPath>
      </defs>

      <circle className="planet-art__glow" r="62" fill={`url(#glow${uid})`} />
      {ring && (
        <g transform="rotate(-16)">
          <path d="M-60 0 A60 14 0 0 1 60 0" fill="none" stroke={light} strokeOpacity="0.5" strokeWidth="2.4" />
          <path d="M-52 0 A52 11 0 0 1 52 0" fill="none" stroke={band} strokeOpacity="0.55" strokeWidth="1.2" />
        </g>
      )}
      <circle r={R} fill={`url(#body${uid})`} />
      <g clipPath={`url(#clip${uid})`}>
        <Surface feature={planet.feature} band={band} light={light} />
      </g>
      <circle r={R} fill={`url(#shade${uid})`} />
      <circle r={R - 0.4} fill="none" stroke={light} strokeOpacity="0.35" strokeWidth="0.8" />
      {ring && (
        <g transform="rotate(-16)">
          <path d="M-60 0 A60 14 0 0 0 60 0" fill="none" stroke={light} strokeOpacity="0.75" strokeWidth="2.4" />
          <path d="M-52 0 A52 11 0 0 0 52 0" fill="none" stroke={band} strokeOpacity="0.7" strokeWidth="1.2" />
        </g>
      )}
    </svg>
  );
}
