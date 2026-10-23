import { forwardRef, useState } from 'react';
import { planets } from '../data/planets.js';
import { go, href } from '../router.js';
import { isReducedMotion } from '../motion.js';
import PlanetArt from './PlanetArt.jsx';
import Mascot from './Mascot.jsx';

// The navigation itself: a small solar system on a 1000 × 760 stage. Each
// planet is a real link to its destination. Selecting one lifts it toward the
// viewer while the rest of the system fades, then travels there.

const W = 1000;
const H = 760;
const CX = 520;
const CY = 372;
const ORBITS = {
  1: { rx: 170, ry: 108, period: 70 },
  2: { rx: 290, ry: 186, period: 110 },
  3: { rx: 400, ry: 272, period: 150 },
};

function place(p) {
  const o = ORBITS[p.orbit];
  const a = (p.angle * Math.PI) / 180;
  return { x: CX + o.rx * Math.cos(a), y: CY + o.ry * Math.sin(a) };
}

const pct = (v, total) => `${(v / total) * 100}%`;

const SolarSystem = forwardRef(function SolarSystem({ onHover, guideLine }, ref) {
  const [active, setActive] = useState(null);
  const [warping, setWarping] = useState(null);

  const activate = (p) => {
    setActive(p?.id ?? null);
    onHover?.(p);
  };

  const travel = (e, p) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (warping) return;
    if (isReducedMotion()) {
      go(p.id);
      return;
    }
    setWarping(p.id);
    window.setTimeout(() => go(p.id), 620);
  };

  const activeOrbit = planets.find((p) => p.id === (warping ?? active))?.orbit;
  const warpTarget = warping ? place(planets.find((p) => p.id === warping)) : null;

  return (
    <div
      className={`system${warping ? ' is-warping' : ''}${active ? ' has-active' : ''}`}
      style={warpTarget ? { '--wx': pct(warpTarget.x, W), '--wy': pct(warpTarget.y, H) } : undefined}
    >
      <div className="system__field" ref={ref}>
        <svg className="system__orbits" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="sun-core" cx="42%" cy="38%" r="70%">
              <stop offset="0" stopColor="#FFF7FB" />
              <stop offset="0.35" stopColor="#F6D9E8" />
              <stop offset="0.75" stopColor="#DDA7C6" />
              <stop offset="1" stopColor="#8E5A86" />
            </radialGradient>
            <radialGradient id="sun-halo">
              <stop offset="0.3" stopColor="#F3C9DE" stopOpacity="0.45" />
              <stop offset="0.6" stopColor="#B9AED8" stopOpacity="0.12" />
              <stop offset="1" stopColor="#B9AED8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {Object.entries(ORBITS).map(([n, o]) => (
            <g key={n} className={`orbit${Number(n) === activeOrbit ? ' is-active' : ''}`}>
              <ellipse className="orbit__path" cx={CX} cy={CY} rx={o.rx} ry={o.ry} />
              <ellipse
                className="orbit__glint"
                cx={CX}
                cy={CY}
                rx={o.rx}
                ry={o.ry}
                pathLength="100"
                style={{ animationDuration: `${o.period}s` }}
              />
            </g>
          ))}

          <circle className="sun__halo" cx={CX} cy={CY} r="170" fill="url(#sun-halo)" />
          <circle className="sun__core" cx={CX} cy={CY} r="58" fill="url(#sun-core)" />
          <text className="sun__label" x={CX} y={CY + 92} textAnchor="middle">
            KUNJAL.EXE
          </text>
        </svg>

        <ul className="system__planets" aria-label="Planets — choose a destination">
          {planets.map((p, i) => {
            const { x, y } = place(p);
            const left = x < CX - 120;
            return (
              <li
                key={p.id}
                className={`planet-node${warping === p.id ? ' is-target' : ''}${active === p.id ? ' is-active' : ''}${left ? ' planet-node--left' : ''}`}
                style={{
                  left: pct(x, W),
                  top: pct(y, H),
                  '--size': `${(p.size / W) * 100}cqw`,
                  '--float-delay': `${i * -1.7}s`,
                  '--glow': p.palette.base,
                }}
              >
                <a
                  href={href(p.id)}
                  onClick={(e) => travel(e, p)}
                  onMouseEnter={() => activate(p)}
                  onMouseLeave={() => activate(null)}
                  onFocus={() => activate(p)}
                  onBlur={() => activate(null)}
                >
                  <span className="planet-node__body">
                    <PlanetArt planet={p} />
                  </span>
                  <span className="planet-node__label">
                    <span className="mono planet-node__orbit">ORBIT {p.index}</span>
                    <span className="planet-node__name">{p.name}</span>
                    <span className="planet-node__blurb">{p.kicker}</span>
                  </span>
                  <span className="mono planet-node__short" aria-hidden="true">
                    {p.short}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <Mascot className="system__mascot" line={guideLine} />
    </div>
  );
});

export default SolarSystem;
