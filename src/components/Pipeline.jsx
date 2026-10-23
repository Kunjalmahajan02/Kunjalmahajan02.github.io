// A project workflow drawn as a chain of stages, fully visible — no clicking
// needed to read it.
//   compact: one line of labelled stations (used on the AI Lab overview)
//   default: numbered stages with what happens at each one
export default function Pipeline({ steps, label, compact = false }) {
  return (
    <ol className={`pipeline${compact ? ' pipeline--compact' : ''}`} aria-label={label}>
      {steps.map((s, i) => (
        <li key={s.label} className="pipeline__stage">
          <span className="mono pipeline__num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="pipeline__text">
            <span className="pipeline__label">{s.label}</span>
            {!compact && <span className="pipeline__detail">{s.detail}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
