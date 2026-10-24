// A project's system drawn as a blueprint schematic: stations joined by a
// signal line, with a pulse that travels along it. Purely visual — the same
// steps are listed in text next to it.
export default function Schematic({ steps, label }) {
  const n = steps.length;
  const gap = 140;
  const W = (n - 1) * gap + 120;
  const H = 120;
  return (
    <svg className="schematic" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}: ${steps.map((s) => s.label).join(', then ')}`}>
      <path className="schematic__wire" d={`M60 50 H${W - 60}`} />
      <path className="schematic__pulse" d={`M60 50 H${W - 60}`} pathLength="100" />
      {steps.map((s, i) => {
        const x = 60 + i * gap;
        return (
          <g key={s.label} transform={`translate(${x} 50)`}>
            <rect x="-22" y="-22" width="44" height="44" rx={i === 0 || i === n - 1 ? 22 : 8} className="schematic__node" />
            <text className="schematic__num" textAnchor="middle" dy="5">
              {String(i + 1).padStart(2, '0')}
            </text>
            <text className="schematic__label" textAnchor="middle" y="44">
              {s.label.length > 18 ? `${s.label.slice(0, 17)}…` : s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
