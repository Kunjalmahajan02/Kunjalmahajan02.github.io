import { useEffect, useState } from 'react';
import { worldById } from '../data/worlds.js';
import { edges, kinds, neighbours, nodeById, nodes } from '../data/graph.js';
import { href, replacePath, useDocumentTitle } from '../router.js';
import { discover, say } from '../mascot.js';
import WorldShell from '../components/WorldShell.jsx';

const world = worldById.garden;
const W = 1000;
const H = 640;

// vines curl: each edge bows to one side, with a little extra droop
function vine(a, b, i) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const bend = Math.min(70, len * 0.22) * (i % 2 ? 1 : -1);
  return `M${a.x} ${a.y} Q${mx - (dy / len) * bend} ${my + (dx / len) * bend + 18} ${b.x} ${b.y}`;
}

const KIND_WORD = { project: 'bloom', theme: 'crystal', tech: 'seed' };

function Flower({ kind }) {
  if (kind === 'project') {
    return (
      <svg viewBox="-20 -20 40 40" aria-hidden="true" focusable="false">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} className="petal" rx="6" ry="13" cy="-9" transform={`rotate(${a})`} />
        ))}
        <circle r="6" className="flower-heart" />
      </svg>
    );
  }
  if (kind === 'theme') {
    return (
      <svg viewBox="-16 -20 32 40" aria-hidden="true" focusable="false">
        <path className="crystal" d="M0 -18 L11 -4 L0 18 L-11 -4 Z" />
        <path className="crystal-shine" d="M0 -18 L11 -4 L0 0 Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="-10 -10 20 20" aria-hidden="true" focusable="false">
      <circle r="6" className="seed" />
    </svg>
  );
}

export default function ThoughtGarden({ nodeId }) {
  useDocumentTitle(world.name);
  const [selected, setSelected] = useState(nodeById[nodeId] ? nodeId : 'blinkbridge');

  useEffect(() => {
    if (nodeById[nodeId]) setSelected(nodeId);
  }, [nodeId]);

  const select = (id) => {
    setSelected(id);
    replacePath(`garden/${id}`);
    const n = nodeById[id];
    say(`${n.label} — connected to ${neighbours(id).length} other ${neighbours(id).length === 1 ? 'thing' : 'things'} in here.`, 'hello');
  };

  const n = nodeById[selected];
  const near = neighbours(selected);
  const nearSet = new Set(near);

  return (
    <WorldShell
      world={world}
      lead="My mind as a living garden. Projects bloom, research themes grow as crystals, tools are the seeds — and the vines only connect things that genuinely grew from each other. Tap anything to see what it’s rooted in."
    >
      <div className="garden">
        <div className="garden__bed">
          <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            {edges.map(([a, b], i) => {
              const lit = a === selected || b === selected;
              return <path key={`${a}-${b}`} d={vine(nodeById[a], nodeById[b], i)} className={`vine${lit ? ' is-lit' : ''}`} pathLength="100" />;
            })}
          </svg>
          <ul aria-label="Ideas in the garden">
            {nodes.map((node) => {
              const state = node.id === selected ? ' is-selected' : nearSet.has(node.id) ? ' is-near' : '';
              return (
                <li key={node.id} className={`sprout sprout--${node.kind}${state}`} style={{ left: `${(node.x / W) * 100}%`, top: `${(node.y / H) * 100}%` }}>
                  <button type="button" aria-pressed={node.id === selected} onClick={() => select(node.id)}>
                    <span className="sprout__shape">
                      <Flower kind={node.kind} />
                    </span>
                    <span className="sprout__label">
                      {node.label}
                      <span className="visually-hidden">, {kinds[node.kind].label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className="garden__secret" onClick={() => discover('seed', 'a hidden seed! it grows into… more ideas than i have time for ✦')} aria-label="A tiny glowing seed">
            <span aria-hidden="true" />
          </button>
        </div>

        <section className="packet" aria-live="polite" aria-labelledby="node-title">
          <p className="packet__kind">
            {KIND_WORD[n.kind]} · {kinds[n.kind].label}
          </p>
          <h2 id="node-title">{n.label}</h2>
          <p>{n.note}</p>
          {n.route && (
            <p>
              <a className="btn btn--moon btn--small" href={href(n.route)}>
                {n.kind === 'project' ? 'Open the blueprint' : 'Look through the telescope'} →
              </a>
            </p>
          )}
          <p className="packet__sub">Rooted together with</p>
          <ul className="packet__links">
            {near.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => select(id)}>
                  <span className={`dot dot--${nodeById[id].kind}`} aria-hidden="true" />
                  {nodeById[id].label}
                  <span className="visually-hidden">, {kinds[nodeById[id].kind].label}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="packet__legend" aria-hidden="true">
            <span>
              <span className="dot dot--project" /> bloom = project
            </span>
            <span>
              <span className="dot dot--theme" /> crystal = theme
            </span>
            <span>
              <span className="dot dot--tech" /> seed = tool
            </span>
          </p>
        </section>
      </div>
    </WorldShell>
  );
}
