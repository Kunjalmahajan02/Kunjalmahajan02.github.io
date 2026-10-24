// Home: Mini Kunjal's apartment as an isometric floor map — bedroom, living
// room, a coding corner and the entrance — with a fairy-lit garden around it.
// The dance room, walk room and art room are separate scenes (rooms.js); she
// leaves through the front door to get to them.
//
//   bedroom  x 0–5.5  y 0–4.2     living room  x 5.5–10  y 0–4.2
//   coding   x 0–4.6  y 4.2–8     entrance     x 4.6–10  y 4.2–8

import { C, makeIso, makeKit, shade, skyFor, drawBackdrop, nightLights, boxArea, wallArea, wallPieces } from './kit.js';

const iso = makeIso({ T: 27, ox: 293, oy: 116 });
const { P } = iso;
const WALL = 84;
const MID = 24; // partitions, cut down so every room shows
const LOW = 18; // front walls

const rooms = [
  { id: 'bedroom', label: 'Bedroom', x0: 0, x1: 5.5, y0: 0, y1: 4.2 },
  { id: 'living', label: 'Living room', x0: 5.5, x1: 10, y0: 0, y1: 4.2 },
  { id: 'coding', label: 'Coding corner', x0: 0, x1: 4.6, y0: 4.2, y1: 8 },
  { id: 'entrance', label: 'Entrance', x0: 4.6, x1: 10, y0: 4.2, y1: 8 },
];
const doors = [
  { a: 'bedroom', b: 'living', gx: 5.5, gy: 2.9 },
  { a: 'bedroom', b: 'coding', gx: 3.4, gy: 4.2 },
  { a: 'living', b: 'entrance', gx: 7.0, gy: 4.2 },
  { a: 'coding', b: 'entrance', gx: 4.6, gy: 6.4 },
];
const FRONT_DOOR = 7.6; // along the y = 8 front wall

const objects = [
  { id: 'bed', label: 'Bed — sleep', ...boxArea(iso, 0.1, 0.55, 2.7, 2.1, 34), activity: 'sleep' },
  { id: 'window', label: 'Bedroom window', ...wallArea(iso, 'y', 1.6, 3.0, 34, 66), secret: 'sky' },
  { id: 'sofa', label: 'Sofa — chill', ...boxArea(iso, 6.2, 0.2, 2.6, 1.05, 30), activity: 'chill' },
  {
    id: 'laptop',
    label: 'Desk & laptop — my projects',
    ...boxArea(iso, 1.5, 5.2, 0.9, 2.0, 36),
    activity: 'code',
    link: 'projects',
  },
  { id: 'board', label: 'Pinboard — résumé', ...wallArea(iso, 'x', 5.3, 6.5, 42, 66), resume: true },
  {
    id: 'shelf',
    label: 'Bookshelf — research',
    ...boxArea(iso, 0.05, 7.0, 0.55, 0.9, 62),
    activity: 'read',
    link: 'research',
  },
  { id: 'mailbox', label: 'Mailbox — contact', ...boxArea(iso, 9.4, 8.65, 0.5, 0.5, 36), link: 'contact' },
  { id: 'bunny', label: 'Bunny plush', ...boxArea(iso, 1.95, 0.75, 0.5, 0.5, 34), secret: 'bunny' },
  { id: 'cat', label: 'Mochi the cat', ...boxArea(iso, 8.4, 2.9, 0.8, 0.6, 18), secret: 'cat' },
];

const walls = [
  ...wallPieces('x', 5.5, 0, 4.2, [2.9]).map((p) => ({ ...p, h: MID })),
  ...wallPieces('y', 4.2, 0, 10, [3.4, 7.0]).map((p) => ({ ...p, h: MID })),
  ...wallPieces('x', 4.6, 4.2, 8, [6.4]).map((p) => ({ ...p, h: MID })),
  ...wallPieces('x', 10, 0, 8, [], 0.6, 0.22).map((p) => ({ ...p, h: LOW, front: true })),
  ...wallPieces('y', 8, 0, 10, [FRONT_DOOR], 0.55, 0.22).map((p) => ({ ...p, h: LOW, front: true })),
];

function draw(ctx, s) {
  const { hour, t, act } = s;
  const k = makeKit(ctx, iso);
  const sky = skyFor(hour);
  const night = sky.night;
  const lights = [];

  drawBackdrop(ctx, sky, t);
  k.garden(0, 0, 10, 8, 1.3, night, t, (gx, gy) => (gx > 6.8 && gx < 8.4) || (gx > 9.0 && gx < 10.3 && gy > 8));
  // stepping stones from the front door, and the mailbox
  for (let i = 0; i < 3; i++)
    k.floorOval(night ? '#7d7a8e' : '#b9ab9a', FRONT_DOOR + (i % 2) * 0.12, 8.45 + i * 0.4, 0.17);
  k.rugRect(FRONT_DOOR - 0.45, 8.05, FRONT_DOOR + 0.45, 8.4, C.rose, C.hot, 'dots');

  // ---- floors
  k.planks(C.oak, '#a56d3e', 0, 0, 5.5, 4.2);
  k.planks('#bf8656', '#a06a3e', 5.5, 0, 10, 4.2);
  k.planks('#c48f5f', '#a5714a', 0, 4.2, 4.6, 8);
  k.checker('#e7dac2', '#c4b093', 4.6, 4.2, 10, 8, 0.45);

  // rugs
  k.fluffyRug(2.0, 3.3, 0.9, '#d9a5a3');
  k.fluffyRug(3.4, 3.4, 0.45, '#e6d8c5');
  k.rugRect(6.1, 1.5, 9.1, 3.7, '#e3c7b8', '#a9646f', 'flowers');
  k.rugRect(0.7, 5.0, 3.6, 7.6, '#cfc5b4', '#7f7192', 'dots');
  k.fluffyRug(6.4, 6.2, 0.6, '#e6d8c5');

  // ---- back walls
  k.wallpaper('y', 0, 5.5, WALL, '#ddb3a8', 'florals', '#cc9b90');
  k.wallpaper('y', 5.5, 10, WALL, '#e3cbb0', 'dots', '#d1b394');
  k.wallpaper('x', 0, 4.2, WALL, '#ddb3a8', 'florals', '#cc9b90');
  k.wallpaper('x', 4.2, 8, WALL, '#c3cdb6', 'stripes', '#b7c2aa');
  // wall tops + cut ends
  k.poly('#d6c2ad', [
    P(0, 0, WALL),
    P(10, 0, WALL),
    P(10, -0.3, WALL),
    P(-0.3, -0.3, WALL),
    P(-0.3, 8, WALL),
    P(0, 8, WALL),
  ]);
  k.poly('#b9a189', [P(10, -0.3, 0), P(10, 0, 0), P(10, 0, WALL), P(10, -0.3, WALL)]);
  k.poly('#c9b29b', [P(-0.3, 8, 0), P(0, 8, 0), P(0, 8, WALL), P(-0.3, 8, WALL)]);
  for (const [w, u] of [
    ['y', 5.5],
    ['x', 4.2],
  ])
    k.stroke('#bea48f', 1.2, [k.W(w, u, 0), k.W(w, u, WALL)]);

  // bedroom walls: window, tufted headboard, florals, vanity mirror, lights
  k.window('y', 1.6, 3.0, 34, 66, sky, t);
  k.ivy('y', 0.1, 5.4, WALL - 6);
  k.fairyLights('y', 0.2, 5.3, WALL - 10, t).forEach(
    (p, i) => i % 4 === 0 && lights.push([p, 20, '255, 214, 150', 0.22]),
  );
  k.frame('x', 2.95, 3.45, 46, 58, 'floral');
  k.frame('x', 3.6, 4.0, 50, 60, 'heart', 0, C.rose);
  k.frame('y', 0.3, 0.8, 50, 62, 'floral');
  // vanity mirror with bulbs above the vanity table
  {
    const m = P(4.2, 0, 52);
    k.oval(C.gold, m, 11 * iso.zf, 14 * iso.zf);
    k.oval('#dbe6ee', m, 9 * iso.zf, 12 * iso.zf);
    k.stroke('rgba(255,255,255,0.9)', 1.4, [
      [m[0] - 3, m[1] - 5],
      [m[0] + 2, m[1] - 10],
    ]);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      k.dot('#ffe2a4', [m[0] + Math.cos(a) * 11 * iso.zf, m[1] + Math.sin(a) * 14 * iso.zf], 1.3 * iso.zf);
    }
    lights.push([m, 30, '255, 225, 170', 0.3]);
  }
  // living room: two arched windows, hanging plants, lights
  k.window('y', 6.5, 7.7, 34, 70, sky, t, 0, true);
  k.window('y', 8.3, 9.5, 34, 70, sky, t, 0, true);
  k.hangingPlant('y', 8.0, 74);
  k.hangingPlant('y', 6.0, 70);
  k.fairyLights('y', 5.7, 9.8, WALL - 6, t).forEach(
    (p, i) => i % 4 === 0 && lights.push([p, 20, '255, 214, 150', 0.2]),
  );
  // coding corner: résumé pinboard, frames, shelf
  k.onWall('x', '#c99a6e', 5.3, 6.5, 42, 66);
  k.onWall('x', '#e7bf95', 5.36, 6.44, 44, 64);
  k.onWall('x', C.white, 5.45, 5.95, 47, 62);
  for (let z = 50; z < 61; z += 3) k.stroke('#b6a2e6', 0.6, [P(0, 5.52, z), P(0, 5.88, z)]);
  k.onWall('x', C.blush, 6.0, 6.35, 52, 62);
  k.onWall('x', C.mint, 6.05, 6.35, 45, 50);
  k.heart(C.hot, P(0, 5.7, 63), 4.5);
  k.frame('x', 4.5, 5.0, 46, 58, 'sketch', 0, C.lilac);
  k.frame('x', 6.8, 7.3, 50, 62, 'floral');
  k.ivy('x', 4.3, 7.9, WALL - 6);
  k.fairyLights('x', 4.4, 7.8, WALL - 10, t).forEach(
    (p, i) => i % 4 === 0 && lights.push([p, 20, '255, 214, 150', 0.2]),
  );

  // ---- everything standing on the floor, back to front
  const items = [];
  const add = (key, fn) => items.push({ key, fn });

  for (const w of walls)
    add(w.x0 + w.w / 2 + w.y0 + w.d / 2 + (w.front ? 0.3 : 0), () => {
      const base = w.front ? '#d3bea8' : '#ddc9b4';
      k.box(w.x0, w.y0, w.w, w.d, w.h, base, 0, {
        top: '#eee1cf',
        left: shade(base, -0.03),
        right: shade(base, -0.12),
      });
      if (w.front) {
        // little window panes along the front walls
        const along = w.w > w.d;
        const u0 = along ? w.x0 : w.y0;
        const len = along ? w.w : w.d;
        for (let u = u0 + 0.15; u < u0 + len - 0.1; u += 0.45) {
          const q = along
            ? [P(u, w.y0 + w.d, 4), P(u + 0.3, w.y0 + w.d, 4), P(u + 0.3, w.y0 + w.d, 14), P(u, w.y0 + w.d, 14)]
            : [P(w.x0 + w.w, u, 4), P(w.x0 + w.w, u + 0.3, 4), P(w.x0 + w.w, u + 0.3, 14), P(w.x0 + w.w, u, 14)];
          k.poly(night ? '#3e3d73' : '#9db0bf', q);
        }
      } else {
        const along = w.w > w.d;
        k.poly(
          C.rose,
          along
            ? [
                P(w.x0, w.y0 + w.d, w.h - 3),
                P(w.x0 + w.w, w.y0 + w.d, w.h - 3),
                P(w.x0 + w.w, w.y0 + w.d, w.h - 1.5),
                P(w.x0, w.y0 + w.d, w.h - 1.5),
              ]
            : [
                P(w.x0 + w.w, w.y0, w.h - 3),
                P(w.x0 + w.w, w.y0 + w.d, w.h - 3),
                P(w.x0 + w.w, w.y0 + w.d, w.h - 1.5),
                P(w.x0 + w.w, w.y0, w.h - 1.5),
              ],
        );
      }
    });

  // the front door, standing open, with a heart wreath
  add(FRONT_DOOR + 8 + 0.35, () => {
    const d0 = FRONT_DOOR - 0.55;
    const d1 = FRONT_DOOR + 0.55;
    k.box(d0 - 0.12, 7.89, 0.12, 0.22, 62, '#d3bea8');
    k.box(d1, 7.89, 0.12, 0.22, 62, '#d3bea8');
    k.box(d0 - 0.12, 7.89, d1 - d0 + 0.24, 0.22, 6, '#d3bea8', 56);
    // the open door leaf swung inward
    k.poly('#a8676f', [P(d1, 7.95, 0), P(d1 - 0.05, 7.1, 0), P(d1 - 0.05, 7.1, 55), P(d1, 7.95, 55)]);
    k.poly('#8e555d', [P(d1 - 0.05, 7.1, 0), P(d1 - 0.12, 7.1, 0), P(d1 - 0.12, 7.1, 55), P(d1 - 0.05, 7.1, 55)]);
    k.dot(C.gold, P(d1 - 0.05, 7.25, 28), 1.4);
    const wr = P(d1 - 0.04, 7.55, 44);
    ctx.strokeStyle = C.leafLo;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(wr[0], wr[1], 4.6, 5.2, -0.5, 0, Math.PI * 2);
    ctx.stroke();
    k.dot(C.hot, [wr[0] - 2, wr[1] - 4], 1.2);
    k.dot(C.pink, [wr[0] + 3, wr[1] + 2], 1.2);
    lights.push([P(FRONT_DOOR, 8, 50), 26, '255, 214, 150', 0.25]);
  });

  // BEDROOM ---------------------------------------------------------------
  add(3.6, () => {
    // nightstands with lamps
    k.box(0.08, 0.08, 0.5, 0.45, 15, '#a26d48', 0, { top: '#b98257' });
    k.dot(C.gold, P(0.33, 0.53, 9), 0.9);
    lights.push([k.lamp(0.33, 0.3, 15), 34]);
    k.box(0.08, 2.75, 0.5, 0.45, 15, '#a26d48', 0, { top: '#b98257' });
    k.plant(0.33, 2.98, 0.55, 15, 'flowers', '#fff');
  });
  add(4.4, () => {
    // tufted headboard against the left wall, bed, pillows, floral quilt
    k.box(0.02, 0.55, 0.16, 2.1, 40, '#ad6a76', 0, { top: '#bd7f89', left: '#a1606b', right: '#b87983' });
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) k.dot('#8e5560', P(0.18, 0.75 + i * 0.32, 20 + j * 7), 0.8);
    k.box(0.18, 0.55, 2.6, 2.1, 10, '#9c6a46', 0, { top: '#eee1cf', left: '#8d5f3e', right: '#7d5236' });
    k.box(0.2, 0.6, 2.55, 2.0, 7, '#eee1cf', 10, { top: '#f0e5d5' });
    k.box(0.3, 0.7, 0.5, 0.85, 5, '#efe3d3', 17, { top: '#eee1cf' });
    k.box(0.3, 1.65, 0.5, 0.85, 5, '#e2c3ba', 17, { top: '#e8d0c8' });
    k.box(0.85, 0.95, 0.35, 0.5, 4, C.leaf, 17, { top: '#86ad90' });
    // quilt with roses
    k.box(1.15, 0.55, 1.65, 2.12, 2.5, '#ece0cd', 15.5, { top: '#f2e7d6', left: '#ddcab4', right: '#d2bea6' });
    for (let a = 1.35; a < 2.75; a += 0.38)
      for (let b = 0.75; b < 2.6; b += 0.38) {
        const p = P(a, b, 18.2);
        k.dot('#b55f72', p, 1.7);
        k.dot('#d9a0a3', [p[0] - 0.6, p[1] - 0.5], 0.8);
        k.oval(C.leafLo, [p[0] + 2.4, p[1] + 0.6], 1.4, 0.7, 0.4);
      }
    k.box(2.55, 0.55, 0.25, 2.12, 2.6, '#cfa29d', 15.4);
    if (act === 'sleep' && s.actor?.sleeping) s.actor.drawSleeping(ctx, ...P(0.6, 1.62, 23), iso.zf * 1.2);
  });
  add(5.0, () => {
    // Bun-bun, the bunny plush (a secret)
    const [x, y] = P(2.2, 1.0, 18);
    const z = iso.zf;
    k.oval('#eee1cf', [x, y - 3 * z], 4.2 * z, 3.6 * z);
    k.oval('#eee1cf', [x, y - 8 * z], 3.4 * z, 3 * z);
    for (const sx of [-1.6, 1.6]) {
      k.oval('#eee1cf', [x + sx * z, y - 13 * z], 1.1 * z, 3.2 * z);
      k.oval(C.blush, [x + sx * z, y - 13 * z], 0.5 * z, 2 * z);
    }
    k.dot('#3a2830', [x - 1.2 * z, y - 8.4 * z], 0.5 * z);
    k.dot('#3a2830', [x + 1.2 * z, y - 8.4 * z], 0.5 * z);
    k.dot(C.pink, [x, y - 7.4 * z], 0.6 * z);
  });
  add(4.65, () => {
    // vanity table + stool, with perfume and flowers
    k.box(3.6, 0.1, 1.2, 0.5, 20, '#a26d48', 0, { top: '#eee1cf' });
    k.dot(C.gold, P(3.9, 0.6, 14), 0.9);
    k.dot(C.gold, P(4.5, 0.6, 14), 0.9);
    k.box(3.75, 0.25, 0.12, 0.12, 5, C.blush, 20);
    k.box(3.95, 0.25, 0.1, 0.1, 7, C.lilac, 20);
    k.plant(4.6, 0.3, 0.45, 20, 'flowers', '#fff');
  });
  add(5.5, () => {
    k.box(3.95, 0.9, 0.42, 0.42, 12, '#c48a91', 0, { top: '#ffd6e5' });
    k.plant(5.15, 0.45, 1.05, 0, 'leafy');
  });
  add(4.2, () => k.plant(0.35, 3.75, 1.1, 0, 'palm'));

  // LIVING ROOM -----------------------------------------------------------
  add(6.9, () => {
    // cream sofa with pink + green cushions (she sits in front of its back)
    k.box(6.2, 0.2, 2.6, 0.32, 30, '#c8b595', 0, { top: '#d8c6a6', left: '#bfac8c', right: '#ab987a' });
    k.box(6.2, 0.5, 2.6, 0.75, 12, '#c8b595', 0, { top: '#d4c1a2', left: '#bba888', right: '#a99678' });
    k.box(6.2, 0.45, 0.3, 0.82, 19, '#bba888', 0, { top: '#cfbd9d' });
    k.box(8.5, 0.45, 0.3, 0.82, 19, '#bba888', 0, { top: '#cfbd9d' });
    k.box(6.6, 0.55, 0.5, 0.15, 11, '#bf7f86', 12, { top: '#cc9095' });
    k.box(7.3, 0.55, 0.5, 0.15, 11, '#6f9a7b', 12, { top: '#86ad90' });
    k.box(8.0, 0.55, 0.45, 0.15, 10, '#dcc0b5', 12, { top: '#e4cdc4' });
  });
  add(5.9, () => k.plant(5.95, 0.4, 1.15, 0, 'palm'));
  add(9.9, () => {
    // tall floor lamp + sideboard
    lights.push([k.lamp(9.6, 0.4, 0, true), 50]);
  });
  add(10.4, () => {
    // round coffee table with flowers, candles and boba
    const c = P(7.6, 2.5, 13);
    k.box(7.55, 2.45, 0.1, 0.1, 13, C.woodLo);
    k.oval(C.woodDk, [c[0], c[1] + 2], 21, 9);
    k.oval(C.wood, c, 21, 9);
    k.oval('#e5b48a', [c[0], c[1] - 0.6], 18, 7.4);
    k.plant(7.6, 2.3, 0.5, 13, 'flowers', '#fff');
    for (const [dx, dy] of [
      [10, 1],
      [13, 3],
    ]) {
      k.oval('#f1e2c8', [c[0] + dx, c[1] + dy - 2], 1.6, 2.4);
      k.dot('#ffcf6a', [c[0] + dx, c[1] + dy - 5.4], 1);
      lights.push([[c[0] + dx, c[1] + dy - 5], 16, '255, 200, 120', 0.3]);
    }
    if (act !== 'chill') {
      k.oval('#e3c9bd', [c[0] - 12, c[1] - 3], 2.4, 4);
      k.stroke(C.hot, 0.9, [
        [c[0] - 12, c[1] - 6],
        [c[0] - 11, c[1] - 10],
      ]);
    }
  });
  add(11.8, () => {
    // pink armchair
    k.box(8.9, 2.0, 0.85, 0.9, 11, '#bf7f86', 0, { top: '#c98d92' });
    k.box(9.5, 2.0, 0.25, 0.9, 24, '#ad7179', 0, { top: '#bb8187' });
    k.box(8.9, 1.9, 0.85, 0.22, 18, '#ad7179', 0, { top: '#bb8187' });
    k.box(8.9, 2.78, 0.85, 0.22, 18, '#ad7179', 0, { top: '#bb8187' });
  });
  add(12.6, () => {
    // Mochi the cat, curled on the rug with a pink bow, tail flicking
    const [x, y] = P(8.8, 3.25, 0.3);
    const z = iso.zf;
    k.oval('rgba(120,60,100,0.15)', [x, y + 1], 9 * z, 2.4 * z);
    k.oval('#eee1cf', [x, y - 4 * z], 8 * z, 5 * z);
    k.oval('#eee1cf', [x + 6 * z, y - 8 * z], 4.2 * z, 3.8 * z);
    k.poly('#eee1cf', [
      [x + 3 * z, y - 10 * z],
      [x + 4 * z, y - 14 * z],
      [x + 6 * z, y - 11 * z],
    ]);
    k.poly('#eee1cf', [
      [x + 6.5 * z, y - 11 * z],
      [x + 9 * z, y - 14 * z],
      [x + 9.2 * z, y - 9.5 * z],
    ]);
    k.poly(C.blush, [
      [x + 3.8 * z, y - 11 * z],
      [x + 4.3 * z, y - 12.8 * z],
      [x + 5.3 * z, y - 11 * z],
    ]);
    k.stroke('#3a2830', 0.7, [
      [x + 4.5 * z, y - 8 * z],
      [x + 5.5 * z, y - 8 * z],
    ]);
    k.stroke('#3a2830', 0.7, [
      [x + 7 * z, y - 8 * z],
      [x + 8 * z, y - 8 * z],
    ]);
    k.dot(C.pink, [x + 6.4 * z, y - 6.6 * z], 0.6 * z);
    k.dot(C.hot, [x + 2.6 * z, y - 9 * z], 1.3 * z);
    k.dot(C.hot, [x + 1.2 * z, y - 9.6 * z], 1.3 * z);
    const sw = Math.sin(t * 3) * 3;
    k.stroke('#c9b49e', 2.4 * z, [
      [x - 7 * z, y - 3 * z],
      [x - 11 * z, y - 6 * z + sw],
      [x - 9 * z, y - 10 * z + sw],
    ]);
  });
  add(13.4, () => k.plant(9.6, 3.75, 1.1, 0, 'leafy'));
  add(9.2, () => {
    // pouf
    const p = P(5.95, 3.4, 0);
    k.oval('#c7b1a6', [p[0], p[1] - 4], 8, 5);
    k.oval('#ddcfbf', [p[0], p[1] - 7], 8, 3.6);
  });

  // CODING CORNER ---------------------------------------------------------
  add(7.0, () => {
    // pink desk chair (she sits in front of its back)
    k.box(0.75, 5.85, 0.6, 0.6, 12, C.pink, 0, { top: '#c48a91' });
    k.box(0.68, 5.85, 0.14, 0.6, 32, C.pink, 0, { top: '#c48a91', left: '#b67b83', right: '#9f6670' });
  });
  add(8.35, () => {
    // desk facing the room, laptop lid toward us (she's behind it)
    k.box(1.5, 5.2, 0.9, 2.0, 2, '#a26d48', 19, { top: '#eee1cf' });
    for (const [a, b] of [
      [1.55, 5.25],
      [2.3, 5.25],
      [1.55, 7.1],
      [2.3, 7.1],
    ])
      k.box(a, b, 0.07, 0.07, 19, C.gold);
    k.box(1.7, 5.75, 0.5, 0.9, 1.2, '#cfc6bf', 21);
    k.poly('#ddd3cb', [P(2.02, 5.8, 22), P(2.02, 6.6, 22), P(2.02, 6.6, 38), P(2.02, 5.8, 38)]);
    k.heart(C.hot, P(2.02, 6.2, 30), 6);
    k.sparkle(C.lilac, P(2.02, 5.95, 34), 2);
    if (act === 'code') lights.push([P(1.6, 6.2, 34), 26, '196, 180, 255', 0.45]);
    // desk lamp, boba, plant, books
    lights.push([k.lamp(1.75, 5.4, 21), 30]);
    k.box(1.9, 6.85, 0.2, 0.2, 8, '#e3c9bd', 21, { top: '#7a4d3a' });
    k.stroke(C.hot, 1, [P(2.0, 6.95, 29), P(2.05, 6.92, 34)]);
    k.plant(2.15, 5.45, 0.45, 21, 'leafy');
  });
  add(7.9, () => {
    // bookshelf (research)
    k.box(0.05, 7.0, 0.55, 0.9, 62, '#8e5f3e', 0, { top: '#a06c47', right: '#6f4930' });
    const books = [C.pink, C.lilac, C.mint, C.gold, C.rose, '#a594e0', C.peach, C.hot];
    for (let sh = 0; sh < 4; sh++) {
      const z = 4 + sh * 14.5;
      k.poly('#6f4930', [P(0.6, 7.0, z), P(0.6, 7.9, z), P(0.6, 7.9, z + 1.4), P(0.6, 7.0, z + 1.4)]);
      let u = 7.05;
      for (let b = 0; u < 7.84; b++) {
        const bw = 0.07 + ((b + sh) % 3) * 0.025;
        const bh = 8.5 + ((b * 3 + sh) % 4);
        k.poly(books[(b + sh * 3) % books.length], [
          P(0.6, u, z + 1.4),
          P(0.6, u + bw, z + 1.4),
          P(0.6, u + bw, z + 1.4 + bh),
          P(0.6, u, z + 1.4 + bh),
        ]);
        u += bw + 0.012;
      }
    }
    k.plant(0.32, 7.45, 0.5, 62, 'flowers', '#fff');
  });
  add(10.2, () => {
    // bean bag + plant
    const p = P(3.6, 6.8, 0);
    k.oval('#9a8db5', [p[0], p[1] - 6], 14, 9);
    k.oval('#afa3c7', [p[0] - 2, p[1] - 9], 9, 5);
    k.heart(C.pink, [p[0] + 6, p[1] - 5], 5);
  });
  add(8.2, () => k.plant(4.1, 4.6, 1, 0, 'leafy'));

  // ENTRANCE --------------------------------------------------------------
  add(9.6, () => {
    // console table with a round mirror and keys
    k.box(8.0, 4.38, 1.4, 0.45, 18, '#a26d48', 0, { top: '#b98257' });
    const m = P(8.7, 4.45, 34);
    k.oval(C.gold, m, 10, 11);
    k.oval('#dbe6ee', m, 8.5, 9.5);
    k.plant(9.2, 4.6, 0.5, 18, 'flowers', '#fff');
    k.box(8.2, 4.5, 0.25, 0.15, 3, C.lilac, 18);
  });
  add(10.9, () => {
    // shoe bench with sneakers + heels
    k.box(5.0, 6.9, 0.5, 0.95, 12, '#a26d48', 0, { top: '#b98257' });
    k.box(5.1, 7.0, 0.3, 0.2, 3, C.white, 12);
    k.box(5.1, 7.35, 0.3, 0.2, 3, C.hot, 12);
    k.box(5.1, 7.6, 0.3, 0.15, 3, '#2b1f33', 12);
  });
  add(13.4, () => {
    // coat stand with a tote bag
    k.stroke(C.woodLo, 1.6, [P(9.5, 4.7, 0), P(9.5, 4.7, 52)]);
    k.stroke(C.woodLo, 1.2, [P(9.3, 4.7, 48), P(9.7, 4.7, 48)]);
    k.poly('#2b1f33', [P(9.36, 4.7, 47), P(9.62, 4.7, 47), P(9.66, 4.7, 30), P(9.32, 4.7, 30)]);
    k.poly(C.pink, [P(9.62, 4.75, 44), P(9.75, 4.75, 44), P(9.8, 4.75, 32), P(9.6, 4.75, 32)]);
  });
  add(14.9, () => k.plant(9.55, 7.45, 1.05, 0, 'palm'));
  add(11.0, () => k.plant(5.05, 4.65, 0.9, 0, 'flowers'));

  // garden mailbox (contact)
  add(18.2, () => {
    k.box(9.6, 8.85, 0.1, 0.1, 24, C.white);
    k.box(9.4, 8.65, 0.5, 0.5, 12, C.pink, 24, { top: '#c48a91' });
    k.heart(C.white, P(9.65, 9.15, 30), 6);
    k.stroke(C.gold, 1.2, [P(9.9, 8.9, 32), P(9.9, 8.9, 42)]);
    k.poly(C.hot, [P(9.9, 8.9, 42), P(9.9, 8.65, 42), P(9.9, 8.65, 38), P(9.9, 8.9, 38)]);
    if (Math.floor(t) % 3 === 0) k.sparkle(C.gold, P(10.05, 8.7, 46), 3);
  });
  // lanterns by the door
  add(16.2, () => {
    for (const dx of [-0.9, 0.9]) {
      const p = P(FRONT_DOOR + dx, 8.35, 0);
      k.stroke('#4b3a4a', 1.2, [p, [p[0], p[1] - 14]]);
      k.box(FRONT_DOOR + dx - 0.08, 8.27, 0.16, 0.16, 6, '#ffe7b0', 14);
      lights.push([[p[0], p[1] - 17], 26, '255, 205, 130', 0.3]);
    }
  });

  // her
  if (s.actor && !s.actor.sleeping)
    add(s.actor.gx + s.actor.gy + (s.actor.z ? 0.6 : 0), () =>
      s.actor.draw(ctx, ...P(s.actor.gx, s.actor.gy, s.actor.z ?? 0), iso.zf * 1.18),
    );

  items.sort((a, b) => a.key - b.key).forEach((it) => it.fn());
  nightLights(ctx, k, sky, lights);
}

export const home = {
  id: 'home',
  label: 'Home',
  iso,
  rooms,
  doors,
  objects,
  exit: { gx: FRONT_DOOR, gy: 7.75 }, // just inside the front door
  draw,
};
