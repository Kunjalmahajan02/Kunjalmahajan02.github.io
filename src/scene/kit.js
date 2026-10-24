// The isometric drawing kit every scene is built from: a projection, flat
// shapes, furniture boxes, and the cosy details (plants, lamps, fairy lights,
// framed florals, windows onto the city, the garden around the house).
//
// Floor positions are grid units (gx to the right-down, gy to the left-down).
// Heights (z) are in "base units" and grow with the scene's zoom, so the same
// lamp is the same size in every room.

import { heartPath } from './kunjal.js';

export const W = 640;
export const H = 400;

export function makeIso({ T, ox, oy }) {
  const zf = T / 24;
  const P = (gx, gy, z = 0) => [ox + (gx - gy) * T, oy + ((gx + gy) * T) / 2 - z * zf];
  const toGrid = (sx, sy) => {
    const a = (sx - ox) / T;
    const b = (sy - oy) / (T / 2);
    return { gx: (a + b) / 2, gy: (b - a) / 2 };
  };
  return { T, zf, P, toGrid };
}

export const C = {
  cream: '#efe3d2',
  white: '#efe3d2',
  pink: '#d48b98',
  hot: '#b9566f',
  blush: '#e8c7bf',
  rose: '#c7878f',
  lilac: '#a99bc4',
  mint: '#93b99c',
  sage: '#9cc9a8',
  peach: '#e3b48f',
  gold: '#d6a54e',
  leaf: '#6fbf8e',
  leafLo: '#4f9f74',
  leafDk: '#3b7f5c',
  wood: '#d9a77c',
  woodLo: '#b98560',
  woodDk: '#8e6043',
  oak: '#c58a58',
};

export function shade(hex, k) {
  const h = hex.length === 4 ? [...hex.slice(1)].map((d) => d + d).join('') : hex.slice(1);
  const n = parseInt(h, 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))));
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
}

export function skyFor(hour) {
  if (hour < 5.5 || hour >= 19.5) return { top: '#1d2150', bottom: '#3d3a7a', night: true };
  if (hour < 7) return { top: '#b9a5ec', bottom: '#ffc6d9', night: false, low: true };
  if (hour < 17) return { top: '#9fd3ff', bottom: '#ffe3f0', night: false };
  return { top: '#a98ae0', bottom: '#ffb3a3', night: false, low: true };
}

// Everything a scene draws with, bound to one canvas and one projection.
export function makeKit(ctx, iso) {
  const { P, T, zf } = iso;
  const k = {};

  k.poly = (c, pts) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
  };
  k.stroke = (c, w, pts) => {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  };
  k.dot = (c, [x, y], r) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  k.oval = (c, [x, y], rx, ry, rot = 0) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  };
  k.heart = (c, [x, y], s) => {
    ctx.fillStyle = c;
    heartPath(ctx, x, y, s);
    ctx.fill();
  };
  k.sparkle = (c, [x, y], s) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.quadraticCurveTo(x, y, x + s, y);
    ctx.quadraticCurveTo(x, y, x, y + s);
    ctx.quadraticCurveTo(x, y, x - s, y);
    ctx.quadraticCurveTo(x, y, x, y - s);
    ctx.fill();
  };
  k.glow = ([x, y], r, color = '255, 196, 128', a = 0.35) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${color}, ${a})`);
    g.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };

  // an isometric box: top, the face toward the viewer's left (+gy) and the
  // face toward the viewer's right (+gx)
  k.box = (x0, y0, w, d, h, color, z = 0, o = {}) => {
    const x1 = x0 + w;
    const y1 = y0 + d;
    k.poly(o.left ?? shade(color, -0.06), [P(x0, y1, z), P(x1, y1, z), P(x1, y1, z + h), P(x0, y1, z + h)]);
    k.poly(o.right ?? shade(color, -0.2), [P(x1, y0, z), P(x1, y1, z), P(x1, y1, z + h), P(x1, y0, z + h)]);
    k.poly(o.top ?? shade(color, 0.2), [P(x0, y0, z + h), P(x1, y0, z + h), P(x1, y1, z + h), P(x0, y1, z + h)]);
  };
  k.floorRect = (c, x0, y0, x1, y1, z = 0) => k.poly(c, [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]);
  k.floorOval = (c, gx, gy, r, z = 0, squash = 1) => k.oval(c, P(gx, gy, z), r * T * 1.414, r * T * 0.707 * squash);

  // a point / rectangle on a back wall: 'y' is the wall along gy = at,
  // 'x' is the wall along gx = at
  k.W = (wall, u, z, at = 0) => (wall === 'y' ? P(u, at, z) : P(at, u, z));
  k.onWall = (wall, c, a, b, z0, z1, at = 0) =>
    k.poly(c, [k.W(wall, a, z0, at), k.W(wall, b, z0, at), k.W(wall, b, z1, at), k.W(wall, a, z1, at)]);

  k.planks = (c, line, x0, y0, x1, y1, step = 0.45) => {
    k.floorRect(c, x0, y0, x1, y1);
    for (let u = y0 + step; u < y1; u += step) k.stroke(line, 0.7, [P(x0, u), P(x1, u)]);
    for (let u = y0, i = 0; u < y1; u += step, i++)
      for (let a = x0 + ((i * 0.83) % 1.6) + 0.4; a < x1; a += 1.6)
        k.stroke(line, 0.6, [P(a, u), P(a, Math.min(y1, u + step))]);
  };
  k.checker = (a, b, x0, y0, x1, y1, step = 0.5) => {
    k.floorRect(a, x0, y0, x1, y1);
    for (let u = x0; u < x1 - 0.01; u += step)
      for (let v = y0; v < y1 - 0.01; v += step)
        if ((Math.round((u - x0) / step) + Math.round((v - y0) / step)) % 2)
          k.floorRect(b, u, v, Math.min(u + step, x1), Math.min(v + step, y1));
  };

  // patterned rugs
  k.rugRect = (x0, y0, x1, y1, base, border, motif) => {
    k.floorRect(border, x0, y0, x1, y1, 0.3);
    k.floorRect(base, x0 + 0.15, y0 + 0.15, x1 - 0.15, y1 - 0.15, 0.3);
    for (let a = x0 + 0.45; a < x1 - 0.3; a += 0.5)
      for (let b = y0 + 0.45; b < y1 - 0.3; b += 0.5) {
        const p = P(a, b, 0.3);
        if (motif === 'flowers') {
          for (let i = 0; i < 5; i++)
            k.dot(border, [p[0] + Math.cos(i * 1.26) * 2.2, p[1] + Math.sin(i * 1.26) * 1.1], 1.1);
          k.dot('#fff6e0', p, 0.9);
        } else k.dot(border, p, 0.9);
      }
  };
  k.rugRound = (gx, gy, r, base, ring) => {
    k.floorOval(ring, gx, gy, r, 0.3);
    k.floorOval(base, gx, gy, r * 0.82, 0.3);
    k.floorOval(ring, gx, gy, r * 0.45, 0.3);
    k.floorOval(base, gx, gy, r * 0.32, 0.3);
  };
  k.fluffyRug = (gx, gy, r, c) => {
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      k.floorOval(c, gx + Math.cos(a) * r * 0.55, gy + Math.sin(a) * r * 0.55, r * 0.5, 0.3);
    }
    k.floorOval(c, gx, gy, r * 0.75, 0.3);
  };

  // plants: 'leafy' (big leaves), 'palm', 'flowers'
  k.plant = (gx, gy, s = 1, z = 0, kind = 'leafy', pot = '#c4805f') => {
    k.box(gx - 0.2 * s, gy - 0.2 * s, 0.4 * s, 0.4 * s, 11 * s, pot, z, { top: '#6b4a3a' });
    const [x, y] = P(gx, gy, z + 11 * s);
    const sz = s * zf;
    if (kind === 'flowers') {
      for (let i = 0; i < 7; i++) {
        const a = i * 0.9;
        k.oval(C.leafLo, [x + Math.cos(a) * 5 * sz, y - 4 * sz + Math.sin(a) * 2 * sz], 3 * sz, 1.6 * sz, a);
      }
      const cols = [C.hot, C.pink, '#fff3c4', C.rose];
      for (let i = 0; i < 6; i++)
        k.dot(cols[i % 4], [x + Math.cos(i * 1.1) * 4 * sz, y - 7 * sz + Math.sin(i * 1.7) * 2.6 * sz], 1.9 * sz);
      return;
    }
    const leaves =
      kind === 'palm'
        ? [
            [-9, -10, -1],
            [9, -11, 1],
            [-5, -17, -0.5],
            [5, -18, 0.5],
            [0, -20, 0],
            [-11, -5, -1.3],
            [11, -6, 1.3],
          ]
        : [
            [-7, -6, -0.6],
            [7, -7, 0.6],
            [-3, -13, -0.2],
            [4, -15, 0.25],
            [0, -9, 0],
            [-8, -12, -0.9],
            [8, -12, 0.9],
          ];
    for (const [lx, ly, rot] of leaves) {
      k.oval(ly < -10 ? C.leaf : C.leafLo, [x + lx * sz, y + ly * sz], (kind === 'palm' ? 2.4 : 3.2) * sz, 7 * sz, rot);
      k.stroke(C.leafDk, 0.4 * sz, [
        [x + lx * sz * 0.3, y + ly * sz * 0.3],
        [x + lx * sz, y + ly * sz],
      ]);
    }
  };
  // a trailing plant hanging on a wall
  k.hangingPlant = (wall, u, z, at = 0) => {
    const p = k.W(wall, u, z, at);
    k.stroke('#c9a98f', 0.6, [[p[0], p[1] - 10 * zf], p]);
    k.oval('#c4805f', [p[0], p[1] + 2 * zf], 4 * zf, 3 * zf);
    for (let i = 0; i < 9; i++) {
      const side = i % 2 ? 1 : -1;
      k.oval(
        i % 3 ? C.leafLo : C.leaf,
        [p[0] + side * (2 + (i % 3)) * zf, p[1] + (3 + i * 2) * zf],
        1.6 * zf,
        2.4 * zf,
        side * 0.5,
      );
    }
  };
  // ivy trailing along the top of a wall
  k.ivy = (wall, a, b, z, at = 0) => {
    for (let u = a; u < b; u += 0.18) {
      const p = k.W(wall, u, z - Math.sin(u * 3) * 3, at);
      k.oval(Math.round(u * 10) % 3 ? C.leafLo : C.leaf, p, 1.8 * zf, 1.2 * zf, 0.6);
      if (Math.round(u * 10) % 7 === 0) k.oval(C.leafLo, [p[0], p[1] + 4 * zf], 1.3 * zf, 2.4 * zf);
    }
  };

  // a lamp on a surface (or the floor); returns where its light comes from
  k.lamp = (gx, gy, z = 0, tall = false) => {
    const stem = tall ? 40 : 7;
    k.box(gx - 0.12, gy - 0.12, 0.24, 0.24, 2, C.gold, z);
    k.stroke('#c7a07a', 1 * zf, [P(gx, gy, z + 2), P(gx, gy, z + stem)]);
    const [x, y] = P(gx, gy, z + stem);
    ctx.fillStyle = '#ffe9c4';
    ctx.beginPath();
    ctx.moveTo(x - 4.5 * zf, y);
    ctx.lineTo(x + 4.5 * zf, y);
    ctx.lineTo(x + 3 * zf, y - 7 * zf);
    ctx.lineTo(x - 3 * zf, y - 7 * zf);
    ctx.closePath();
    ctx.fill();
    k.oval('#ffe0a8', [x, y], 4.5 * zf, 1.2 * zf);
    return [x, y - 3 * zf];
  };

  // a framed picture on a wall: 'floral', 'heart', 'portrait', 'sketch'
  k.frame = (wall, a, b, z0, z1, art = 'floral', at = 0, frame = C.gold) => {
    k.onWall(wall, frame, a, b, z0, z1, at);
    k.onWall(wall, '#efe2cf', a + 0.05, b - 0.05, z0 + 1.5, z1 - 1.5, at);
    const m = k.W(wall, (a + b) / 2, (z0 + z1) / 2, at);
    if (art === 'floral') {
      k.stroke(C.leafLo, 0.7 * zf, [
        [m[0], m[1] + 5 * zf],
        [m[0], m[1] - 2 * zf],
      ]);
      for (let i = 0; i < 5; i++)
        k.dot(
          i % 2 ? C.pink : C.hot,
          [m[0] + Math.cos(i * 1.3) * 2.6 * zf, m[1] - 2 * zf + Math.sin(i * 1.3) * 2.2 * zf],
          1.4 * zf,
        );
    } else if (art === 'heart') k.heart(C.hot, m, 6 * zf);
    else if (art === 'sketch') {
      k.oval('#7a6a7a', [m[0], m[1] - 1.5 * zf], 2.6 * zf, 3 * zf);
      k.oval('#9a8a9a', [m[0], m[1] + 4 * zf], 4 * zf, 2.4 * zf);
    }
  };

  // a window on a back wall with sky, the city, and pink curtains
  k.window = (wall, a, b, z0, z1, sky, t, at = 0, arch = false) => {
    const R = (u, z) => k.W(wall, u, z, at);
    const quad = (u0, u1, za, zb) => [R(u0, za), R(u1, za), R(u1, zb), R(u0, zb)];
    k.poly('#e3d1bc', quad(a - 0.12, b + 0.12, z0 - 4, z1 + 4));
    const g = ctx.createLinearGradient(0, R(a, z1)[1], 0, R(a, z0)[1]);
    g.addColorStop(0, sky.top);
    g.addColorStop(1, sky.bottom);
    k.poly(g, quad(a, b, z0, z1));
    if (sky.night) {
      for (let i = 0; i < 10; i++) {
        const u = a + ((i * 0.37) % 1) * (b - a);
        if ((Math.floor(t * 1.4) + i) % 4) k.dot('#fff6fb', R(u, z1 - 4 - ((i * 7) % 12)), 0.6);
      }
      k.dot('#fff1c9', R(b - 0.3, z1 - 7), 2.6 * zf);
    } else {
      k.dot(sky.low ? '#ffc29a' : '#fff4b8', R(b - 0.35, sky.low ? z0 + 16 : z1 - 8), 3 * zf);
      const cl = R(a + 0.25 + ((t * 0.04) % 1) * (b - a) * 0.5, z1 - 9);
      k.oval('rgba(255,255,255,0.85)', cl, 5.5 * zf, 2 * zf);
    }
    // the city at the bottom of the window
    for (let u = a, i = 0; u < b - 0.05; u += 0.2, i++) {
      const hgt = 6 + ((i * 7) % 13);
      k.poly(sky.night ? '#2a2c5e' : '#c9bbe9', quad(u, Math.min(b, u + 0.17), z0, z0 + hgt));
      if (sky.night)
        for (let j = 2; j < hgt - 1; j += 4) if ((i + j) % 3) k.dot('#ffd27a', R(u + 0.085, z0 + j), 0.55 * zf);
    }
    k.stroke('#e3d1bc', 1.3 * zf, [R((a + b) / 2, z0), R((a + b) / 2, z1)]);
    if (arch) k.stroke('#e3d1bc', 1.3 * zf, [R(a, z1 - 8), R(b, z1 - 8)]);
    else k.stroke('#e3d1bc', 1.3 * zf, [R(a, (z0 + z1) / 2), R(b, (z0 + z1) / 2)]);
    k.poly('#c6ad93', quad(a - 0.2, b + 0.2, z0 - 6, z0 - 3));
    // curtains, tied back
    const mid = (z0 + z1) / 2;
    k.poly(C.rose, [
      R(a - 0.34, z1 + 8),
      R(a + 0.06, z1 + 8),
      R(a - 0.06, mid),
      R(a - 0.16, z0 - 8),
      R(a - 0.42, z0 - 8),
    ]);
    k.poly(C.rose, [
      R(b + 0.34, z1 + 8),
      R(b - 0.06, z1 + 8),
      R(b + 0.06, mid),
      R(b + 0.16, z0 - 8),
      R(b + 0.42, z0 - 8),
    ]);
    k.stroke('#e78fb5', 0.8, [R(a - 0.2, z1 + 6), R(a - 0.24, z0 - 6)]);
    k.stroke('#e78fb5', 0.8, [R(b + 0.2, z1 + 6), R(b + 0.24, z0 - 6)]);
    k.poly('#e3d1bc', quad(a - 0.45, b + 0.45, z1 + 7, z1 + 9));
    return R((a + b) / 2, mid);
  };

  // string lights draped along the top of a wall; returns bulb positions
  k.fairyLights = (wall, a, b, z, t, at = 0) => {
    const pts = [];
    for (let i = 0; i <= 28; i++) {
      const f = i / 28;
      pts.push(k.W(wall, a + (b - a) * f, z - Math.sin(f * Math.PI * 4) ** 2 * 6, at));
    }
    k.stroke('#7e6556', 0.7, pts);
    const bulbs = [];
    pts.forEach((p, i) => {
      if (i % 2) return;
      const on = (Math.floor(t * 2) + i) % 9 !== 0;
      k.dot(on ? '#ffe39a' : '#e8d6c0', [p[0], p[1] + 2], 1.5 * zf);
      bulbs.push([p[0], p[1] + 2]);
    });
    return bulbs;
  };

  k.wallpaper = (wall, a, b, h, base, motif, mc, at = 0) => {
    k.onWall(wall, base, a, b, 0, h, at);
    if (motif === 'stripes') {
      for (let u = a + 0.12; u < b; u += 0.4) k.onWall(wall, mc, u, Math.min(b, u + 0.16), 0, h, at);
    } else if (motif) {
      for (let z = 30, row = 0; z < h - 10; z += 12, row++)
        for (let u = a + (row % 2 ? 0.42 : 0.18); u < b - 0.1; u += 0.5) {
          const p = k.W(wall, u, z, at);
          if (motif === 'hearts') k.heart(mc, p, 3 * zf);
          else if (motif === 'florals') {
            for (let i = 0; i < 4; i++)
              k.dot(mc, [p[0] + Math.cos(i * 1.57) * 1.4 * zf, p[1] + Math.sin(i * 1.57) * 1.4 * zf], 0.9 * zf);
          } else if (motif === 'dots') k.dot(mc, p, 0.9 * zf);
          else if (motif === 'stars') k.sparkle(mc, p, 2 * zf);
        }
    }
    // wainscoting below, crown moulding above
    k.onWall(wall, shade(base, -0.05), a, b, 0, 24, at);
    for (let u = a + 0.3; u < b - 0.1; u += 0.6) k.onWall(wall, shade(base, -0.1), u, u + 0.4, 5, 20, at);
    k.onWall(wall, '#e6d5bf', a, b, 24, 26, at);
    k.onWall(wall, '#e6d5bf', a, b, 0, 3, at);
    k.onWall(wall, '#e6d5bf', a, b, h - 4, h, at);
  };

  // the garden ring around a house: grass, bushes with flowers, fairy lights
  k.garden = (x0, y0, x1, y1, m, night, t, skip = () => false) => {
    const grass = night ? '#24402f' : '#7fae78';
    k.poly(shade(grass, -0.25), [P(x0 - m, y1 + m), P(x1 + m, y1 + m), P(x1 + m, y1 + m, -14), P(x0 - m, y1 + m, -14)]);
    k.poly(shade(grass, -0.4), [P(x1 + m, y0 - m), P(x1 + m, y1 + m), P(x1 + m, y1 + m, -14), P(x1 + m, y0 - m, -14)]);
    k.floorRect(grass, x0 - m, y0 - m, x1 + m, y1 + m);
    const bush = (gx, gy, i) => {
      if (skip(gx, gy)) return;
      const p = P(gx, gy);
      const s = zf * (0.8 + (i % 3) * 0.2);
      const leaf = night ? ['#2f5a40', '#3d6f50'] : ['#4f8a5c', '#67a272'];
      k.oval(leaf[0], [p[0], p[1] - 5 * s], 9 * s, 6 * s);
      k.oval(leaf[1], [p[0] - 3 * s, p[1] - 8 * s], 6 * s, 4.5 * s);
      const fl = [C.hot, '#ffb3d1', '#e6d8c5', C.lilac];
      for (let j = 0; j < 4; j++)
        k.dot(fl[(i + j) % 4], [p[0] + ((j * 5) % 11) - 5, p[1] - 6 * s - ((j * 3) % 5)], 1.3 * s);
      if (night && (Math.floor(t * 1.5) + i) % 3) k.dot('#ffe39a', [p[0] + 4 * s, p[1] - 9 * s], 1.1 * s);
    };
    let i = 0;
    for (let u = x0 - m + 0.4; u < x1 + m; u += 0.75) bush(u, y1 + m - 0.45, i++);
    for (let v = y0 - m + 0.4; v < y1 + m - 0.5; v += 0.75) bush(x1 + m - 0.45, v, i++);
  };

  return k;
}

// the sky / night city behind every scene
export function drawBackdrop(ctx, sky, t) {
  const night = sky.night;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, night ? '#151a3d' : '#f3d9c3');
  g.addColorStop(1, night ? '#2a2552' : '#d9b9a8');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // distant buildings along the top
  for (let i = 0, x = -10; x < W; i++) {
    const w = 26 + ((i * 17) % 30);
    const h = 30 + ((i * 29) % 46);
    ctx.fillStyle = night ? '#1f2350' : 'rgba(150, 110, 110, 0.3)';
    ctx.fillRect(x, 70 - h, w, h + 40);
    if (night) {
      for (let wy = 74 - h; wy < 100; wy += 7)
        for (let wx = x + 4; wx < x + w - 4; wx += 6)
          if ((wx * 7 + wy * 3 + i) % 5 === 0) {
            ctx.fillStyle = (Math.floor(t * 0.3) + wx) % 11 ? '#ffcf7a' : '#ffe9b0';
            ctx.fillRect(wx, wy, 2.5, 3);
          }
    }
    x += w + 6;
  }
  if (night) {
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,246,251,${(Math.floor(t * 1.2) + i) % 5 ? 0.75 : 0.2})`;
      ctx.beginPath();
      ctx.arc((i * 151) % W, (i * 37) % 60, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      const x = ((i * 140 + t * 4) % (W + 80)) - 40;
      ctx.beginPath();
      ctx.ellipse(x, 20 + (i % 3) * 12, 18, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 10, 17 + (i % 3) * 12, 11, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// night: dim everything, then let the lamps and fairy lights glow warm
export function nightLights(ctx, k, sky, lights) {
  if (!sky.night) return;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(110, 90, 160, 0.5)';
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const [p, r = 46, color, a = 0.26] of lights) k.glow(p, r, color, a);
  ctx.restore();
}

// shared helpers for a scene's rooms and doors
export function bboxOf(pts) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

export function boxArea(iso, x0, y0, w, d, h, z = 0) {
  const { P } = iso;
  return bboxOf([
    P(x0, y0, z),
    P(x0 + w, y0, z),
    P(x0 + w, y0 + d, z),
    P(x0, y0 + d, z),
    P(x0, y0, z + h),
    P(x0 + w, y0, z + h),
    P(x0 + w, y0 + d, z + h),
    P(x0, y0 + d, z + h),
  ]);
}

export function wallArea(iso, wall, a, b, z0, z1, at = 0) {
  const R = (u, z) => (wall === 'y' ? iso.P(u, at, z) : iso.P(at, u, z));
  return bboxOf([R(a, z0), R(b, z0), R(b, z1), R(a, z1)]);
}

// low walls (front walls, partitions) as unit pieces so they depth-sort;
// `gaps` are door openings: centre positions along the run
export function wallPieces(axis, fixed, a, b, gaps = [], gap = 0.6, th = 0.16) {
  let segs = [[a, b]];
  for (const c of gaps)
    segs = segs.flatMap(([s, e]) =>
      c > s && c < e
        ? [
            [s, c - gap],
            [c + gap, e],
          ]
        : [[s, e]],
    );
  const pieces = [];
  for (const [s, e] of segs)
    for (let u = s; u < e - 0.001; u += 1) {
      const v = Math.min(e, u + 1);
      pieces.push(
        axis === 'x' ? { x0: fixed - th / 2, y0: u, w: th, d: v - u } : { x0: u, y0: fixed - th / 2, w: v - u, d: th },
      );
    }
  return pieces;
}
