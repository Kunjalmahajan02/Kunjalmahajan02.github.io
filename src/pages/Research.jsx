import { useEffect } from 'react';
import { useDocumentTitle } from '../router.js';
import { topicById } from '../data/research.js';
import { nodeById } from '../data/graph.js';
import Observatory from './Observatory.jsx';
import LivingSystem from './LivingSystem.jsx';

// Research: the "Open Questions" planet (interests as a star map) and the
// "Data Realm" planet (how projects, tools and themes connect).
//   #/research            → star map
//   #/research/<topic>    → star map, topic selected
//   #/research/map[/node] → jump to the connections map
export default function Research({ sub }) {
  useDocumentTitle('Research');
  const [, , node] = window.location.hash.replace(/^#\/?/, '').split('/');
  const toMap = sub === 'map';

  useEffect(() => {
    if (toMap) document.getElementById('data-realm')?.scrollIntoView({ block: 'start' });
  }, [toMap]);

  return (
    <div className="research">
      <div className="page-head">
        <h1 id="page-title" tabIndex={-1} className="glow-title">
          Open Questions
        </h1>
        <p>Research interests, future projects, and how everything I build connects.</p>
      </div>
      <div className="research__stack">
        <Observatory topicId={topicById[sub] ? sub : undefined} />
        <div id="data-realm">
          <LivingSystem nodeId={nodeById[node] ? node : undefined} />
        </div>
      </div>
    </div>
  );
}
