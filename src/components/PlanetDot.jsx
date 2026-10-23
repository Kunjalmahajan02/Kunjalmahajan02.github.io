// A tiny flat planet used in navigation and lists.
export default function PlanetDot({ planet, size = 18 }) {
  const { light, base, dark } = planet.palette;
  return (
    <span
      className={`planet-dot${planet.ring ? ' planet-dot--ring' : ''}`}
      aria-hidden="true"
      style={{
        '--size': `${size}px`,
        '--ring': light,
        background: `radial-gradient(circle at 35% 30%, ${light}, ${base} 45%, ${dark})`,
      }}
    />
  );
}
