import { worldById } from '../data/worlds.js';
import { projects } from '../data/projects.js';
import { href, useDocumentTitle } from '../router.js';
import { say } from '../mascot.js';
import WorldShell from '../components/WorldShell.jsx';
import Schematic from '../components/Schematic.jsx';

const world = worldById.inventor;
const HINTS = {
  blinkbridge: 'okay, this one’s one of my favourites — i’m founding it.',
  speech: 'six languages, one pipeline ♡',
  chaintrack: 'try breaking the contract’s rules in there. it won’t let you.',
  'tb-detection': 'a CNN reading chest X-rays. serious stuff.',
  inventory: 'python + mysql, keeping a shop honest.',
  hangman: 'a tiny classic. everyone starts somewhere ♡',
};

export default function Inventor() {
  useDocumentTitle(world.name);
  const [featured, ...rest] = projects;

  return (
    <WorldShell
      world={world}
      lead="A planet of floating laboratories. Every blueprint here is a real project — what problem it tackles, how the system works, and what I’d improve next."
    >
      <section className="founder" aria-labelledby="founder-title">
        <p className="world__index">EXPERIENCE</p>
        <h2 id="founder-title">Founder — BlinkBridge · Blink to Morse</h2>
        <p>{featured.role}</p>
        <p className="founder__note">Ongoing</p>
      </section>

      <ul className="blueprints">
        {[featured, ...rest].map((p, i) => (
          <li key={p.id} className={`blueprint${i === 0 ? ' blueprint--hero' : ''}`}>
            <p className="blueprint__tag">
              {p.moon.replace('MOON', 'BLUEPRINT')} · {p.status}
            </p>
            <h2>
              <a
                href={href(`inventor/${p.id}`)}
                className="stretched"
                onMouseEnter={() => say(HINTS[p.id], 'wow')}
                onFocus={() => say(HINTS[p.id], 'wow')}
              >
                {p.name}
              </a>
            </h2>
            <p className="blueprint__line">{p.tagline}</p>
            <Schematic steps={p.flow} label={`${p.name} system`} />
            <ul className="tags" aria-label="Technologies">
              {p.stack.slice(0, i === 0 ? 6 : 4).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="blueprint__open" aria-hidden="true">
              open the blueprint →
            </p>
          </li>
        ))}
      </ul>
    </WorldShell>
  );
}
