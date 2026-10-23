import { useMemo } from 'react';

// A fixed, quiet sky: a few nebula glows in CSS plus ~110 stars generated
// from a seeded random sequence (so the sky is identical on every visit).
// Only a handful twinkle.

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function Starfield() {
  const stars = useMemo(() => {
    const rand = seeded(20261023);
    return Array.from({ length: 110 }, (_, i) => ({
      x: rand() * 100,
      y: rand() * 100,
      r: rand() < 0.88 ? 0.6 + rand() * 0.6 : 1.3 + rand() * 0.6,
      o: 0.25 + rand() * 0.55,
      twinkle: i % 14 === 0,
      delay: rand() * 6,
    }));
  }, []);

  return (
    <div className="starfield" aria-hidden="true">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="#FFF7FB"
            opacity={s.o}
            className={s.twinkle ? 'twinkle' : undefined}
            style={s.twinkle ? { animationDelay: `${s.delay}s` } : undefined}
          />
        ))}
      </svg>
    </div>
  );
}
