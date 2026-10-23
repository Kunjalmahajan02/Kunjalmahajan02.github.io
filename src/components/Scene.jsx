import { useEffect, useState } from 'react';
import { planets } from '../data/planets.js';
import { profile } from '../data/profile.js';
import { href } from '../router.js';
import Planet from './Planet.jsx';
import Mascot from './Mascot.jsx';

const ASSETS = import.meta.env.BASE_URL;

// The universe is one persistent, full-screen scene behind every page.
//
// Overview (`focus` = null): the sun, three orbits and five planets fill the
// viewport; each planet is a link. Mini Kunjal sits on her own moon in the
// foreground.
//
// Focused (`focus` = a planet id): the "camera" moves to that planet — it
// grows into the backdrop on the right while the sun slips off-screen and the
// other planets drift outward and fade. The destination's content then rises
// over the scene. Going back to the universe reverses the move.
//
// Layout numbers are percentages of the viewport (x of width, y of height);
// planet sizes are in "u", a unit that scales with the viewport.

const LAYOUTS = {
  wide: {
    sun: { x: 61, y: 52, size: 9 },
    orbits: { 1: { rx: 14.5, ry: 17 }, 2: { rx: 23, ry: 27 }, 3: { rx: 32, ry: 37 } },
    planets: {
      lab: { o: 1, a: -40, size: 9.5 },
      observatory: { o: 2, a: 222, size: 8 },
      system: { o: 2, a: 38, size: 7.6 },
      archive: { o: 3, a: -62, size: 5.4 },
      creative: { o: 3, a: 12, size: 6.8 },
    },
    focus: { x: 80, y: 42, size: 46 },
    sunFocus: { x: -8, y: 18 },
  },
  tall: {
    sun: { x: 50, y: 58, size: 15 },
    orbits: { 1: { rx: 25, ry: 8.5 }, 2: { rx: 40, ry: 13 }, 3: { rx: 45, ry: 17.5 } },
    planets: {
      lab: { o: 1, a: -35, size: 15 },
      observatory: { o: 2, a: 205, size: 13 },
      system: { o: 2, a: 8, size: 12.5 },
      archive: { o: 3, a: -100, size: 9.5 },
      creative: { o: 3, a: -42, size: 11 },
    },
    focus: { x: 80, y: 25, size: 60 },
    sunFocus: { x: -20, y: 4 },
  },
};

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [vp, setVp] = useState(read);
  useEffect(() => {
    let frame = 0;
    const on = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setVp(read()));
    };
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => {
      window.removeEventListener('resize', on);
      window.removeEventListener('orientationchange', on);
    };
  }, []);
  return vp;
}

// Scroll progress (0 → 1 over most of a screen) drives the fade of the scene
// behind page content, via the --scroll custom property.
function useScrollFade() {
  useEffect(() => {
    let frame = 0;
    const on = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const p = Math.min(1, window.scrollY / (window.innerHeight * 0.7));
        document.documentElement.style.setProperty('--scroll', p.toFixed(3));
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
}

export default function Scene({ focus }) {
  const { w, h } = useViewport();
  useScrollFade();
  const [hovered, setHovered] = useState(null);

  const kind = w / h < 0.95 ? 'tall' : 'wide';
  const L = LAYOUTS[kind];
  const u = kind === 'wide' ? Math.min(w / 100, (h * 1.6) / 100) : Math.min(w / 100, (h * 0.55) / 100);
  const px = (x, y) => ({ x: (x / 100) * w, y: (y / 100) * h });

  const sunHome = px(L.sun.x, L.sun.y);
  const sun = focus ? px(L.sunFocus.x, L.sunFocus.y) : sunHome;
  const base = L.focus.size * u; // every planet is laid out at its focus size, then scaled down

  const placed = planets.map((p) => {
    const spec = L.planets[p.id];
    const o = L.orbits[spec.o];
    const a = (spec.a * Math.PI) / 180;
    const home = px(L.sun.x + o.rx * Math.cos(a), L.sun.y + o.ry * Math.sin(a));
    let pos = home;
    let size = spec.size * u;
    let opacity = 1;
    if (focus === p.id) {
      pos = px(L.focus.x, L.focus.y);
      size = base;
    } else if (focus) {
      // drift outward, away from the sun, and fade
      pos = { x: sunHome.x + (home.x - sunHome.x) * 2.1, y: sunHome.y + (home.y - sunHome.y) * 2.1 };
      size *= 0.7;
      opacity = 0;
    }
    const light = Math.atan2(sun.y - pos.y, sun.x - pos.x);
    return { p, spec, pos, size, opacity, light };
  });

  const focused = Boolean(focus);
  const activeOrbit = hovered ? L.planets[hovered]?.o : null;
  const orbitOrigin = focused ? placed.find((x) => x.p.id === focus)?.pos : null;

  return (
    <div
      className={`scene scene--${kind}${focused ? ' is-focus' : ''}${hovered ? ' has-hover' : ''}`}
      aria-hidden={focused ? 'true' : undefined}
    >
      <svg
        className="scene__orbits"
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        aria-hidden="true"
        focusable="false"
        style={orbitOrigin ? { transformOrigin: `${orbitOrigin.x}px ${orbitOrigin.y}px` } : undefined}
      >
        {Object.entries(L.orbits).map(([n, o]) => (
          <ellipse
            key={n}
            className={`orbit${Number(n) === activeOrbit ? ' is-active' : ''}`}
            cx={sunHome.x}
            cy={sunHome.y}
            rx={(o.rx / 100) * w}
            ry={(o.ry / 100) * h}
          />
        ))}
      </svg>

      <div
        className="scene__sun"
        aria-hidden="true"
        style={{ width: L.sun.size * u, height: L.sun.size * u, transform: `translate(${sun.x}px, ${sun.y}px) translate(-50%, -50%)` }}
      />

      <ul className="scene__planets" aria-label={focused ? undefined : 'Planets — choose a destination'}>
        {placed.map(({ p, pos, size, opacity, light }, i) => {
          const isFocus = focus === p.id;
          const scale = size / base;
          return (
            <li
              key={p.id}
              className={`scene-planet${isFocus ? ' is-focus' : ''}${hovered === p.id ? ' is-hover' : ''}${pos.x > w * 0.84 ? ' is-edge' : ''}`}
              style={{
                '--base': `${base}px`,
                '--lx': `${50 + 34 * Math.cos(light)}%`,
                '--ly': `${50 + 34 * Math.sin(light)}%`,
                '--delay': `${i * 40}ms`,
                '--o': opacity,
                transform: `translate(${pos.x}px, ${pos.y}px)`,
              }}
            >
              <a
                href={href(p.id)}
                tabIndex={focused ? -1 : undefined}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(p.id)}
                onBlur={() => setHovered(null)}
                style={{ width: size, height: size }}
              >
                <span className="scene-planet__body" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
                  <Planet planet={p} />
                </span>
                <span className="scene-planet__label">
                  <span className="mono scene-planet__orbit">ORBIT {p.index}</span>
                  <span className="scene-planet__name">{kind === 'tall' ? p.short : p.name}</span>
                  <span className="scene-planet__kicker">{p.kicker}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="scene__guide">
        <div className="scene__moon" aria-hidden="true" style={{ backgroundImage: `url(${ASSETS}planets/home-moon.webp)` }} />
        <Mascot line={profile.guideLine} />
      </div>

      <div className="scene__veil" aria-hidden="true" />
    </div>
  );
}
