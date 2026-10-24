import { useEffect, useRef } from 'react';
import { go, href } from '../router.js';

// A retro desktop window floating over the dollhouse. Escape, the close
// button or a click on the backdrop take you back home.
export default function AppWindow({ file, title, crumb, back, tone = 'pink', children }) {
  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    bodyRef.current?.scrollTo(0, 0);
    const onKey = (e) => {
      if (e.key === 'Escape') go('');
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('has-window');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('has-window');
    };
  }, [file, crumb]);

  return (
    <div className="window-layer" onMouseDown={(e) => e.target === e.currentTarget && go('')}>
      <section className={`window window--${tone}`} role="dialog" aria-modal="true" aria-labelledby="page-title">
        <header className="window__bar">
          <span className="window__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <p className="window__file display">
            {file}
            {crumb && <span> / {crumb}</span>}
          </p>
          <a className="window__close" href={href('')} aria-label="Close window and go back to the house">
            ×
          </a>
        </header>
        <div className="window__body" ref={bodyRef}>
          {back && (
            <a className="window__back" href={href(back.to)}>
              ← {back.label}
            </a>
          )}
          <h1 id="page-title" className="window__title" tabIndex={-1} ref={titleRef}>
            {title}
          </h1>
          {children}
        </div>
      </section>
    </div>
  );
}
