// Mini Kunjal, a small chibi version of Kunjal drawn from her portrait:
// long, voluminous chestnut waves with a side part, burgundy rectangular
// sunglasses worn low so her brown eyes peek over the top, a little dot on
// her forehead, gold studs, a black lace-trimmed cami under an off-shoulder
// black cardigan embroidered with pink stars and moons. Smooth vector shapes,
// rendered at screen resolution.
//
// She's posed by moving her arms and legs, so every activity gets its own
// animation from one consistent character. Origin (x, y) is the point between
// her feet on the floor; at scale 1 she's about 42 canvas units tall.

const HEAD = 1.45; // the head (and hair) is drawn bigger than life: chibi

export const PAL = {
  hair: '#5a3022',
  hairMid: '#774232',
  hairHi: '#a8644a',
  sheen: '#c9837c',
  skin: '#f4caae',
  skinLo: '#e3a98c',
  blush: '#f2a0a8',
  lips: '#de7a8c',
  brow: '#3a2019',
  eye: '#4a2a1e',
  frame: '#5c1a2a',
  lens: '#3b0f1c',
  lensHi: '#8a3a52',
  gold: '#e9c27a',
  top: '#211a22',
  topHi: '#3a2c38',
  lace: '#8a5a7e',
  stitch: '#f6a8c8',
  pants: '#1d1724',
  shoe: '#ffffff',
  sole: '#ffb2d2',
  mic: '#d9dbe6',
  book: '#c9b8f2',
  bookLo: '#9d89d9',
  brush: '#e9b07a',
  paint: '#ff7eb6',
  boba: '#ffd6e6',
  pearl: '#5b3a35',
  heart: '#ff7eb6',
};

function ellipse(ctx, c, x, y, rx, ry, rot = 0) {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fill();
}

function rrect(ctx, c, x, y, w, h, r) {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function line(ctx, c, w, x0, y0, x1, y1) {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function star(ctx, c, x, y, s) {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
  ctx.fill();
}

export function heartPath(ctx, x, y, s) {
  // a heart centred on (x, y), s ≈ its width
  const k = s / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + k * 0.85);
  ctx.bezierCurveTo(x - k * 1.2, y + k * 0.05, x - k * 0.8, y - k * 0.95, x, y - k * 0.35);
  ctx.bezierCurveTo(x + k * 0.8, y - k * 0.95, x + k * 1.2, y + k * 0.05, x, y + k * 0.85);
  ctx.closePath();
}

// a big wavy mass of hair: a column from top to bottom whose edges ripple
function hairMass(ctx, c, cx, top, bottom, half, t, phase = 0, sway = 0) {
  const n = 9;
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(cx - half * 0.7, top);
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const y = top + (bottom - top) * f;
    const w =
      half * (0.8 + Math.sin(f * Math.PI) * 0.35) + Math.sin(t * 2.2 + i * 1.3 + phase) * 0.5 + (f > 0.5 ? sway : 0);
    ctx.quadraticCurveTo(cx - w - 1.1, y - (bottom - top) / n / 2, cx - w, y);
  }
  ctx.quadraticCurveTo(cx, bottom + 2.5, cx + half * 0.9 + sway, bottom);
  for (let i = n; i >= 0; i--) {
    const f = i / n;
    const y = top + (bottom - top) * f;
    const w =
      half * (0.8 + Math.sin(f * Math.PI) * 0.35) +
      Math.sin(t * 2.2 + i * 1.3 + phase + 1) * 0.5 +
      (f > 0.5 ? sway : 0);
    ctx.quadraticCurveTo(cx + w + 1.1, y + (bottom - top) / n / 2, cx + w, y);
  }
  ctx.closePath();
  ctx.fill();
}

// ------------------------------------------------------------------ poses --
// Each pose gives hand positions relative to the shoulders (left, right),
// foot positions relative to the hips, a body bob, and extras.
// "L"/"R" are screen-left / screen-right before any mirroring.
const P = (o) => ({ bob: 0, sit: false, mouth: false, ...o });

export const POSES = {
  idle: [
    P({
      hands: [
        [-2, 9],
        [2, 9],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
    }),
    P({
      hands: [
        [-2, 9],
        [2, 9],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
      bob: 1,
    }),
  ],
  walk: [
    P({
      hands: [
        [-3, 8],
        [3, 9],
      ],
      feet: [
        [-3, 10],
        [2, 9],
      ],
    }),
    P({
      hands: [
        [-2, 9],
        [2, 9],
      ],
      feet: [
        [-1, 10],
        [1, 10],
      ],
      bob: -1,
    }),
    P({
      hands: [
        [-2, 9],
        [4, 8],
      ],
      feet: [
        [-2, 9],
        [3, 10],
      ],
    }),
    P({
      hands: [
        [-2, 9],
        [2, 9],
      ],
      feet: [
        [-1, 10],
        [1, 10],
      ],
      bob: -1,
    }),
  ],
  // strutting: one hand on the hip
  ramp: [
    P({
      hands: [
        [-3, 5],
        [3, 9],
      ],
      feet: [
        [-2, 10],
        [1, 9],
      ],
      hip: true,
    }),
    P({
      hands: [
        [-3, 5],
        [2, 9],
      ],
      feet: [
        [-1, 10],
        [1, 10],
      ],
      bob: -1,
      hip: true,
    }),
    P({
      hands: [
        [-3, 5],
        [4, 8],
      ],
      feet: [
        [-1, 9],
        [2, 10],
      ],
      hip: true,
    }),
    P({
      hands: [
        [-3, 5],
        [2, 9],
      ],
      feet: [
        [-1, 10],
        [1, 10],
      ],
      bob: -1,
      hip: true,
    }),
  ],
  pose: [
    P({
      hands: [
        [-3, 5],
        [5, -2],
      ],
      feet: [
        [-3, 10],
        [2, 10],
      ],
      hip: true,
    }),
  ],
  dance: [
    P({
      hands: [
        [-6, -6],
        [6, -6],
      ],
      feet: [
        [-4, 10],
        [4, 10],
      ],
      bob: -1,
    }),
    P({
      hands: [
        [-7, 1],
        [5, -7],
      ],
      feet: [
        [-3, 10],
        [3, 9],
      ],
    }),
    P({
      hands: [
        [-7, 2],
        [7, 2],
      ],
      feet: [
        [-4, 9],
        [4, 10],
      ],
      bob: 1,
    }),
    P({
      hands: [
        [-5, -7],
        [7, 1],
      ],
      feet: [
        [-2, 10],
        [4, 10],
      ],
    }),
    P({
      hands: [
        [-2, 4],
        [2, 4],
      ],
      feet: [
        [-4, 10],
        [4, 10],
      ],
      bob: 1,
    }),
    P({
      hands: [
        [-7, -4],
        [7, -4],
      ],
      feet: [
        [-1, 9],
        [1, 10],
      ],
      bob: -2,
    }),
  ],
  paint: [
    P({
      hands: [
        [-2, 9],
        [7, 1],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
      brush: true,
    }),
    P({
      hands: [
        [-2, 9],
        [8, -2],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
      brush: true,
    }),
    P({
      hands: [
        [-2, 9],
        [7, -1],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
      brush: true,
      bob: 1,
    }),
  ],
  sing: [
    P({
      hands: [
        [-6, 2],
        [1, -5],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
      mic: true,
      mouth: true,
    }),
    P({
      hands: [
        [-7, -3],
        [1, -5],
      ],
      feet: [
        [-2, 10],
        [3, 10],
      ],
      mic: true,
      bob: 1,
    }),
    P({
      hands: [
        [-6, 0],
        [1, -5],
      ],
      feet: [
        [-3, 10],
        [2, 10],
      ],
      mic: true,
      mouth: true,
      bob: -1,
    }),
  ],
  read: [
    P({
      hands: [
        [1, 3],
        [-1, 3],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
      book: true,
    }),
    P({
      hands: [
        [1, 3],
        [-1, 3],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
      book: true,
      bob: 1,
      page: true,
    }),
  ],
  code: [
    P({
      hands: [
        [2, 5],
        [-1, 6],
      ],
      feet: [
        [-3, 4],
        [3, 4],
      ],
      sit: true,
    }),
    P({
      hands: [
        [2, 6],
        [-1, 5],
      ],
      feet: [
        [-3, 4],
        [3, 4],
      ],
      sit: true,
    }),
  ],
  chill: [
    P({
      hands: [
        [-2, 6],
        [2, 6],
      ],
      feet: [
        [-3, 4],
        [3, 4],
      ],
      sit: true,
    }),
    P({
      hands: [
        [-2, 6],
        [1, -2],
      ],
      feet: [
        [-3, 4],
        [3, 4],
      ],
      sit: true,
      boba: true,
    }),
    P({
      hands: [
        [-2, 6],
        [1, -2],
      ],
      feet: [
        [-3, 4],
        [3, 4],
      ],
      sit: true,
      boba: true,
      bob: 1,
    }),
  ],
  wave: [
    P({
      hands: [
        [-2, 9],
        [6, -7],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
    }),
    P({
      hands: [
        [-2, 9],
        [8, -5],
      ],
      feet: [
        [-2, 10],
        [2, 10],
      ],
    }),
  ],
};

// ------------------------------------------------------------------- draw --
// dir: 1 faces right (default), -1 faces left (mirrored)
export function drawKunjal(ctx, x, y, poseName, frame, dir = 1, t = 0, scale = 1.3) {
  const frames = POSES[poseName] ?? POSES.idle;
  const p = frames[frame % frames.length];
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir * scale, scale);

  const sit = p.sit;
  const by = p.bob * 0.7 + (sit ? 6 : 0); // body baseline
  const hipY = by - 10;
  const shY = by - 19;
  const hy = shY - 6.4; // head centre (before the chibi enlargement)
  const sway = Math.sin(t * 2.2) * 0.7;

  // the head and hair are drawn bigger, around the base of her neck
  const bigHead = (draw) => {
    ctx.save();
    ctx.translate(0, shY - 1);
    ctx.scale(HEAD, HEAD);
    ctx.translate(0, -(shY - 1));
    draw();
    ctx.restore();
  };

  // soft shadow on the floor
  if (!sit) ellipse(ctx, 'rgba(90, 40, 70, 0.18)', 0, 0.5, 7, 1.5);

  // hair, back layer: a big cloud of long chestnut waves
  bigHead(() => {
    hairMass(ctx, PAL.hair, 0, hy - 5.5, hy + 15, 6.5, t, 0, sway);
    hairMass(ctx, PAL.hairMid, 0.4, hy - 3, hy + 12.5, 4.8, t, 2, sway * 0.6);
    // light catching the waves
    ctx.strokeStyle = PAL.hairHi;
    ctx.lineWidth = 0.6;
    for (const sx of [-5.6, -3.8, 4.0, 5.8]) {
      ctx.beginPath();
      ctx.moveTo(sx, hy + 2);
      ctx.bezierCurveTo(sx + 1.2, hy + 5, sx - 1.2, hy + 8, sx + 0.6, hy + 12 + sway);
      ctx.stroke();
    }
  });

  // legs (black flared trousers) + white trainers
  const leg = ([fx, fy]) => {
    const sx = fx > 0 ? 1.7 : -1.7;
    if (sit) {
      line(ctx, PAL.pants, 3.4, sx, hipY + 0.5, sx, hipY + 3.2 + fy);
      rrect(ctx, PAL.shoe, sx - 1.9, hipY + 3 + fy, 4, 2.2, 1);
      rrect(ctx, PAL.sole, sx - 1.9, hipY + 4.4 + fy, 4, 0.8, 0.4);
    } else {
      line(ctx, PAL.pants, 3.4, sx, hipY + 0.5, fx, hipY + fy - 2.2);
      ctx.fillStyle = PAL.pants;
      ctx.beginPath();
      ctx.moveTo(fx - 2.2, hipY + fy - 1.2);
      ctx.lineTo(fx + 2.2, hipY + fy - 1.2);
      ctx.lineTo(fx + 1.4, hipY + fy - 4.5);
      ctx.lineTo(fx - 1.4, hipY + fy - 4.5);
      ctx.fill();
      rrect(ctx, PAL.shoe, fx - 1.6, hipY + fy - 1.6, 4.4, 2.4, 1.2);
      rrect(ctx, PAL.sole, fx - 1.6, hipY + fy + 0.1, 4.4, 0.8, 0.4);
    }
  };
  leg(p.feet[0]);
  leg(p.feet[1]);
  rrect(ctx, PAL.pants, -4.1, hipY - 1.6, 8.2, 3.6, 1.4);

  // torso: black ribbed cami with a lace neckline
  ctx.fillStyle = PAL.top;
  ctx.beginPath();
  ctx.moveTo(-4.4, shY + 1.4);
  ctx.quadraticCurveTo(0, shY + 2.4, 4.4, shY + 1.4);
  ctx.quadraticCurveTo(4.5, shY + 5, 3.8, hipY - 0.6);
  ctx.lineTo(-3.8, hipY - 0.6);
  ctx.quadraticCurveTo(-4.5, shY + 5, -4.4, shY + 1.4);
  ctx.fill();
  for (let i = -3.6; i <= 3.6; i += 0.9) ellipse(ctx, PAL.lace, i, shY + 1.6 + Math.abs(i) * -0.12 + 0.4, 0.45, 0.35);
  for (let i = -3; i <= 3; i += 1.5) line(ctx, PAL.topHi, 0.3, i, shY + 3, i * 0.95, hipY - 1);
  // bare shoulders + collarbones, thin cami straps
  ctx.fillStyle = PAL.skin;
  ctx.beginPath();
  ctx.moveTo(-5, shY + 1.3);
  ctx.quadraticCurveTo(-4.6, shY - 1.2, -1.2, shY - 1.1);
  ctx.lineTo(1.2, shY - 1.1);
  ctx.quadraticCurveTo(4.6, shY - 1.2, 5, shY + 1.3);
  ctx.quadraticCurveTo(0, shY + 2.2, -5, shY + 1.3);
  ctx.fill();
  line(ctx, PAL.skinLo, 0.3, -2.6, shY + 0.2, -0.8, shY + 0.5);
  line(ctx, PAL.skinLo, 0.3, 2.6, shY + 0.2, 0.8, shY + 0.5);
  line(ctx, PAL.top, 0.45, -2.6, shY - 0.6, -2.4, shY + 1.8);
  line(ctx, PAL.top, 0.45, 2.6, shY - 0.6, 2.4, shY + 1.8);

  // the off-shoulder cardigan: slipping off her shoulders, open at the front
  for (const side of [-1, 1]) {
    ctx.fillStyle = PAL.top;
    ctx.beginPath();
    ctx.moveTo(side * 5.3, shY + 1.6);
    ctx.quadraticCurveTo(side * 3.4, shY + 2.4, side * 2.8, shY + 4.5);
    ctx.lineTo(side * 2.6, hipY + 1.6);
    ctx.lineTo(side * 4.9, hipY + 1.8);
    ctx.quadraticCurveTo(side * 5.6, shY + 6, side * 5.3, shY + 1.6);
    ctx.fill();
    for (let i = 0; i < 3; i++)
      line(ctx, PAL.lace, 0.25, side * (2.9 + i * 0.6), shY + 3.6 + i * 0.4, side * (2.8 + i * 0.6), hipY + 1.4);
    star(ctx, PAL.stitch, side * 4.1, shY + 5, 0.75);
    star(ctx, PAL.stitch, side * 3.6, hipY - 1.6, 0.5);
    // a little crescent moon
    ellipse(ctx, PAL.stitch, side * 4.2, shY + 7.6, 0.65, 0.65);
    ellipse(ctx, PAL.top, side * 4.45, shY + 7.4, 0.55, 0.55);
  }

  // arms in long knit sleeves, with pink embroidery
  const arm = (sx, [ax, ay]) => {
    const ex = sx + ax;
    const ey = shY + ay;
    line(ctx, '#2c222c', 2.9, sx, shY + 2.2, ex, ey);
    line(ctx, '#463846', 0.5, sx + ax * 0.15, shY + 2.2 + (ay - 2.2) * 0.15 - 0.9, ex - ax * 0.12, ey - 0.9);
    star(ctx, PAL.stitch, sx + ax * 0.5, shY + 2.2 + (ay - 2.2) * 0.5, 0.55);
    line(ctx, PAL.topHi, 0.5, sx + ax * 0.82, shY + 2.2 + (ay - 2.2) * 0.82, ex, ey);
    ellipse(ctx, PAL.skin, ex, ey + 0.2, 1.2, 1.2);
    return [ex, ey];
  };
  arm(-4.8, p.hands[0]);
  const handR = arm(4.8, p.hands[1]);

  // props in hand
  if (p.mic) {
    line(ctx, '#8a8d9a', 1.3, handR[0], handR[1] - 0.5, handR[0] - 0.4, handR[1] + 3.6);
    ellipse(ctx, PAL.mic, handR[0], handR[1] - 2, 1.5, 1.7);
  }
  if (p.book) {
    rrect(ctx, PAL.book, -3.6, shY + 2, 8.2, 6.4, 0.8);
    line(ctx, PAL.bookLo, 0.7, 0.5, shY + 2.2, 0.5, shY + 8.2);
    if (p.page) rrect(ctx, '#fffafc', 1.2, shY + 2.8, 2.8, 4.8, 0.4);
    ctx.fillStyle = PAL.heart;
    heartPath(ctx, -1.6, shY + 5, 2);
    ctx.fill();
  }
  if (p.brush) {
    line(ctx, PAL.brush, 0.9, handR[0], handR[1], handR[0] + 3.2, handR[1] - 3.2);
    ellipse(ctx, PAL.paint, handR[0] + 3.4, handR[1] - 3.6, 1, 1);
  }
  if (p.boba) {
    rrect(ctx, PAL.boba, handR[0] - 1.6, handR[1] - 4.4, 3.2, 5, 0.8);
    for (let i = 0; i < 3; i++) ellipse(ctx, PAL.pearl, handR[0] - 0.9 + i * 0.9, handR[1] - 0.1, 0.35, 0.35);
    line(ctx, PAL.heart, 0.6, handR[0] + 0.4, handR[1] - 4.2, handR[0] + 0.9, handR[1] - 7);
  }

  // neck + face
  rrect(ctx, PAL.skin, -1.1, shY - 3, 2.2, 2.8, 0.6);
  bigHead(() => {
    ellipse(ctx, PAL.skin, 0, hy, 5.1, 5.7);
    ellipse(ctx, PAL.skinLo, 3.9, hy + 1.8, 0.8, 1.6);
    // soft arched brows + brown eyes peeking over the sunglasses
    ctx.strokeStyle = PAL.brow;
    ctx.lineWidth = 0.42;
    ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * 1.3, hy - 2.9);
      ctx.quadraticCurveTo(side * 2.6, hy - 3.7, side * 3.8, hy - 3.0);
      ctx.stroke();
      ellipse(ctx, PAL.eye, side * 2.4, hy - 0.75, 0.85, 0.8);
      ellipse(ctx, '#fff', side * 2.4 + 0.3, hy - 1.05, 0.25, 0.25);
      // upper lash line with a little wing
      ctx.lineWidth = 0.45;
      ctx.beginPath();
      ctx.moveTo(side * 1.4, hy - 1.2);
      ctx.quadraticCurveTo(side * 2.4, hy - 2.0, side * 3.5, hy - 1.3);
      ctx.lineTo(side * 4.0, hy - 1.75);
      ctx.stroke();
      ctx.lineWidth = 0.42;
    }
    // the little dot above her right eye
    ellipse(ctx, '#5a2a24', 1.4, hy - 3.6, 0.3, 0.3);
    // burgundy rectangular sunglasses, worn low on the nose
    rrect(ctx, PAL.frame, -4.9, hy - 0.1, 4.3, 2.8, 0.9);
    rrect(ctx, PAL.frame, 0.6, hy - 0.1, 4.3, 2.8, 0.9);
    rrect(ctx, PAL.lens, -4.5, hy + 0.25, 3.5, 2.1, 0.6);
    rrect(ctx, PAL.lens, 1.0, hy + 0.25, 3.5, 2.1, 0.6);
    line(ctx, PAL.lensHi, 0.5, -4, hy + 0.7, -3, hy + 0.7);
    line(ctx, PAL.lensHi, 0.5, 1.5, hy + 0.7, 2.5, hy + 0.7);
    line(ctx, PAL.frame, 0.6, -0.6, hy + 0.5, 0.6, hy + 0.5);
    // blush + soft pink lips
    ellipse(ctx, PAL.blush, -3.7, hy + 3.2, 1.1, 0.55);
    ellipse(ctx, PAL.blush, 3.8, hy + 3.2, 1.1, 0.55);
    if (p.mouth) ellipse(ctx, PAL.lips, 0.2, hy + 4.2, 0.9, 1);
    else {
      ellipse(ctx, PAL.lips, 0.2, hy + 4.2, 1.2, 0.55);
      line(ctx, '#c45f74', 0.25, -0.7, hy + 4.15, 1.1, hy + 4.15);
    }

    // front hair: a deep side part, the long side swept across her forehead
    ctx.fillStyle = PAL.hair;
    ctx.beginPath();
    ctx.moveTo(-6.2, hy + 2.5);
    ctx.bezierCurveTo(-7.4, hy - 6.6, -1.2, hy - 8.6, 1.6, hy - 7.2);
    ctx.bezierCurveTo(5.6, hy - 6.8, 7.2, hy - 2.6, 6.0, hy + 2.2);
    ctx.bezierCurveTo(5.4, hy - 1.4, 4.4, hy - 3.6, 2.2, hy - 4.6);
    ctx.bezierCurveTo(0.4, hy - 3.2, -3.2, hy - 3.4, -4.6, hy - 2.2);
    ctx.bezierCurveTo(-5.2, hy - 0.8, -5.6, hy + 0.6, -6.2, hy + 2.5);
    ctx.fill();
    // the part, and shine
    line(ctx, PAL.hairMid, 0.5, 1.6, hy - 7, 2.1, hy - 4.8);
    ctx.strokeStyle = PAL.hairHi;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.arc(-0.6, hy - 1.2, 5.3, 1.2 * Math.PI, 1.42 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle = PAL.sheen;
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.arc(1.4, hy - 1.6, 5.6, 1.55 * Math.PI, 1.78 * Math.PI);
    ctx.stroke();
    // face-framing waves falling over her shoulders
    hairMass(ctx, PAL.hair, -5.3, hy - 1.5, hy + 12.5, 1.9, t, 4, sway);
    hairMass(ctx, PAL.hair, 5.4, hy - 1.5, hy + 11.5, 1.7, t, 5, sway);
    line(ctx, PAL.hairHi, 0.45, -5.6, hy + 2, -5, hy + 9);
    line(ctx, PAL.hairHi, 0.45, 5.1, hy + 2, 5.6, hy + 8);
    // gold stud earring peeking through
    ellipse(ctx, PAL.gold, 4.4, hy + 2.6, 0.55, 0.55);
    ellipse(ctx, '#fff3cf', 4.3, hy + 2.45, 0.2, 0.2);
  });

  ctx.restore();
}

// Asleep: tucked into bed on her side, sunglasses still on (of course).
export function drawSleeping(ctx, x, y, t = 0, scale = 1.5) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // hair fanned across the pillow
  hairMass(ctx, PAL.hair, 4, -9, 4, 8, t * 0.3);
  ellipse(ctx, PAL.hair, 12, 0, 5, 3, 0.3);
  ellipse(ctx, PAL.hairMid, 3, -4, 6, 3.5, -0.2);
  // face
  ellipse(ctx, PAL.skin, 4, -0.4, 4.6, 4.4);
  line(ctx, PAL.brow, 0.5, 1, -1.6, 3, -1.4);
  line(ctx, PAL.brow, 0.5, 5, -1.4, 7, -1.6);
  rrect(ctx, PAL.frame, -0.4, -0.6, 3.8, 2.4, 0.8);
  rrect(ctx, PAL.frame, 4.2, -0.6, 3.8, 2.4, 0.8);
  rrect(ctx, PAL.lens, -0.1, -0.3, 3.2, 1.8, 0.5);
  rrect(ctx, PAL.lens, 4.5, -0.3, 3.2, 1.8, 0.5);
  ellipse(ctx, '#5a2a24', 5, -2.6, 0.28, 0.28);
  ellipse(ctx, PAL.blush, 7, 2.4, 0.9, 0.5);
  ellipse(ctx, PAL.lips, 4.2, 3, 0.8, 0.4);
  // z z z, floating up
  ctx.fillStyle = '#b9a6e8';
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.6 + i / 3) % 1;
    ctx.globalAlpha = Math.sin(k * Math.PI);
    ctx.font = `600 ${3.5 + k * 3}px Fredoka, "Manrope Variable", sans-serif`;
    ctx.fillText('z', 12 + k * 7, -8 - k * 12);
  }
  ctx.restore();
}
