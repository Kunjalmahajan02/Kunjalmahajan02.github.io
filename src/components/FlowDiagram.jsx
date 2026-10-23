import { useId, useState } from 'react';

// A workflow drawn as a chain of stations. Each station is a button; the
// selected one explains what happens at that stage.
export default function FlowDiagram({ steps, label }) {
  const [current, setCurrent] = useState(0);
  const uid = useId();
  const panelId = `${uid}-panel`;

  return (
    <div className="flow">
      <ol className="flow__track" aria-label={label}>
        {steps.map((s, i) => (
          <li key={s.label} className={i === current ? 'is-current' : undefined}>
            <button
              type="button"
              aria-pressed={i === current}
              aria-controls={panelId}
              onClick={() => setCurrent(i)}
            >
              <span className="mono flow__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="flow__label">{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="flow__panel" id={panelId} aria-live="polite">
        <p className="mono flow__panel-head">
          STAGE {String(current + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')} · {steps[current].label.toUpperCase()}
        </p>
        <p>{steps[current].detail}</p>
        <div className="flow__step-controls">
          <button type="button" className="btn btn--small" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
            ← Previous stage
          </button>
          <button
            type="button"
            className="btn btn--small"
            disabled={current === steps.length - 1}
            onClick={() => setCurrent(current + 1)}
          >
            Next stage →
          </button>
        </div>
      </div>
    </div>
  );
}
