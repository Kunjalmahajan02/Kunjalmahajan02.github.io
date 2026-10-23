const base = import.meta.env.BASE_URL;

// One planet: a pre-rendered textured sphere (tools/make_planets.py), a
// day/night terminator facing the sun (--lx/--ly, set by the parent), a thin
// atmosphere on the lit limb, and — for ringed planets — a ring split into a
// back half (behind the sphere) and a front half.
export default function Planet({ planet, className = '' }) {
  const ring = planet.ring;
  return (
    <span className={`planet ${ring ? 'planet--ringed' : ''} ${className}`} aria-hidden="true">
      {ring && <Ring part="back" color={planet.palette.light} />}
      <span className="planet__sphere">
        <img src={`${base}planets/${planet.id}.webp`} alt="" width="1024" height="1024" decoding="async" draggable="false" />
        <span className="planet__shade" />
      </span>
      {ring && <Ring part="front" color={planet.palette.light} />}
    </span>
  );
}

function Ring({ part, color }) {
  // Ellipse on a 200 × 200 box centred on the sphere; the sphere spans 50–150.
  const d = part === 'back' ? 'M14 100 A86 20 0 0 1 186 100' : 'M14 100 A86 20 0 0 0 186 100';
  return (
    <svg className={`planet__ring planet__ring--${part}`} viewBox="0 0 200 200" focusable="false">
      <g transform="rotate(-16 100 100)" fill="none">
        <path d={d} stroke={color} strokeOpacity={part === 'back' ? 0.28 : 0.6} strokeWidth="5" />
        <path
          d={part === 'back' ? 'M26 100 A74 16 0 0 1 174 100' : 'M26 100 A74 16 0 0 0 174 100'}
          stroke={color}
          strokeOpacity={part === 'back' ? 0.14 : 0.3}
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
