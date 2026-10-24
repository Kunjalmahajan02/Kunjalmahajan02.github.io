import { useEffect, useState } from 'react';
import { href } from '../router.js';
import { setMotion, useMotion } from '../motion.js';

const fmt = (opts) => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', ...opts });
const dayFmt = fmt({ weekday: 'short', day: 'numeric', month: 'short' });
const timeFmt = fmt({ hour: '2-digit', minute: '2-digit', hour12: false });

// The menu bar across the top: name, apps, the résumé, and her local time.
export default function TopBar({ current }) {
  const [now, setNow] = useState(() => new Date());
  const motion = useMotion();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20_000);
    return () => clearInterval(id);
  }, []);

  const apps = [
    ['projects', 'Projects'],
    ['research', 'Research'],
    ['creative', 'Creative'],
    ['contact', 'Contact'],
  ];

  return (
    <header className="topbar">
      <a className="topbar__brand" href={href('')}>
        <span className="topbar__logo" aria-hidden="true">
          ♡
        </span>
        <span className="display">KUNJAL.EXE</span>
        <span className="topbar__sub">/ a little universe</span>
      </a>
      <nav className="topbar__nav" aria-label="Apps">
        {apps.map(([id, label]) => (
          <a key={id} href={href(id)} aria-current={current === id ? 'page' : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <div className="topbar__right">
        <a className="topbar__resume" href={href('resume')} aria-current={current === 'resume' ? 'page' : undefined}>
          <span aria-hidden="true">📎</span> Résumé
        </a>
        <button
          type="button"
          className="topbar__motion"
          aria-pressed={motion === 'reduced'}
          onClick={() => setMotion(motion === 'reduced' ? 'full' : 'reduced')}
        >
          {motion === 'reduced' ? 'Motion off' : 'Motion on'}
        </button>
        <p className="topbar__clock">
          <span>{dayFmt.format(now)}</span>
          <time dateTime={now.toISOString()}>{timeFmt.format(now)} IST</time>
        </p>
      </div>
    </header>
  );
}
