import { useEffect, useState } from 'react';

// Hash routing (#/lab/blinkbridge) — GitHub Pages serves a single index.html,
// so every route survives refreshes and direct links without server rewrites.

export function parseHash(hash = window.location.hash) {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  return path ? path.split('/').map(decodeURIComponent) : [];
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const href = (path = '') => `#/${path}`;

export function go(path = '') {
  window.location.hash = `/${path}`;
}

// Updates the address bar without adding a history entry or re-routing.
export function replacePath(path) {
  window.history.replaceState(null, '', href(path));
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Kunjal.exe` : 'Kunjal.exe — Her Little Universe';
  }, [title]);
}
