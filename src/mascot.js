// A tiny event channel to Mini Kunjal's speech bubble, plus the hidden
// discoveries (secrets) she keeps count of.
//
//   say('line', 'pose')      — she says something (pose optional)
//   discover('moon', 'line') — records a secret once and celebrates it

export const SECRET_TOTAL = 4;
const KEY = 'kx-secrets-home'; // the apartment's secrets: cat, disco, bunny, sky

export function say(line, pose) {
  window.dispatchEvent(new CustomEvent('mascot:say', { detail: { line, pose } }));
}

export function secrets() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function discover(id, line) {
  const found = secrets();
  if (found.includes(id)) {
    say('you already found this one ♡ — keep looking!', 'wow');
    return false;
  }
  found.push(id);
  try {
    localStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* private mode — the secret still plays, it just isn't remembered */
  }
  const n = found.length;
  const tail = n >= SECRET_TOTAL ? ' that’s every secret. consider yourself officially cool ♡' : ` (${n}/${SECRET_TOTAL} secrets)`;
  say(`${line}${tail}`, 'wow');
  window.dispatchEvent(new CustomEvent('mascot:sparkle'));
  return true;
}
