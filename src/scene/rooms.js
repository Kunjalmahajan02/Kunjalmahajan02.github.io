// The three rooms you visit on their own: the dance room (with a karaoke
// corner), the walk room (a runway for rampwalk practice) and the art room.
// Each is one room, seen a little closer than the home map, entered through
// a door in its front wall.
//
//   every room: x 0–7, y 0–5; the door is at x 3.5 on the y = 5 front wall

import { C, makeIso, makeKit, shade, skyFor, drawBackdrop, nightLights, boxArea, wallArea, wallPieces } from './kit.js';

const iso = makeIso({ T: 34, ox: 286, oy: 146 });
const { P, zf } = iso;
const WALL = 84;
const LOW = 16;
const DOOR = 3.5;
const room = (id, label) => [{ id, label, x0: 0, x1: 7, y0: 0, y1: 5 }];
const frontWalls = [
  ...wallPieces('x', 7, 0, 5, [], 0.6, 0.22).map((p) => ({ ...p, h: LOW })),
  ...wallPieces('y', 5, 0, 7, [DOOR], 0.55, 0.22).map((p) => ({ ...p, h: LOW })),
];

// the parts every room shares: garden, walls, front walls with a door
function shell(ctx, k, s, { floor, wallY, wallX, items, lights }) {
  const sky = skyFor(s.hour);
  drawBackdrop(ctx, sky, s.t);
  k.garden(0, 0, 7, 5, 0.9, sky.night, s.t, (gx) => gx > DOOR - 0.8 && gx < DOOR + 0.8);
  for (let i = 0; i < 2; i++) k.floorOval(sky.night ? '#7d7a8e' : '#b9ab9a', DOOR, 5.45 + i * 0.4, 0.16);
  floor();
  k.wallpaper('y', 0, 7, WALL, ...wallY);
  k.wallpaper('x', 0, 5, WALL, ...wallX);
  k.poly('#d6c2ad', [
    P(0, 0, WALL),
    P(7, 0, WALL),
    P(7, -0.3, WALL),
    P(-0.3, -0.3, WALL),
    P(-0.3, 5, WALL),
    P(0, 5, WALL),
  ]);
  k.poly('#b9a189', [P(7, -0.3, 0), P(7, 0, 0), P(7, 0, WALL), P(7, -0.3, WALL)]);
  k.poly('#c9b29b', [P(-0.3, 5, 0), P(0, 5, 0), P(0, 5, WALL), P(-0.3, 5, WALL)]);
  for (const w of frontWalls)
    items.push({
      key: w.x0 + w.w / 2 + w.y0 + w.d / 2 + 0.3,
      fn: () => {
        k.box(w.x0, w.y0, w.w, w.d, w.h, '#d3bea8', 0, { top: '#eee1cf', left: '#c9b49e', right: '#ae9883' });
        const along = w.w > w.d;
        for (let u = (along ? w.x0 : w.y0) + 0.15; u < (along ? w.x0 + w.w : w.y0 + w.d) - 0.1; u += 0.45) {
          const q = along
            ? [P(u, w.y0 + w.d, 4), P(u + 0.3, w.y0 + w.d, 4), P(u + 0.3, w.y0 + w.d, 12), P(u, w.y0 + w.d, 12)]
            : [P(w.x0 + w.w, u, 4), P(w.x0 + w.w, u + 0.3, 4), P(w.x0 + w.w, u + 0.3, 12), P(w.x0 + w.w, u, 12)];
          k.poly(sky.night ? '#3e3d73' : '#9db0bf', q);
        }
      },
    });
  // the doorway, with a frame and a little mat
  items.push({
    key: DOOR + 5 + 0.4,
    fn: () => {
      k.box(DOOR - 0.67, 4.89, 0.12, 0.22, 58, '#d3bea8');
      k.box(DOOR + 0.55, 4.89, 0.12, 0.22, 58, '#d3bea8');
      k.box(DOOR - 0.67, 4.89, 1.34, 0.22, 5, '#d3bea8', 53);
      k.rugRect(DOOR - 0.45, 5.1, DOOR + 0.45, 5.4, C.rose, C.hot, 'dots');
      lights.push([P(DOOR, 5, 48), 24, '255, 214, 150', 0.22]);
    },
  });
  return sky;
}

function finish(ctx, k, s, sky, items, lights) {
  if (s.actor && !s.actor.sleeping)
    items.push({
      key: s.actor.gx + s.actor.gy + (s.actor.z ? 0.6 : 0),
      fn: () => s.actor.draw(ctx, ...P(s.actor.gx, s.actor.gy, s.actor.z ?? 0), zf * 1.18),
    });
  items.sort((a, b) => a.key - b.key).forEach((it) => it.fn());
  nightLights(ctx, k, sky, lights);
}

// ---------------------------------------------------------- dance room --
function drawDance(ctx, s) {
  const { t, act } = s;
  const k = makeKit(ctx, iso);
  const items = [];
  const lights = [];
  const add = (key, fn) => items.push({ key, fn });
  const party = act === 'dance' || act === 'sing';
  const sky = shell(ctx, k, s, {
    floor: () => {
      k.planks('#bd8352', '#9c6a3d', 0, 0, 7, 5, 0.5);
      // a glossy shine on the dance floor
      for (let i = 0; i < 5; i++)
        k.poly('rgba(255,255,255,0.12)', [
          P(1 + i * 1.2, 0.4),
          P(1.4 + i * 1.2, 0.4),
          P(0.6 + i * 1.2, 4.6),
          P(0.2 + i * 1.2, 4.6),
        ]);
    },
    wallY: ['#8f7ba1', 'stars', '#a08db2'],
    wallX: ['#8f7ba1', 'stars', '#a08db2'],
    items,
    lights,
  });

  // mirror wall + ballet barre
  k.onWall('y', '#a7804f', 1.8, 6.7, 6, 76);
  const mg = ctx.createLinearGradient(...P(1.9, 0, 74), ...P(6.6, 0, 8));
  mg.addColorStop(0, '#eef6ff');
  mg.addColorStop(1, '#d7e6f8');
  k.onWall('y', mg, 1.9, 6.6, 8, 74);
  for (let i = 0; i < 5; i++)
    k.stroke('rgba(255,255,255,0.75)', 1.5, [P(2.3 + i * 0.95, 0, 64), P(2.7 + i * 0.95, 0, 22)]);
  for (const u of [3.4, 5.0]) k.stroke('#e3d4c8', 1, [P(u, 0, 8), P(u, 0, 74)]);
  k.stroke('#c99a6e', 2.4 * zf, [P(1.9, 0.3, 34), P(6.6, 0.3, 34)]);
  for (const u of [2.2, 4.2, 6.3]) k.stroke('#a98a6e', 1.2, [P(u, 0.3, 34), P(u, 0, 34)]);
  // spotlights along the top of the mirror wall
  const cols = ['255, 120, 190', '190, 150, 255', '255, 200, 120', '140, 200, 255'];
  for (let i = 0; i < 5; i++) {
    const p = P(2 + i * 1.1, 0.2, 80);
    k.oval('#2b2433', p, 3 * zf, 2.4 * zf);
    if (party || sky.night)
      lights.push([P(2 + i * 1.1 + Math.sin(t + i) * 0.4, 1.8 + (i % 2), 0), 34, cols[i % 4], party ? 0.35 : 0.15]);
  }
  // window + karaoke screen on the left wall
  k.window('x', 0.5, 1.7, 36, 70, sky, t, 0, true);
  k.onWall('x', '#2d2442', 2.4, 4.4, 30, 64);
  k.onWall('x', party && act === 'sing' ? '#6a4aa8' : '#5a4790', 2.5, 4.3, 33, 61);
  const kk = Math.floor(t * 2) % 4;
  for (let i = 0; i < 3; i++) {
    const len = act === 'sing' && i === 1 ? 0.3 + kk * 0.35 : 1.3;
    k.stroke(i === 1 ? C.blush : '#e6dcff', 1.5, [P(0, 2.75, 54 - i * 7), P(0, 2.75 + len, 54 - i * 7)]);
  }
  k.heart(C.hot, P(0, 4.0, 56), 6);
  if (act === 'sing') lights.push([P(0.2, 3.4, 46), 40, '196, 170, 255', 0.4]);
  k.fairyLights('x', 0.2, 4.8, WALL - 8, t).forEach(
    (p, i) => i % 4 === 0 && lights.push([p, 18, '255, 214, 150', 0.2]),
  );

  add(1.0, () => {
    // speaker tower with glowing rings
    k.box(0.15, 0.15, 0.7, 0.6, 46, '#2b2433', 0, { top: '#3d3448' });
    for (const z of [12, 32]) {
      const c = P(0.5, 0.75, z);
      const pulse = party ? 1 + Math.sin(t * 10) * 0.08 : 1;
      ctx.strokeStyle = '#a77dff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(c[0], c[1], 6 * zf * pulse, 6.4 * zf * pulse, 0, 0, Math.PI * 2);
      ctx.stroke();
      k.oval('#1a1520', c, 4 * zf, 4.3 * zf);
      lights.push([c, 18, '170, 120, 255', party ? 0.4 : 0.15]);
    }
  });
  add(5.4, () => {
    // mic stand (she holds the mic while singing)
    if (act !== 'sing') {
      k.stroke('#4a4458', 1.3, [P(1.45, 3.7, 0), P(1.45, 3.7, 34)]);
      k.stroke('#4a4458', 1.3, [P(1.25, 3.7, 0), P(1.65, 3.7, 0)]);
      k.oval('#c9c9cf', P(1.45, 3.7, 36), 2.2 * zf, 2.6 * zf);
    }
  });
  add(9.4, () => {
    // basket of yoga mats
    k.box(6.0, 3.6, 0.7, 0.6, 12, '#d8b48c', 0, { top: '#c9a47c' });
    [C.lilac, C.pink, C.mint].forEach((c, i) => k.box(6.15 + i * 0.18, 3.75, 0.14, 0.14, 14 + i * 3, c, 10));
  });
  add(6.6, () => k.plant(6.55, 0.6, 1.15, 0, 'palm'));
  add(2.6, () => k.plant(0.5, 2.2, 0.9, 0, 'leafy'));
  add(8.3, () => {
    // ballet shoes + water bottle
    k.box(5.0, 3.6, 0.22, 0.12, 2, C.blush);
    k.box(5.0, 3.78, 0.22, 0.12, 2, C.blush);
    k.box(5.6, 3.3, 0.14, 0.14, 12, C.mint);
  });

  finish(ctx, k, s, sky, items, lights);

  // the disco ball, with sparkles and colour spots when the music's on
  const [dx, dy] = P(3.8, 2.4, 118);
  ctx.strokeStyle = '#c9b8d8';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(dx, 0);
  ctx.lineTo(dx, dy - 10);
  ctx.stroke();
  const g = ctx.createRadialGradient(dx - 3, dy - 3, 1, dx, dy, 10);
  g.addColorStop(0, '#eee1cf');
  g.addColorStop(1, '#b8aed6');
  k.dot(g, [dx, dy], 10);
  for (let i = 0; i < 14; i++) {
    const a = i * 0.7 + t * 2;
    k.dot(i % 2 ? '#eee1cf' : C.lilac, [dx + Math.sin(a) * 7 * Math.abs(Math.cos(a)), dy - 7 + (i % 6) * 2.6], 1);
  }
  if (party) {
    for (let i = 0; i < 9; i++) {
      const p = P(0.6 + ((i * 0.83 + t * 0.4) % 6), 0.6 + ((i * 1.31 + t * 0.25) % 4));
      k.oval(['rgba(255,143,191,0.35)', 'rgba(205,188,245,0.4)', 'rgba(255,217,122,0.35)'][i % 3], p, 8, 3.6);
    }
    for (let i = 0; i < 5; i++)
      k.sparkle('#eee1cf', [dx - 50 + ((i * 23 + t * 20) % 100), dy + 20 + ((i * 17) % 50)], 3);
  }
}

// ----------------------------------------------------------- walk room --
function drawWalk(ctx, s) {
  const { t, act } = s;
  const k = makeKit(ctx, iso);
  const items = [];
  const lights = [];
  const add = (key, fn) => items.push({ key, fn });
  const ramp = act === 'ramp';
  const sky = shell(ctx, k, s, {
    floor: () => k.planks('#bc8556', '#9f6d42', 0, 0, 7, 5, 0.5),
    wallY: ['#c99098', 'dots', '#b97f88'],
    wallX: ['#c99098', 'dots', '#b97f88'],
    items,
    lights,
  });

  // the stage arch with curtains at the end of the runway
  k.onWall('y', '#a9666f', 2.4, 4.2, 0, 76);
  k.onWall('y', '#7a2f55', 2.6, 4.0, 0, 70);
  for (let u = 2.65; u < 3.98; u += 0.16) k.onWall('y', '#94416c', u, u + 0.07, 0, 68);
  for (let i = 0; i <= 14; i++) {
    const f = i / 14;
    const p = P(2.45 + f * 1.7, 0, 74 - Math.abs(f - 0.5) * 6);
    k.dot('#ffe2a4', p, 1.3 * zf);
  }
  for (let z = 6; z < 72; z += 8) {
    k.dot('#ffe2a4', P(2.45, 0, z), 1.3 * zf);
    k.dot('#ffe2a4', P(4.15, 0, z), 1.3 * zf);
  }
  lights.push([P(3.3, 0.2, 60), 50, '255, 200, 210', ramp ? 0.4 : 0.2]);
  // lit arched mirrors on the left wall
  for (const [a, b] of [
    [0.6, 1.5],
    [1.9, 2.8],
  ]) {
    k.onWall('x', '#c09359', a - 0.08, b + 0.08, 8, 74);
    k.onWall('x', '#e6f0fb', a, b, 10, 70);
    k.stroke('rgba(255,255,255,0.9)', 1.3, [P(0, a + 0.2, 56), P(0, a + 0.5, 30)]);
    for (let z = 12; z < 72; z += 7) {
      k.dot('#ffe2a4', P(0, a - 0.05, z), 1.2 * zf);
      k.dot('#ffe2a4', P(0, b + 0.05, z), 1.2 * zf);
    }
    lights.push([P(0.1, (a + b) / 2, 44), 34, '255, 225, 170', 0.3]);
  }
  k.frame('x', 3.4, 4.2, 44, 62, 'floral');
  // a shelf of bags above the clothes rack
  k.onWall('y', '#8e5f3e', 4.8, 6.7, 60, 62);
  [C.hot, '#2b1f33', C.lilac, C.blush].forEach((c, i) => {
    const p = P(5.0 + i * 0.45, 0.05, 62);
    k.poly(c, [
      [p[0] - 4, p[1]],
      [p[0] + 4, p[1]],
      [p[0] + 3, p[1] - 6],
      [p[0] - 3, p[1] - 6],
    ]);
    ctx.strokeStyle = '#8a6a7a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(p[0], p[1] - 6, 2.2, Math.PI, 0);
    ctx.stroke();
  });
  k.fairyLights('x', 0.2, 4.8, WALL - 8, t).forEach(
    (p, i) => i % 4 === 0 && lights.push([p, 18, '255, 214, 150', 0.2]),
  );

  add(4.6, () => {
    // the runway: a raised pink catwalk with lights down both sides
    k.box(2.7, 0.3, 1.2, 4.3, 5, '#c48c93', 0, { top: '#d29da2', left: '#b47c84', right: '#a26c75' });
    for (let v = 0.5; v < 4.5; v += 0.3) {
      const on = !ramp || (Math.floor(t * 6) + Math.round(v * 10)) % 6 < 4;
      k.dot(on ? '#ffe2a4' : '#f3d4e0', P(2.78, v, 5.2), 1.1 * zf);
      k.dot(on ? '#ffe2a4' : '#f3d4e0', P(3.82, v, 5.2), 1.1 * zf);
      if (on && ramp && Math.round(v * 10) % 9 === 0) lights.push([P(3.3, v, 6), 22, '255, 220, 160', 0.25]);
    }
  });
  // little floor spotlights pointing at the runway
  for (const [gx, gy] of [
    [2.2, 1.4],
    [2.2, 3.2],
    [4.4, 2.0],
    [4.4, 3.8],
  ])
    add(gx + gy, () => {
      k.box(gx - 0.1, gy - 0.1, 0.2, 0.2, 3, '#2b2433');
      k.oval('#2b2433', P(gx, gy, 7), 2.6 * zf, 2 * zf);
      if (ramp || sky.night) lights.push([P(gx + (gx < 3 ? 0.6 : -0.6), gy, 4), 26, '255, 230, 200', 0.25]);
    });
  add(5.3, () => {
    // clothes rack with dresses
    k.stroke('#9a7b6a', 1.4, [P(4.9, 0.4, 0), P(4.9, 0.4, 50)]);
    k.stroke('#9a7b6a', 1.4, [P(6.6, 0.4, 0), P(6.6, 0.4, 50)]);
    k.stroke(C.gold, 1.4, [P(4.9, 0.4, 50), P(6.6, 0.4, 50)]);
    [C.pink, '#2b1f33', C.lilac, '#eee1cf', C.peach, C.hot, '#d9c3a6'].forEach((c, i) => {
      const u = 5.05 + i * 0.22;
      k.stroke('#8a6f60', 0.7, [P(u, 0.4, 50), P(u, 0.4, 47)]);
      k.poly(c, [P(u - 0.06, 0.4, 47), P(u + 0.06, 0.4, 47), P(u + 0.12, 0.4, 24), P(u - 0.12, 0.4, 24)]);
    });
  });
  add(8.0, () => {
    // dress form with a pink gown
    const p = P(6.4, 1.6, 0);
    k.stroke(C.woodLo, 1.4, [p, [p[0], p[1] - 20 * zf]]);
    k.oval('#d9c8b6', [p[0], p[1] - 46 * zf], 5 * zf, 7 * zf);
    k.poly(C.pink, [
      [p[0] - 5 * zf, p[1] - 40 * zf],
      [p[0] + 5 * zf, p[1] - 40 * zf],
      [p[0] + 11 * zf, p[1] - 18 * zf],
      [p[0] - 11 * zf, p[1] - 18 * zf],
    ]);
    k.dot('#b8a28f', [p[0], p[1] - 54 * zf], 1.6 * zf);
  });
  add(8.6, () => {
    // fluffy rug + pouf
    k.fluffyRug(5.6, 3.3, 0.7, '#ddcfbf');
    const p = P(5.6, 3.3, 0);
    k.oval('#c08e93', [p[0], p[1] - 5 * zf], 9 * zf, 6 * zf);
    k.oval('#d6aaa9', [p[0], p[1] - 9 * zf], 9 * zf, 4 * zf);
  });
  add(1.2, () => k.plant(0.5, 0.6, 1.1, 0, 'leafy'));
  add(10.3, () => k.plant(6.5, 3.9, 1.15, 0, 'palm'));
  add(5.1, () => k.plant(0.6, 4.4, 0.9, 0, 'flowers'));

  finish(ctx, k, s, sky, items, lights);
  if (ramp && Math.floor(t * 3) % 4 === 0) {
    k.sparkle('#eee1cf', P(1.9, 4.2, 30), 6);
    k.sparkle('#eee1cf', P(4.7, 2.6, 34), 6);
  }
}

// ------------------------------------------------------------ art room --
function drawArt(ctx, s) {
  const { t } = s;
  const k = makeKit(ctx, iso);
  const items = [];
  const lights = [];
  const add = (key, fn) => items.push({ key, fn });
  const sky = shell(ctx, k, s, {
    floor: () => {
      k.planks('#c18a5a', '#a47044', 0, 0, 7, 5, 0.5);
      k.rugRect(0.9, 2.3, 4.7, 4.6, '#c3cbdb', '#a9646f', 'flowers');
    },
    wallY: ['#e4cfab', 'florals', '#d4bb93'],
    wallX: ['#e4cfab', 'florals', '#d4bb93'],
    items,
    lights,
  });

  k.window('x', 0.5, 2.1, 34, 70, sky, t);
  k.hangingPlant('x', 2.5, 76);
  k.frame('y', 0.5, 1.1, 46, 62, 'floral');
  k.frame('y', 1.3, 2.1, 50, 70, 'floral', 0, C.rose);
  k.frame('y', 2.4, 2.9, 44, 56, 'sketch', 0, C.lilac);
  k.frame('y', 3.1, 3.7, 52, 66, 'heart');
  k.ivy('y', 0.2, 6.8, WALL - 6);
  k.fairyLights('y', 0.3, 6.7, WALL - 10, t).forEach(
    (p, i) => i % 4 === 0 && lights.push([p, 18, '255, 214, 150', 0.2]),
  );

  add(4.9, () => {
    // bookshelf of art books
    k.box(4.2, 0.08, 1.1, 0.5, 58, '#8e5f3e', 0, { top: '#a06c47', left: '#835838' });
    const books = [C.pink, C.lilac, C.mint, C.gold, C.rose, '#a594e0', C.peach, C.hot];
    for (let sh = 0; sh < 4; sh++) {
      const z = 4 + sh * 13.5;
      let u = 4.25;
      for (let b = 0; u < 5.24; b++) {
        const bw = 0.08 + ((b + sh) % 3) * 0.03;
        const bh = 8 + ((b * 3 + sh) % 4);
        k.poly(books[(b + sh * 3) % books.length], [
          P(u, 0.58, z + 1.4),
          P(u + bw, 0.58, z + 1.4),
          P(u + bw, 0.58, z + 1.4 + bh),
          P(u, 0.58, z + 1.4 + bh),
        ]);
        u += bw + 0.015;
      }
    }
    k.plant(4.75, 0.33, 0.5, 58, 'flowers', '#eee1cf');
  });
  add(6.6, () => {
    // paint desk with jars, brushes and a lamp
    k.box(5.6, 0.1, 1.25, 0.65, 2, '#a26d48', 18, { top: '#b98257' });
    for (const [a, b] of [
      [5.65, 0.15],
      [6.75, 0.15],
      [5.65, 0.65],
      [6.75, 0.65],
    ])
      k.box(a, b, 0.06, 0.06, 18, C.woodLo);
    [C.hot, C.mint, C.gold, C.lilac, '#8ec3f0'].forEach((c, i) =>
      k.box(5.75 + i * 0.2, 0.45, 0.14, 0.14, 5, c, 20, { top: shade(c, 0.4) }),
    );
    k.box(6.4, 0.2, 0.15, 0.15, 7, '#c4805f', 20);
    for (let i = 0; i < 3; i++)
      k.stroke([C.woodLo, C.hot, C.lilac][i], 0.9, [P(6.45 + i * 0.03, 0.25, 26), P(6.42 + i * 0.05, 0.22, 34)]);
    lights.push([k.lamp(5.8, 0.25, 20), 32]);
  });
  add(4.2, () => {
    // canvases leaning on the left wall
    for (let i = 0; i < 3; i++)
      k.poly(['#efe2cf', '#f6e6d4', '#fff'][i], [
        P(0.05 + i * 0.08, 2.6 + i * 0.12, 0),
        P(0.05 + i * 0.08, 3.3 + i * 0.12, 0),
        P(0.15 + i * 0.08, 3.3 + i * 0.12, 30 - i * 4),
        P(0.15 + i * 0.08, 2.6 + i * 0.12, 30 - i * 4),
      ]);
  });
  add(4.9, () => {
    // art cart with jars of brushes
    k.box(0.4, 3.9, 0.7, 0.6, 3, '#a26d48', 22);
    k.box(0.4, 3.9, 0.7, 0.6, 3, '#a26d48', 10);
    for (const [a, b] of [
      [0.42, 3.92],
      [1.04, 3.92],
      [0.42, 4.44],
      [1.04, 4.44],
    ])
      k.box(a, b, 0.05, 0.05, 25, '#7d5236');
    [C.hot, C.mint, C.gold].forEach((c, i) => {
      k.box(0.5 + i * 0.2, 4.05, 0.14, 0.14, 7, '#cfd8dc', 25, { top: '#b9c6cc' });
      k.stroke(c, 1, [P(0.57 + i * 0.2, 4.12, 30), P(0.6 + i * 0.2, 4.1, 38)]);
    });
  });
  add(4.75, () => {
    // the easel, with today's painting filling in as she works
    const p = Math.max(0.12, Math.min(1, s.paintProgress ?? 1));
    k.stroke(C.woodLo, 1.8, [P(2.2, 1.95, 0), P(2.5, 1.7, 62)]);
    k.stroke(C.woodLo, 1.8, [P(3.1, 1.95, 0), P(2.8, 1.7, 62)]);
    k.stroke(C.wood, 1.8, [P(2.65, 1.35, 0), P(2.65, 1.7, 58)]);
    const cv = (a, b, za, zb, c) => k.poly(c, [P(a, 1.76, za), P(b, 1.76, za), P(b, 1.76, zb), P(a, 1.76, zb)]);
    cv(2.05, 3.25, 22, 58, '#f1e6d4');
    cv(2.05, 3.25, 58 - 14 * p, 58, '#dfe8fb');
    if (p > 0.3) {
      // pink blossoms appearing on the canvas
      const n = Math.floor(p * 9);
      for (let i = 0; i < n; i++) {
        const c = P(2.2 + ((i * 0.37) % 0.95), 1.76, 28 + ((i * 7) % 22));
        k.stroke(C.leafLo, 0.7, [c, [c[0], c[1] + 5]]);
        for (let j = 0; j < 5; j++)
          k.dot(i % 2 ? C.pink : C.hot, [c[0] + Math.cos(j * 1.26) * 1.8, c[1] + Math.sin(j * 1.26) * 1.8], 1.1);
      }
    }
    k.poly(C.woodLo, [P(2.0, 1.77, 20), P(3.3, 1.77, 20), P(3.3, 1.77, 22), P(2.0, 1.77, 22)]);
  });
  add(5.9, () => {
    // stool + palette
    k.box(3.3, 2.5, 0.4, 0.4, 2, C.wood, 18, { top: '#c48f5f' });
    for (const [a, b] of [
      [3.32, 2.52],
      [3.64, 2.52],
      [3.32, 2.84],
      [3.64, 2.84],
    ])
      k.box(a, b, 0.05, 0.05, 18, C.woodLo);
    const pl = P(3.5, 2.7, 20.5);
    k.oval('#d8b88f', pl, 6 * zf, 3 * zf);
    [C.hot, C.mint, C.gold, C.lilac].forEach((c, i) => k.dot(c, [pl[0] - 3 * zf + i * 2 * zf, pl[1] - 0.5], 1 * zf));
  });
  add(1.2, () => k.plant(0.5, 0.6, 1.15, 0, 'palm'));
  add(10.2, () => k.plant(6.5, 3.8, 1.1, 0, 'leafy'));
  add(8.6, () => k.plant(6.5, 2.1, 0.8, 0, 'flowers'));

  finish(ctx, k, s, sky, items, lights);
}

const exit = { gx: DOOR, gy: 4.7 };

export const dance = {
  id: 'dance',
  label: 'Dance room',
  iso,
  rooms: room('dance', 'Dance room'),
  doors: [],
  exit,
  objects: [
    {
      id: 'mirror',
      label: 'Mirror wall — dance',
      ...wallArea(iso, 'y', 1.9, 6.6, 8, 74),
      activity: 'dance',
      link: 'creative',
    },
    { id: 'karaoke', label: 'Karaoke screen — sing', ...wallArea(iso, 'x', 2.4, 4.4, 30, 64), activity: 'sing' },
    { id: 'speaker', label: 'Speaker — karaoke', ...boxArea(iso, 0.15, 0.15, 0.7, 0.6, 46), activity: 'sing' },
    {
      id: 'disco',
      label: 'Disco ball',
      x: P(3.8, 2.4, 118)[0] - 12,
      y: P(3.8, 2.4, 118)[1] - 12,
      w: 24,
      h: 24,
      secret: 'disco',
    },
  ],
  draw: drawDance,
};

export const walk = {
  id: 'walk',
  label: 'Walk room',
  iso,
  rooms: room('walk', 'Walk room'),
  doors: [],
  exit,
  objects: [
    {
      id: 'runway',
      label: 'Runway — rampwalk',
      ...boxArea(iso, 2.7, 0.3, 1.2, 4.3, 5),
      activity: 'ramp',
      link: 'creative',
    },
    { id: 'rack', label: 'Clothes rack — fashion', ...boxArea(iso, 4.9, 0.3, 1.7, 0.2, 52), link: 'creative' },
    { id: 'mirrors', label: 'Lit mirrors — rampwalk', ...wallArea(iso, 'x', 0.5, 2.9, 8, 74), activity: 'ramp' },
  ],
  draw: drawWalk,
};

export const art = {
  id: 'art',
  label: 'Art room',
  iso,
  rooms: room('art', 'Art room'),
  doors: [],
  exit,
  objects: [
    {
      id: 'easel',
      label: 'Easel — sketch & paint',
      ...boxArea(iso, 2.0, 1.3, 1.3, 0.7, 62),
      activity: 'paint',
      link: 'creative',
    },
    { id: 'desk', label: 'Paint desk — creative', ...boxArea(iso, 5.6, 0.1, 1.25, 0.65, 34), link: 'creative' },
    { id: 'frames', label: 'My sketches on the wall', ...wallArea(iso, 'y', 0.5, 3.7, 44, 70), link: 'creative' },
  ],
  draw: drawArt,
};
