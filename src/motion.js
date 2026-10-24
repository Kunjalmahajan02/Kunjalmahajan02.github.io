import { useEffect, useState } from 'react';

// Motion preference: follows the OS `prefers-reduced-motion` setting unless the
// visitor flips the toggle in the top bar. Exposed as <html data-motion="full|reduced">
// so CSS can switch every animation off in one place.

const KEY = 'kunjal-motion';
const query = () => window.matchMedia('(prefers-reduced-motion: reduce)');

function readStored() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function resolve() {
  const stored = readStored();
  if (stored === 'full' || stored === 'reduced') return stored;
  return query().matches ? 'reduced' : 'full';
}

function apply(mode) {
  document.documentElement.dataset.motion = mode;
  window.dispatchEvent(new CustomEvent('motionchange', { detail: mode }));
}

export function initMotion() {
  apply(resolve());
  query().addEventListener('change', () => apply(resolve()));
}

export const isReducedMotion = () => document.documentElement.dataset.motion === 'reduced';

export function setMotion(mode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* storage unavailable — the choice lasts for this visit only */
  }
  apply(mode);
}

export function useMotion() {
  const [mode, setMode] = useState(() => document.documentElement.dataset.motion || 'full');
  useEffect(() => {
    const on = (e) => setMode(e.detail);
    window.addEventListener('motionchange', on);
    return () => window.removeEventListener('motionchange', on);
  }, []);
  return mode;
}
