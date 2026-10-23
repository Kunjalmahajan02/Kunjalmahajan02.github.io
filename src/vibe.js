// "just vibe ♡": a purely visual mode — slower, brighter twinkles and a soft
// pink pulse in the sky. Exposed as <html data-vibe="on">.
export const isVibing = () => document.documentElement.dataset.vibe === 'on';

export function toggleVibe() {
  const next = isVibing() ? 'off' : 'on';
  document.documentElement.dataset.vibe = next;
  return next === 'on';
}
