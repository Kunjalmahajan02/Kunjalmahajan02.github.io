// States plainly where a case study's facts come from.
export default function EvidenceBadge({ evidence, compact = false }) {
  const verified = evidence.level === 'verified';
  return (
    <p className={`evidence evidence--${evidence.level}${compact ? ' evidence--compact' : ''}`}>
      <span className="mono evidence__tag">
        <span className="evidence__icon" aria-hidden="true">
          {verified ? '◆' : '◇'}
        </span>
        {verified ? 'VERIFIED FROM REPOSITORY' : 'NOT YET VERIFIED AGAINST CODE'}
      </span>
      {!compact && <span className="evidence__note">{evidence.note}</span>}
    </p>
  );
}
