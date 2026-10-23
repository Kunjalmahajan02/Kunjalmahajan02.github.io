import { useEffect, useRef, useState } from 'react';
import { isReducedMotion } from '../motion.js';

// Type a word and see how it would be blinked to BlinkBridge: a short blink
// (< 0.3 s) is a dot, a long blink is a dash, pauses split letters. This is a
// teaching toy that runs in the browser — it doesn't use a camera.

const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
};

export function toMorse(text) {
  return text
    .toUpperCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => [...w].map((c) => MORSE[c]).filter(Boolean));
}

export default function MorsePlay() {
  const [text, setText] = useState('SOS');
  const [playing, setPlaying] = useState(false);
  const [closed, setClosed] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const timers = useRef([]);
  const words = toMorse(text);
  const symbols = words.flatMap((w, wi) => w.flatMap((l, li) => [...l].map((s) => ({ s, wi, li }))));

  const stop = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlaying(false);
    setClosed(false);
    setCursor(-1);
  };
  useEffect(() => stop, []);

  const play = () => {
    stop();
    if (!symbols.length || isReducedMotion()) return;
    setPlaying(true);
    let t = 300;
    symbols.forEach((sym, i) => {
      const prev = symbols[i - 1];
      if (prev && prev.wi !== sym.wi) t += 1100;
      else if (prev && prev.li !== sym.li) t += 650;
      const hold = sym.s === '.' ? 200 : 600;
      timers.current.push(setTimeout(() => (setCursor(i), setClosed(true)), t));
      timers.current.push(setTimeout(() => setClosed(false), t + hold));
      t += hold + 250;
    });
    timers.current.push(setTimeout(stop, t + 200));
  };

  return (
    <div className="morse">
      <label className="morse__label" htmlFor="morse-input">
        Type a word to see it blinked
      </label>
      <div className="morse__row">
        <input
          id="morse-input"
          value={text}
          maxLength={16}
          onChange={(e) => (stop(), setText(e.target.value.replace(/[^a-z0-9 ]/gi, '')))}
          autoComplete="off"
          spellCheck="false"
        />
        <button type="button" className="btn btn--dark btn--small" onClick={playing ? stop : play} disabled={!symbols.length}>
          {playing ? 'Stop' : 'Blink it'}
        </button>
      </div>

      <div className="morse__screen">
        <div className={`morse__eye${closed ? ' is-closed' : ''}`} aria-hidden="true">
          <span />
        </div>
        <p className="morse__status mono" aria-live="polite">
          {playing ? (closed ? (symbols[cursor]?.s === '.' ? 'short blink · dot' : 'long blink · dash') : 'eye open') : 'ready'}
        </p>
        <p className="morse__code mono" aria-label={`Morse code: ${words.map((w) => w.join(' ')).join(' / ') || 'nothing yet'}`}>
          {symbols.length === 0 && <span className="morse__empty">letters and numbers only</span>}
          {words.map((w, wi) => (
            <span key={wi} className="morse__word">
              {w.map((l, li) => (
                <span key={li} className="morse__letter">
                  {[...l].map((s, si) => {
                    const idx = symbols.findIndex((x) => x.wi === wi && x.li === li) + si;
                    return (
                      <span key={si} className={idx === cursor ? 'is-on' : undefined}>
                        {s === '.' ? '●' : '▬'}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
      <p className="morse__note">
        A browser demo of the encoding only — the real BlinkBridge reads blinks from a webcam with MediaPipe Face Mesh.
      </p>
    </div>
  );
}
