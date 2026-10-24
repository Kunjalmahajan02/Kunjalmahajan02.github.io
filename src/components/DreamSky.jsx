import { useEffect, useMemo } from 'react';
import { isReducedMotion } from '../motion.js';
import Scenery from './Scenery.jsx';

const base = import.meta.env.BASE_URL;
const SKIES = ['home', 'inventor', 'observatory', 'garden', 'daydream'];

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Stars({ count, seed, big = 0.1, className }) {
  const stars = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      x: r() * 100,
      y: r() * 100,
      s: r() < big ? 1.4 + r() * 1.2 : 0.5 + r() * 0.7,
      o: 0.3 + r() * 0.6,
      tw: i % 9 === 0,
      d: r() * 7,
    }));
  }, [count, seed, big]);
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.s / 10}
          fill="#FFF7FB"
          opacity={s.o}
          className={s.tw ? 'twinkle' : undefined}
          style={s.tw ? { animationDelay: `${s.d}s` } : undefined}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

// Pointer parallax: one rAF-throttled listener writes --px/--py (−1…1) on
// <html>; every layer moves by its own depth in CSS. Off for touch and
// reduced motion.
function useParallax() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    let frame = 0;
    const root = document.documentElement;
    const on = (e) => {
      if (isReducedMotion()) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        root.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', on);
    };
  }, []);
}

export default function DreamSky({ world = 'home' }) {
  useParallax();
  const sky = SKIES.includes(world) ? world : 'home';

  return (
    <div className={`dreamsky dreamsky--${sky}`} aria-hidden="true">
      {SKIES.map((s) => (
        <picture key={s} className={`dreamsky__paint${s === sky ? ' is-on' : ''}`}>
          <source media="(max-width: 900px)" srcSet={`${base}dream/sky-${s}-960.webp`} />
          <img src={`${base}dream/sky-${s}.webp`} alt="" width="1920" height="1080" decoding="async" />
        </picture>
      ))}
      <Stars className="dreamsky__stars dreamsky__stars--far" count={140} seed={7} big={0.04} />
      <Stars className="dreamsky__stars dreamsky__stars--near" count={46} seed={19} big={0.3} />
      <Scenery world={sky} />
    </div>
  );
}
