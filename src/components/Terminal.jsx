import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/projects.js';
import { profile } from '../data/profile.js';
import { go } from '../router.js';

const PAGES = {
  home: '',
  universe: '',
  inventor: 'inventor',
  projects: 'inventor',
  observatory: 'observatory',
  research: 'observatory',
  garden: 'garden',
  daydream: 'daydream',
  creative: 'daydream',
  about: 'about',
  ...Object.fromEntries(projects.map((p) => [p.id, `inventor/${p.id}`])),
};

const HELP = [
  'whoami        — know more about me',
  'projects      — Inventor’s Planet',
  'research      — Observatory Beyond',
  'garden        — the Thought Garden',
  'creative      — Daydream District',
  'resume        — open my résumé',
  'contact       — let’s connect',
  'open <name>   — e.g. open blinkbridge',
  'clear         — clear terminal',
];

function run(input, actions) {
  const [cmd = '', ...args] = input.trim().toLowerCase().split(/\s+/);
  const target = cmd === 'open' || cmd === 'cd' ? args.join(' ') : cmd;
  switch (cmd) {
    case '':
      return [];
    case 'help':
      return ['here are some commands:', ...HELP.map((h) => `  › ${h}`)];
    case 'whoami':
      actions.whoami?.();
      return [profile.name, profile.headline, profile.location];
    case 'contact': {
      const { github, linkedin, email } = profile.links;
      actions.contact?.();
      return ['find me here:', github && `  github   ${github}`, linkedin && `  linkedin ${linkedin}`, email && `  email    ${email}`].filter(Boolean);
    }
    case 'resume':
    case 'cv':
      window.open(`${import.meta.env.BASE_URL}${profile.links.resume}`, '_blank', 'noopener');
      return ['opening my résumé in a new tab ↗'];
    case 'ls':
      return [Object.keys(PAGES).join('  ')];
    case 'sudo':
      return ['nice try ♡'];
    default: {
      const key = Object.keys(PAGES).find((k) => k === target || (target && k.startsWith(target)));
      if (key !== undefined) return [{ go: PAGES[key], text: `opening ${key}…` }];
      return [`command not found: ${cmd} — type “help”`];
    }
  }
}

export default function Terminal({ actions = {}, autoFocus = false }) {
  const [lines, setLines] = useState(['hey! welcome to Kunjal.exe ♡', 'type “help” to see what i can do.']);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const screenRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (screenRef.current) screenRef.current.scrollTop = screenRef.current.scrollHeight;
  }, [lines]);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const submit = (e) => {
    e.preventDefault();
    const input = value;
    setValue('');
    setCursor(-1);
    if (input.trim()) setHistory((h) => [input, ...h].slice(0, 20));
    if (input.trim().toLowerCase() === 'clear') return setLines([]);
    const out = run(input, actions);
    const travel = out.find((o) => typeof o === 'object');
    setLines((l) => [...l, `kunjal@universe:~$ ${input}`, ...out.map((o) => (typeof o === 'object' ? o.text : o))]);
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
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal__screen" ref={screenRef} role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((l, i) => (
          <p key={i} className={l.startsWith('kunjal@') ? 'terminal__cmd' : undefined}>
            {l}
          </p>
        ))}
      </div>
      <form className="terminal__input" onSubmit={submit}>
        <label htmlFor="terminal-input">
          <span aria-hidden="true">kunjal@universe:~$</span>
          <span className="visually-hidden">Terminal command</span>
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Type a command…"
        />
      </form>
    </div>
  );
}
