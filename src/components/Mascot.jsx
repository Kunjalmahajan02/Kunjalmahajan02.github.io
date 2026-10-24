import { useCallback, useEffect, useRef, useState } from 'react';
import { isReducedMotion } from '../motion.js';

const base = import.meta.env.BASE_URL;

// Mini Kunjal's poses — each one is real artwork cut from Kunjal's reference
// board (tools/make_dreamscape.py), so she is the same character in all of
// them. `faces` is the way she naturally looks; she's mirrored to face where
// she's going (except at her laptop, which has writing on it).
const POSES = {
  hello: { file: 'pose-hello-402', w: 402, h: 535, faces: 'left' },
  think: { file: 'pose-think-364', w: 364, h: 421, faces: 'right' },
  wow: { file: 'pose-wow-520', w: 520, h: 296, faces: 'right' },
  dance: { file: 'pose-dance-412', w: 412, h: 624, faces: 'right' },
  work: { file: 'pose-work-620', w: 620, h: 517, faces: null },
};

const REACTIONS = [
  { pose: 'think', line: 'psst… there’s something hiding on the crescent moon.' },
  { pose: 'dance', line: 'okay okay, one little twirl ♡' },
  { pose: 'wow', line: 'click anywhere in the sky — i’ll follow you.' },
  { pose: 'hello', line: 'my résumé is always one click away, top right ✦' },
  { pose: 'work', line: 'curious how i build things? Inventor’s Planet has the blueprints.' },
];
const FLY_LINES = ['wheee ♡', 'on my way ✦', 'ooh, nice spot.', 'here?', 'following you ♡'];
const INTERACTIVE = 'a, button, input, select, textarea, label, summary, [role="tab"], [role="button"], [contenteditable], .mascot, .mascot-orb, [data-no-fly]';

function heightFor(vw) {
  if (vw < 600) return 132;
  if (vw < 1000) return 170;
  return 220;
}

function clampAnchor(x, y, w, h) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const top = 64 + 96 + h; // leave room for the top bar and a speech bubble
  return {
    x: Math.min(Math.max(x, w / 2 + 8), vw - w / 2 - 8),
    y: Math.min(Math.max(y, Math.min(top, vh - 8)), vh - 8),
  };
}

export default function Mascot({ restSpot, restPose = 'hello', greeting }) {
  const [pose, setPose] = useState(restPose);
  const restPoseRef = useRef(restPose);
  restPoseRef.current = restPose;
  const [prevPose, setPrevPose] = useState(null);
  const [anchor, setAnchor] = useState(() => restSpot());
  const [facing, setFacing] = useState(null);
  const [flying, setFlying] = useState(false);
  const [bubble, setBubble] = useState({ line: greeting, open: true });
  const [minimized, setMinimized] = useState(() => {
    try {
      return sessionStorage.getItem('kx-mascot-min') === '1';
    } catch {
      return false;
    }
  });
  const [sparkles, setSparkles] = useState([]);
  const [vw, setVw] = useState(() => window.innerWidth);
  const [ready, setReady] = useState(false); // no glide on the very first placement
  const rootRef = useRef(null);
  const reaction = useRef(0);
  const flyCount = useRef(0);
  const idleTimer = useRef(0);
  const restTimer = useRef(0);

  const h = heightFor(vw);
  const P = POSES[pose];
  const w = Math.round((P.w / P.h) * h);

  const changePose = useCallback((next) => {
    setPose((cur) => {
      if (cur !== next) setPrevPose(cur);
      return next;
    });
  }, []);

  const speak = useCallback((line, nextPose) => {
    if (line) setBubble({ line, open: true });
    if (nextPose && POSES[nextPose]) changePose(nextPose);
  }, [changePose]);

  const sparkle = useCallback((x, y, n = 6) => {
    const id = Math.random().toString(36).slice(2);
    setSparkles((s) => [...s, { id, x, y, n }]);
    window.setTimeout(() => setSparkles((s) => s.filter((p) => p.id !== id)), 900);
  }, []);

  // idle: after a long quiet spell she says one thing, once
  const poke = useCallback(() => {
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => speak('still here? take your time ♡ there are no rules in this universe.', 'think'), 45000);
  }, [speak]);

  // fly to a point on the screen
  const flyTo = useCallback(
    (px, py, line) => {
      const H = heightFor(window.innerWidth);
      const target = clampAnchor(px, py + H * 0.45, w, H);
      setAnchor((cur) => {
        const dir = target.x < cur.x - 4 ? 'left' : target.x > cur.x + 4 ? 'right' : null;
        if (dir) setFacing(dir);
        return target;
      });
      if (!isReducedMotion()) {
        setFlying(true);
        changePose('wow');
        window.clearTimeout(restTimer.current);
        restTimer.current = window.setTimeout(() => {
          setFlying(false);
          changePose(restPoseRef.current);
        }, 950);
      }
      if (line) setBubble({ line, open: true });
      sparkle(px, py);
      poke();
    },
    [w, changePose, sparkle, poke],
  );

  // click / tap anywhere that isn't a control → she flies there
  useEffect(() => {
    if (minimized) return undefined;
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.target.closest?.(INTERACTIVE)) return;
      if (String(window.getSelection?.() ?? '').length > 0) return;
      flyCount.current += 1;
      flyTo(e.clientX, e.clientY, flyCount.current % 2 === 1 ? FLY_LINES[(flyCount.current >> 1) % FLY_LINES.length] : null);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [flyTo, minimized]);

  // messages from the pages
  useEffect(() => {
    const onSay = (e) => {
      speak(e.detail.line, e.detail.pose);
      poke();
    };
    const onSparkle = () => sparkle(anchor.x, anchor.y - h * 0.6, 10);
    window.addEventListener('mascot:say', onSay);
    window.addEventListener('mascot:sparkle', onSparkle);
    return () => {
      window.removeEventListener('mascot:say', onSay);
      window.removeEventListener('mascot:sparkle', onSparkle);
    };
  }, [speak, poke, sparkle, anchor, h]);

  // a new world: go back to that world's resting spot
  useEffect(() => {
    setAnchor(restSpot());
    setFacing(null);
    changePose(restPoseRef.current);
    poke();
    const t = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(t);
  }, [restSpot, poke, changePose]);

  // window size
  useEffect(() => {
    const on = () => {
      setVw(window.innerWidth);
      setAnchor((a) => clampAnchor(a.x, a.y, w, heightFor(window.innerWidth)));
    };
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [w]);

  // she leans a little toward the pointer (fine pointers only)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    let frame = 0;
    const on = (e) => {
      if (isReducedMotion() || !rootRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = rootRef.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const lean = Math.max(-1, Math.min(1, dx / 700)) * 4;
        rootRef.current.style.setProperty('--lean', `${lean.toFixed(2)}deg`);
      });
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', on);
    };
  }, []);

  useEffect(() => () => {
    window.clearTimeout(idleTimer.current);
    window.clearTimeout(restTimer.current);
  }, []);

  const react = () => {
    const r = REACTIONS[reaction.current % REACTIONS.length];
    reaction.current += 1;
    speak(r.line, r.pose);
    sparkle(anchor.x, anchor.y - h * 0.7);
    poke();
  };

  const setMin = (v) => {
    setMinimized(v);
    try {
      sessionStorage.setItem('kx-mascot-min', v ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  const flip = P.faces && facing && P.faces !== facing;
  const bubbleW = Math.min(260, vw - 32);
  // low on the left of a wide screen, the bubble opens beside her instead of
  // above, so it doesn't cover what she's sitting next to
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const beside = vw >= 1000 && anchor.x < vw * 0.3 && anchor.y > vh * 0.6 && anchor.x + w / 2 + bubbleW + 24 < vw;
  const bubbleLeft = beside ? anchor.x + w / 2 + 8 : Math.min(Math.max(anchor.x - bubbleW / 2, 12), vw - bubbleW - 12);
  const bubbleTop = beside ? anchor.y - h * 0.45 : anchor.y - h - 12;

  if (minimized) {
    return (
      <button type="button" className="mascot-orb" onClick={() => setMin(false)} aria-label="Bring back Mini Kunjal, your guide">
        <img src={`${base}mascot/avatar.webp`} alt="" width="56" height="56" />
        <span className="mascot-orb__ping" aria-hidden="true" />
      </button>
    );
  }

  return (
    <>
      <div
        ref={rootRef}
        className={`mascot${flying ? ' is-flying' : ''}${ready ? '' : ' is-placing'}`}
        style={{ transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0)`, '--w': `${w}px`, '--h': `${h}px` }}
      >
        <button type="button" className="mascot__body" onClick={react} aria-label="Mini Kunjal, your guide — tap for a hint">
          <span className={`mascot__flip${flip ? ' is-flipped' : ''}`}>
            {Object.entries(POSES).map(([name, p]) => (
              <img
                key={name}
                className={`mascot__pose${name === pose ? ' is-on' : ''}${name === prevPose ? ' is-leaving' : ''}`}
                src={`${base}dream/${p.file}.webp`}
                alt=""
                width={p.w}
                height={p.h}
                draggable="false"
                decoding="async"
              />
            ))}
          </span>
        </button>
      </div>

      {bubble.open && (
        <div
          className={`mascot-bubble${beside ? ' mascot-bubble--beside' : ''}${ready ? '' : ' is-placing'}`}
          role="status"
          aria-live="polite"
          style={{ left: bubbleLeft, top: bubbleTop, width: bubbleW, '--tail': `${Math.min(Math.max(anchor.x - bubbleLeft, 24), bubbleW - 24)}px` }}
        >
          <p>{bubble.line}</p>
          <div className="mascot-bubble__tools">
            <button type="button" onClick={() => setBubble((b) => ({ ...b, open: false }))} aria-label="Close Mini Kunjal’s message">
              ×
            </button>
            <button type="button" onClick={() => setMin(true)} aria-label="Tuck Mini Kunjal away">
              –
            </button>
          </div>
        </div>
      )}

      {sparkles.map((s) => (
        <span key={s.id} className="spark" style={{ left: s.x, top: s.y }} aria-hidden="true">
          {Array.from({ length: s.n }, (_, i) => (
            <i key={i} style={{ '--a': `${(360 / s.n) * i}deg` }} />
          ))}
        </span>
      ))}
    </>
  );
}
