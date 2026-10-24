import { useEffect, useRef, useState } from 'react';
import { W, H, SCENES, SCENE_ORDER, roomAt, route, clampToRoom } from '../scene/scenes.js';
import { drawKunjal, drawSleeping } from '../scene/kunjal.js';
import { ACTIVITIES, ORDER, activityAt, nextAfter, istHour, fmtHour } from '../scene/routine.js';
import { isReducedMotion } from '../motion.js';
import { discover } from '../mascot.js';

const SPEED = 1.7; // grid cells per second
const FADE = 0.45; // seconds to fade between scenes
const LINKS = {
  projects: 'PROJECTS.EXE',
  research: 'RESEARCH.TXT',
  creative: 'CREATIVE.EXE',
  contact: 'CONTACT',
};
const SECRET_LINES = {
  cat: 'that’s Mochi ♡ the real boss of this apartment. secret found!',
  disco: 'disco mode unlocked ✦ dance break!',
  bunny: 'that’s Bun-bun, my oldest plushie. secret found!',
  sky: 'you peeked out of my window! secret found ✦',
};
const POKES = [
  'hi! i’m kunjal ♡ click any room and i’ll walk there.',
  'psst — the furniture is clickable.',
  'the room buttons take me to dance, rampwalk or art ✦',
  'did you meet Mochi? she’s in the living room.',
];
// what she does when you send her to a room
const ROOM_ACTIVITY = { dance: 'dance', walk: 'ramp', art: 'paint' };
const ROOM_ICONS = { home: '⌂', dance: '♪', walk: '✦', art: '✎' };

const placeOf = (a) =>
  `${ACTIVITIES[a].scene === 'home' ? (roomAt(SCENES.home, ACTIVITIES[a].spot.gx, ACTIVITIES[a].spot.gy)?.label ?? 'home') : SCENES[ACTIVITIES[a].scene].label}`;

// Mini Kunjal's home and rooms: she follows her daily routine in India time,
// walks room to room (out the front door to the dance, walk and art rooms),
// and goes wherever you click.
export default function Dollhouse({ onOpen }) {
  const canvasRef = useRef(null);
  const bubbleRef = useRef(null);
  const [now, setNow] = useState(() => new Date());
  const [mode, setMode] = useState('live');
  const [previewHour, setPreviewHour] = useState(() => istHour());
  const [override, setOverride] = useState(null); // an activity, 'roam', or null
  const [bubble, setBubble] = useState({ text: POKES[0], link: null });
  const [hover, setHover] = useState(null);
  const pokeIdx = useRef(0);

  const hour = mode === 'live' ? istHour(now) : previewHour;
  const scheduled = activityAt(hour);
  const act = override ?? scheduled;
  const next = nextAfter(hour);

  // she starts the visit already at whatever she's doing
  const [sceneId, setSceneId] = useState(() => ACTIVITIES[act === 'roam' ? 'chill' : act].scene);
  const ch = useRef(null);
  if (!ch.current) {
    const a = ACTIVITIES[act];
    ch.current = {
      scene: a.scene,
      ...a.spot,
      dir: 1,
      path: [],
      pending: null, // { scene, target } once she's headed out the door
      fade: 0, // > 0 while fading between scenes
      arrived: true,
      frame: 0,
      ft: 0,
      t: 0,
      wave: 0,
      rampDir: 1,
      rampPause: 0,
      paint: 0.2,
      feet: [0, 0],
      zf: 1,
    };
  }
  const actRef = useRef(act);
  actRef.current = act;
  const hourRef = useRef(hour);
  hourRef.current = hour;

  // clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  // walk to a spot, leaving through the front door first if it's in another scene
  const walkTo = (target, scene = ch.current.scene) => {
    const c = ch.current;
    if (scene !== c.scene && isReducedMotion()) {
      Object.assign(c, { scene, ...target, path: [], pending: null, arrived: true });
      setSceneId(scene);
      return;
    }
    if (scene !== c.scene) {
      c.path = route(SCENES[c.scene], c, SCENES[c.scene].exit);
      c.pending = { scene, target };
    } else if (isReducedMotion()) {
      Object.assign(c, target, { path: [], pending: null, arrived: true });
      return;
    } else {
      c.path = route(SCENES[scene], c, target);
      c.pending = null;
    }
    c.arrived = false;
  };

  // when the activity changes, go and do it, and say something
  const firstAct = useRef(true);
  useEffect(() => {
    if (act === 'roam') return;
    const a = ACTIVITIES[act];
    if (firstAct.current) firstAct.current = false;
    else walkTo({ ...a.spot }, a.scene);
    setBubble({
      text: a.lines[Math.floor(Math.random() * a.lines.length)],
      link: a.link ?? null,
    });
  }, [act]);

  // secrets and other announcements arrive as 'mascot:say' events
  useEffect(() => {
    const onSay = (e) => setBubble({ text: e.detail.line, link: null });
    window.addEventListener('mascot:say', onSay);
    return () => window.removeEventListener('mascot:say', onSay);
  }, []);

  // a roam (click-to-walk) wears off after a while and she gets back to her day
  useEffect(() => {
    if (override !== 'roam') return undefined;
    const id = setTimeout(() => setOverride(null), 14_000);
    return () => clearTimeout(id);
  }, [override]);

  // ---------------------------------------------------------------- loop --
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let last = performance.now();

    // render at the canvas's real size on screen, so everything stays sharp
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.max(W, Math.round(r.width * dpr));
      canvas.height = Math.round((canvas.width * H) / W);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const step = (nowMs) => {
      const reduced = isReducedMotion();
      const dt = Math.min(0.05, (nowMs - last) / 1000);
      last = nowMs;
      const c = ch.current;
      const a = actRef.current;
      if (!reduced) c.t += dt;

      // fading out the door and into the next scene
      if (c.fade > 0) {
        c.fade += dt;
        if (c.fade >= FADE && c.pending) {
          const { scene, target } = c.pending;
          const sc = SCENES[scene];
          Object.assign(c, { scene, ...sc.exit, pending: null });
          c.path = route(sc, c, target);
          setSceneId(scene);
        }
        if (c.fade >= FADE * 2) c.fade = 0;
      }

      // movement
      let pose = 'idle';
      const spec = a !== 'roam' ? ACTIVITIES[a] : null;
      if (c.path.length && !(c.fade > 0 && c.fade < FADE)) {
        const wp = c.path[0];
        const dx = wp.gx - c.gx;
        const dy = wp.gy - c.gy;
        const d = Math.hypot(dx, dy);
        const move = SPEED * dt;
        if (d <= move || reduced) {
          c.gx = wp.gx;
          c.gy = wp.gy;
          c.path.shift();
          if (!c.path.length) {
            if (c.pending) c.fade = 0.0001;
            else c.arrived = true;
          }
        } else {
          c.gx += (dx / d) * move;
          c.gy += (dy / d) * move;
          const sx = dx - dy; // direction on screen
          if (Math.abs(sx) > 0.05) c.dir = sx > 0 ? 1 : -1;
        }
        pose = 'walk';
      } else if (c.pending || c.fade > 0) {
        pose = 'walk';
      } else if (c.arrived && spec && spec.scene === c.scene) {
        pose = spec.pose;
        if (spec.runway) {
          // strut along the runway, pausing to pose at each end
          const { from, to } = spec.runway;
          if (c.rampPause > 0) {
            c.rampPause -= dt;
            pose = 'pose';
          } else if (!reduced) {
            c.gy += c.rampDir * SPEED * 0.6 * dt;
            c.dir = c.rampDir > 0 ? -1 : 1; // +gy walks toward the viewer's left
            if (c.gy > to || c.gy < from) {
              c.gy = Math.max(from, Math.min(to, c.gy));
              c.rampDir *= -1;
              c.rampPause = 1.4;
            }
          }
        } else c.dir = 1;
        if (a === 'paint') c.paint = Math.min(1, c.paint + dt / 25);
      }
      if (c.wave > 0) {
        c.wave -= dt;
        if (!c.path.length && pose !== 'sleep') pose = 'wave';
      }

      // animation frame
      c.ft += dt;
      const fps = pose === 'walk' || pose === 'ramp' ? 8 : pose === 'dance' ? 5 : 2.5;
      if (c.ft > 1 / fps && !reduced) {
        c.ft = 0;
        c.frame += 1;
      }

      // draw
      const scene = SCENES[c.scene];
      const atSpot = spec && spec.scene === c.scene && c.arrived && !c.path.length;
      const seat = atSpot && (pose === spec.pose || pose === 'pose') ? (spec.seat ?? 0) : 0;
      c.zf = scene.iso.zf;
      c.feet = scene.iso.P(c.gx, c.gy, seat);
      const k = canvas.width / W;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, W, H);
      scene.draw(ctx, {
        hour: hourRef.current,
        t: c.t,
        act: atSpot ? a : null,
        paintProgress: c.paint,
        actor: {
          gx: c.gx,
          gy: c.gy,
          z: seat,
          sleeping: pose === 'sleep',
          draw: (cx, x, y, sc) => drawKunjal(cx, x, y, pose, c.frame, c.dir, c.t, sc),
          drawSleeping: (cx, x, y, sc) => drawSleeping(cx, x, y, c.t, sc),
        },
      });
      if (c.fade > 0) {
        const f = c.fade < FADE ? c.fade / FADE : 2 - c.fade / FADE;
        ctx.fillStyle = `rgba(255, 238, 246, ${Math.max(0, Math.min(1, f))})`;
        ctx.fillRect(0, 0, W, H);
      }

      // keep the speech bubble over her head (and inside the frame)
      if (bubbleRef.current) {
        const [hx, hy] = pose === 'sleep' ? scene.iso.P(0.6, 1.62, 44) : [c.feet[0], c.feet[1] - 50 * c.zf];
        const b = bubbleRef.current;
        const sw = b.parentElement.clientWidth;
        const half = b.offsetWidth / 2;
        const want = (hx / W) * sw;
        const left = Math.min(Math.max(want, half + 4), sw - half - 4);
        b.style.left = `${left}px`;
        b.style.top = `${(Math.max(hy, 30) / H) * 100}%`;
        b.style.setProperty('--tail', `${Math.round(want - left)}px`);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // --------------------------------------------------------- interaction --
  const scene = SCENES[sceneId];

  const toCanvas = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  };

  const isOverHer = (p) => {
    const { feet, zf } = ch.current;
    return Math.abs(p.x - feet[0]) < 14 * zf && p.y > feet[1] - 52 * zf && p.y < feet[1] + 3;
  };

  const onCanvasClick = (e) => {
    const p = toCanvas(e);
    if (isOverHer(p)) {
      ch.current.wave = 1.8;
      pokeIdx.current = (pokeIdx.current + 1) % POKES.length;
      setBubble({ text: POKES[pokeIdx.current], link: null });
      return;
    }
    // clicked a floor → walk there
    const g = scene.iso.toGrid(p.x, p.y);
    const target = clampToRoom(scene, g.gx, g.gy);
    if (!target || ch.current.pending || ch.current.fade > 0) return;
    walkTo(target, sceneId);
    setOverride('roam');
    setBubble({
      text: ['on my way ✦', 'coming!', 'ooh, this room?', 'wheee ♡'][Math.floor(Math.random() * 4)],
      link: null,
    });
  };

  const onCanvasMove = (e) => {
    const p = toCanvas(e);
    const overHer = isOverHer(p);
    const g = scene.iso.toGrid(p.x, p.y);
    canvasRef.current.style.cursor = overHer || roomAt(scene, g.gx, g.gy) ? 'pointer' : 'default';
    if (overHer) setHover('Mini Kunjal — click me');
    else setHover((h) => (h === 'Mini Kunjal — click me' ? null : h));
  };

  const activate = (o) => {
    if (o.secret) {
      // discover() announces the find (and the running count) through 'mascot:say'
      if (o.secret === 'disco') {
        setOverride('dance');
        setMode('preview');
      }
      discover(o.secret, SECRET_LINES[o.secret]);
      ch.current.wave = 1.8;
      return;
    }
    if (o.resume) {
      window.open(`${import.meta.env.BASE_URL}resume/Kunjal_Mahajan_Resume.pdf`, '_blank', 'noopener');
      setBubble({ text: 'my résumé is pinned there — opening it ↗', link: null });
      return;
    }
    if (o.activity) setOverride(o.activity);
    if (o.link && !o.activity) onOpen(o.link);
    if (o.link && o.activity) setBubble({ text: ACTIVITIES[o.activity].lines[0], link: o.link });
  };

  const goToRoom = (id) => {
    if (id === 'home') setOverride(ACTIVITIES[scheduled].scene === 'home' ? null : 'chill');
    else setOverride(ROOM_ACTIVITY[id]);
  };

  const pickActivity = (id) => {
    setOverride(id);
    setMode('preview');
    setPreviewHour(hour);
  };

  const followIST = () => {
    setOverride(null);
    setMode('live');
    setNow(new Date());
  };

  const scrub = (v) => {
    setMode('preview');
    setOverride(null);
    setPreviewHour(Number(v));
  };

  const status = act === 'roam' ? 'Wandering around' : ACTIVITIES[act].status;
  const modeLabel =
    override === 'roam'
      ? 'Following your click'
      : override
        ? 'Your pick'
        : mode === 'live'
          ? 'Live · following IST'
          : `Preview · ${fmtHour(hour)} IST`;

  return (
    <section className="dollhouse" aria-labelledby="dollhouse-title">
      <div className="dollhouse__head">
        <p id="dollhouse-title" className="dollhouse__status" tabIndex={-1}>
          <span className="dollhouse__dot" aria-hidden="true" /> {status}
          <span className="dollhouse__mode">{modeLabel}</span>
        </p>
        <nav className="rooms" aria-label="Rooms">
          {SCENE_ORDER.map((id) => (
            <button key={id} type="button" aria-pressed={sceneId === id} onClick={() => goToRoom(id)}>
              <span aria-hidden="true">{ROOM_ICONS[id]}</span> {SCENES[id].label}
            </button>
          ))}
        </nav>
      </div>

      <div className="dollhouse__frame">
        <div className="dollhouse__stage">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="dollhouse__canvas"
            onClick={onCanvasClick}
            onMouseMove={onCanvasMove}
            onMouseLeave={() => setHover(null)}
            role="img"
            aria-label={`An illustrated view of Kunjal’s ${sceneId === 'home' ? 'home: bedroom, living room, coding corner and entrance' : scene.label.toLowerCase()}. Mini Kunjal is ${act === 'roam' ? 'wandering around' : `in the ${placeOf(act).toLowerCase()}: ${status.toLowerCase()}`}.`}
          />

          {scene.rooms.length > 1 &&
            scene.rooms.map((r) => {
              // back rooms: above their back wall; front rooms: on the front edge
              const [x, y] =
                r.y0 === 0 ? scene.iso.P((r.x0 + r.x1) / 2, -0.2, 92) : scene.iso.P((r.x0 + r.x1) / 2, r.y1 + 0.1, -8);
              return (
                <span
                  key={r.id}
                  className="dollhouse__room"
                  aria-hidden="true"
                  style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
                >
                  {r.label}
                </span>
              );
            })}

          {scene.objects.map((o) => (
            <button
              key={`${sceneId}-${o.id}`}
              type="button"
              className="hotspot"
              aria-label={o.label}
              onClick={() => activate(o)}
              onMouseEnter={() => setHover(o.label)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(o.label)}
              onBlur={() => setHover(null)}
              style={{
                left: `${(o.x / W) * 100}%`,
                top: `${(o.y / H) * 100}%`,
                width: `${(o.w / W) * 100}%`,
                height: `${(o.h / H) * 100}%`,
              }}
            />
          ))}

          {bubble && (
            <div className="bubble" ref={bubbleRef} role="status" aria-live="polite">
              <p>{bubble.text}</p>
              {bubble.link && (
                <button type="button" className="bubble__link" onClick={() => onOpen(bubble.link)}>
                  open {LINKS[bubble.link]} ↗
                </button>
              )}
              <button
                type="button"
                className="bubble__close"
                onClick={() => setBubble(null)}
                aria-label="Close speech bubble"
              >
                ×
              </button>
            </div>
          )}

          {hover && (
            <p className="dollhouse__hover" aria-hidden="true">
              {hover}
            </p>
          )}
          <p className="dollhouse__next">
            Next: {ACTIVITIES[next.act].status} at {next.at} IST
          </p>
        </div>
      </div>

      <div className="routine" role="group" aria-label="What should she do?">
        {ORDER.map((id) => (
          <button key={id} type="button" aria-pressed={act === id} onClick={() => pickActivity(id)}>
            <span className="routine__icon" aria-hidden="true">
              {ACTIVITIES[id].icon}
            </span>
            {ACTIVITIES[id].label}
          </button>
        ))}
      </div>

      <div className="timeline">
        <label htmlFor="day-scrub">Preview the day</label>
        <input
          id="day-scrub"
          type="range"
          min="0"
          max="23.99"
          step="0.25"
          value={hour}
          onChange={(e) => scrub(e.target.value)}
        />
        <output htmlFor="day-scrub">{fmtHour(hour)} IST</output>
        <button type="button" className="timeline__live" onClick={followIST} aria-pressed={mode === 'live'}>
          <span aria-hidden="true">●</span> Follow IST
        </button>
      </div>
    </section>
  );
}
