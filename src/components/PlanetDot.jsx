const base = import.meta.env.BASE_URL;

// A small lit planet used in navigation and lists — the same surface as the
// big one in the scene, so the two read as the same place.
export default function PlanetDot({ planet, size = 18 }) {
  return (
    <span
      className={`planet-dot${planet.ring ? ' planet-dot--ring' : ''}`}
      aria-hidden="true"
      style={{ '--size': `${size}px`, '--ring': planet.palette.light }}
    >
      <img src={`${base}planets/${planet.id}.webp`} alt="" width={size} height={size} loading="lazy" decoding="async" />
    </span>
  );
}
