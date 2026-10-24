// Renders one of Mini Kunjal's scenes to a PNG without a browser — used for
// the link-preview image, and handy for checking the art. The scene is the
// one the activity happens in (home, dance, walk or art room).
//
//   node tools/render_house.mjs out.png [hour] [activity] [scale]
import { writeFileSync } from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { W, H, SCENES } from '../src/scene/scenes.js';
import { drawKunjal, drawSleeping } from '../src/scene/kunjal.js';
import { ACTIVITIES } from '../src/scene/routine.js';

const [out = 'house.png', hourArg = '11', act = 'code', scaleArg = '2'] = process.argv.slice(2);
const scale = Number(scaleArg);
const canvas = createCanvas(Math.round(W * scale), Math.round(H * scale));
const ctx = canvas.getContext('2d');
ctx.scale(scale, scale);

const a = ACTIVITIES[act];
const t = 2.3;
SCENES[a.scene].draw(ctx, {
  hour: Number(hourArg),
  t,
  act,
  paintProgress: 0.95,
  actor: {
    ...a.spot,
    gy: a.runway ? 2.6 : a.spot.gy,
    z: a.seat ?? 0,
    sleeping: a.pose === 'sleep',
    draw: (c, x, y, sc) => drawKunjal(c, x, y, a.pose, 1, 1, t, sc),
    drawSleeping: (c, x, y, sc) => drawSleeping(c, x, y, t, sc),
  },
});
writeFileSync(out, canvas.toBuffer('image/png'));
console.log(`${out} written (${canvas.width}×${canvas.height}, ${hourArg}:00, ${act} in ${a.scene})`);
