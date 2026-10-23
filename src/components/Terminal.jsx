import { useEffect, useRef, useState } from 'react';
import { planets } from '../data/planets.js';
import { projects } from '../data/projects.js';
import { profile } from '../data/profile.js';
import { go } from '../router.js';

const base = import.meta.env.BASE_URL;

const destinations = {
  ...Object.fromEntries(planets.map((p) => [p.id, p.id])),
  home: '',
  universe: '',
  ...Object.fromEntries(projects.map((p) => [p.id, `lab/${p.id}`])),
};

const HELP = [
  'help              list commands',
  'whoami            who lives here',
  'ls                planets in this universe',
  'projects          moons of the AI Lab',
  'open <name>       travel, e.g. open lab, open chaintrack',
  'clear             clear the screen',
];

function run(input) {
  const [cmd, ...args] = input.trim().split(/\s+/);
  const arg = args.join(' ').toLowerCase();
  switch ((cmd || '').toLowerCase()) {
    case '':
      return [];
    case 'help':
      return HELP;
    case 'whoami':
      return [`${profile.name} — ${profile.role}, creative technologist.`, profile.location];
    case 'ls':
      return planets.map((p) => `orbit ${p.index}  ${p.id.padEnd(12)} ${p.name}`);
    case 'projects':
      return projects.map((p) => `${p.id.padEnd(12)} ${p.name}`);
    case 'open':
    case 'cd': {
      if (!arg) return ['usage: open <name> — try “ls” or “projects” for names'];
      const key = Object.keys(destinations).find((k) => k === arg || k.startsWith(arg));
      if (key === undefined) return [`no planet or project called “${arg}”`];
      return [{ go: destinations[key], text: `travelling to ${key}…` }];
    }
    case 'sudo':
      return ['nice try ♡'];
    default:
      return [`command not found: ${cmd} — type “help”`];
  }
}

export default function Terminal() {
  const [lines, setLines] = useState(['Kunjal.exe archive terminal. Type “help” to begin.']);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const screenRef = useRef(null);

  useEffect(() => {
    if (screenRef.current) screenRef.current.scrollTop = screenRef.current.scrollHeight;
  }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    const input = value;
    setValue('');
    setCursor(-1);
    if (input.trim()) setHistory((h) => [input, ...h].slice(0, 20));
    if (input.trim().toLowerCase() === 'clear') {
      setLines([]);
      return;
    }
    const out = run(input);
    const travel = out.find((o) => typeof o === 'object');
    setLines((l) => [...l, `$ ${input}`, ...out.map((o) => (typeof o === 'object' ? o.text : o))]);
    if (travel) window.setTimeout(() => go(travel.go), 450);
  };

  const onKey = (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      const c = Math.min(cursor + 1, history.length - 1);
      setCursor(c);
      setValue(history[c]);
    } else if (e.key === 'ArrowDown' && cursor >= 0) {
      e.preventDefault();
      const c = cursor - 1;
      setCursor(c);
      setValue(c < 0 ? '' : history[c]);
    }
  };

  return (
    <div className="terminal">
      <div className="terminal__bar">
        <img src={`${base}mascot/avatar.webp`} alt="" width="22" height="22" />
        <span className="mono">kunjal@universe: ~/archive</span>
      </div>
      <div className="terminal__screen mono" ref={screenRef} role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((l, i) => (
          <p key={i} className={l.startsWith('$ ') ? 'terminal__cmd' : undefined}>
            {l}
          </p>
        ))}
      </div>
      <form className="terminal__input mono" onSubmit={submit}>
        <label htmlFor="terminal-input">
          <span aria-hidden="true">kunjal@universe:~$</span>
          <span className="visually-hidden">Terminal command</span>
        </label>
        <input
          id="terminal-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="help"
        />
      </form>
    </div>
  );
}
