// Every place Mini Kunjal can be, plus how she gets around inside one:
// rooms are rectangles on the floor, doors join them, and she walks from
// room to room through the doors.

import { home } from './home.js';
import { dance, walk, art } from './rooms.js';

export { W, H } from './kit.js';

export const SCENES = { home, dance, walk, art };
export const SCENE_ORDER = ['home', 'dance', 'walk', 'art'];

export function roomAt(scene, gx, gy) {
  return scene.rooms.find((r) => gx >= r.x0 && gx <= r.x1 && gy >= r.y0 && gy <= r.y1) ?? null;
}

// keep a click target inside its room, away from the walls
export function clampToRoom(scene, gx, gy) {
  const r = roomAt(scene, gx, gy);
  if (!r) return null;
  const m = 0.45;
  return { gx: Math.min(Math.max(gx, r.x0 + m), r.x1 - m), gy: Math.min(Math.max(gy, r.y0 + m), r.y1 - m) };
}

// the waypoints from one spot to another, through the doorways
export function route(scene, from, to) {
  const start = roomAt(scene, from.gx, from.gy)?.id;
  const goal = roomAt(scene, to.gx, to.gy)?.id;
  if (!start || !goal || start === goal) return [{ ...to }];
  const prev = { [start]: null };
  const queue = [start];
  while (queue.length) {
    const r = queue.shift();
    if (r === goal) break;
    for (const d of scene.doors) {
      const n = d.a === r ? d.b : d.b === r ? d.a : null;
      if (n && !(n in prev)) {
        prev[n] = { r, d };
        queue.push(n);
      }
    }
  }
  const steps = [];
  for (let r = goal; prev[r]; r = prev[r].r) steps.unshift(prev[r].d);
  return [...steps.map((d) => ({ gx: d.gx, gy: d.gy })), { ...to }];
}
