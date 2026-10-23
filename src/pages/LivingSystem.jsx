import { useEffect, useState } from 'react';
import { edges, kinds, neighbours, nodeById, nodes } from '../data/graph.js';
import { href, replacePath } from '../router.js';
import Win from '../components/Win.jsx';

const W = 1000;
const H = 640;

// Edges bow gently away from the centre, so the map reads as a constellation
// of arcs rather than a flowchart of straight lines.
function arc(a, b) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const bend = Math.min(40, len * 0.12);
  const side = (mx - W / 2) * dy - (my - H / 2) * dx > 0 ? 1 : -1;
  return `M${a.x} ${a.y} Q${mx - (dy / len) * bend * side} ${my + (dx / len) * bend * side} ${b.x} ${b.y}`;
}

const filters = [
  { id: 'all', label: 'Everything' },
  { id: 'project', label: 'Projects' },
  { id: 'theme', label: 'Themes' },
  { id: 'tech', label: 'Technologies' },
];

export default function LivingSystem({ nodeId }) {
  const [selected, setSelected] = useState(nodeById[nodeId] ? nodeId : 'blinkbridge');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (nodeById[nodeId]) setSelected(nodeId);
  }, [nodeId]);

  const select = (id) => {
    setSelected(id);
    replacePath(`research/map/${id}`);
  };

  const n = nodeById[selected];
  const near = neighbours(selected);
  const nearSet = new Set(near);

  return (
    <Win title="Data Realm · how it all connects" icon="◎" className="research__win">
      <p className="research__lead">Projects, the tools they’re built with, and the research themes they touch — linked only where the connection is real. Select any node to trace it.</p>
      <div className="living">
        <div className="living__controls" role="group" aria-label="Highlight node type">
          {filters.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.id !== 'all' && <span className={`node-key node-key--${f.id}`} aria-hidden="true" />}
              {f.label}
            </button>
          ))}
        </div>

        <div className="living__map" data-filter={filter}>
          <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            {edges.map(([a, b]) => {
              const lit = a === selected || b === selected;
              return <path key={`${a}-${b}`} d={arc(nodeById[a], nodeById[b])} className={`edge${lit ? ' is-lit' : ''}`} />;
            })}
          </svg>
          <ul aria-label="Nodes in the Living System">
            {nodes.map((node) => {
              const state = node.id === selected ? ' is-selected' : nearSet.has(node.id) ? ' is-near' : '';
              const dim = filter !== 'all' && node.kind !== filter ? ' is-dim' : '';
              return (
                <li
                  key={node.id}
                  className={`node node--${node.kind}${state}${dim}`}
                  style={{ left: `${(node.x / W) * 100}%`, top: `${(node.y / H) * 100}%` }}
                >
                  <button type="button" aria-pressed={node.id === selected} onClick={() => select(node.id)}>
                    <span className="node__mark" aria-hidden="true" />
                    <span className="node__label">
                      {node.label}
                      <span className="visually-hidden">, {kinds[node.kind].label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <section className="living__panel" aria-live="polite" aria-labelledby="node-title">
          <p className="mono eyebrow">
            <span className={`node-key node-key--${n.kind}`} aria-hidden="true" /> {kinds[n.kind].label.toUpperCase()}
          </p>
          <h2 id="node-title">{n.label}</h2>
          <p>{n.note}</p>
          {n.route && (
            <p>
              <a className="btn btn--small" href={href(n.route)}>
                {n.kind === 'project' ? 'Open case study' : 'Open the research topic'} →
              </a>
            </p>
          )}
          <h3 className="mono topic__sub">CONNECTED TO · {near.length}</h3>
          <ul className="living__links">
            {near.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => select(id)}>
                  <span className={`node-key node-key--${nodeById[id].kind}`} aria-hidden="true" />
                  {nodeById[id].label}
                  <span className="visually-hidden">, {kinds[nodeById[id].kind].label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <p className="living__legend mono" aria-hidden="true">
          <span>
            <span className="node-key node-key--project" /> PROJECT
          </span>
          <span>
            <span className="node-key node-key--theme" /> THEME
          </span>
          <span>
            <span className="node-key node-key--tech" /> TECHNOLOGY
          </span>
        </p>
      </div>
    </Win>
  );
}
