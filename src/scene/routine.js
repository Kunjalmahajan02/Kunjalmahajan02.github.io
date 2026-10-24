// Mini Kunjal's day, in India time. Each activity happens in a scene (home,
// or the dance, walk or art room) at a spot on its floor, with a pose and a
// few things she says while doing it.

export const ACTIVITIES = {
  sleep: {
    label: 'Sleep',
    icon: '☾',
    status: 'Asleep',
    scene: 'home',
    spot: { gx: 3.1, gy: 1.7 }, // beside the bed, then tucked in
    pose: 'sleep',
    lines: ['zzz… (the sunglasses stay on)', 'shh. dreaming in Python.'],
  },
  dance: {
    label: 'Dance',
    icon: '♪',
    status: 'Dance practice in the dance room',
    scene: 'dance',
    spot: { gx: 3.8, gy: 2.8 },
    pose: 'dance',
    link: 'creative',
    lines: ['kathak, folk, contemporary — and leading the crew ♡', 'five, six, seven, eight!'],
  },
  code: {
    label: 'Code',
    icon: '⌨',
    status: 'Building BlinkBridge',
    scene: 'home',
    spot: { gx: 1.05, gy: 6.2 },
    seat: 12, // on her desk chair
    pose: 'code',
    link: 'projects',
    lines: ['building BlinkBridge — blinks in, Morse out.', 'one more bug, then boba.'],
  },
  chill: {
    label: 'Chill',
    icon: '☕',
    status: 'Boba break with Mochi',
    scene: 'home',
    spot: { gx: 7.5, gy: 0.95 },
    seat: 11, // on the sofa
    pose: 'chill',
    lines: ['boba break with Mochi ♡', 'recharging. back in five.'],
  },
  read: {
    label: 'Research',
    icon: '▤',
    status: 'Reading & research',
    scene: 'home',
    spot: { gx: 1.15, gy: 7.4 },
    pose: 'read',
    link: 'research',
    lines: ['reading about CNNs and multilingual NLP.', 'one more paper… okay, three.'],
  },
  paint: {
    label: 'Paint',
    icon: '✎',
    status: 'Painting in the art room',
    scene: 'art',
    spot: { gx: 1.75, gy: 2.3 },
    pose: 'paint',
    link: 'creative',
    lines: ['sketching is my other way of debugging.', 'a pink sky again? obviously.'],
  },
  ramp: {
    label: 'Rampwalk',
    icon: '✦',
    status: 'Rampwalk practice in the walk room',
    scene: 'walk',
    spot: { gx: 3.3, gy: 1.0 },
    seat: 5, // up on the runway
    runway: { axis: 'gy', from: 0.9, to: 4.2 }, // struts along it
    pose: 'ramp',
    link: 'creative',
    lines: ['Miss Fresher 2023, practising the walk ✦', 'chin up, shoulders back, sunglasses on.'],
  },
  sing: {
    label: 'Karaoke',
    icon: '♫',
    status: 'Karaoke in the dance room',
    scene: 'dance',
    spot: { gx: 1.3, gy: 3.6 },
    pose: 'sing',
    lines: ['karaoke time — don’t judge ♡', 'this one goes out to everyone debugging at night.'],
  },
};

export const ORDER = ['sleep', 'dance', 'code', 'chill', 'read', 'paint', 'ramp', 'sing'];

// [from, to, activity] in IST hours
export const SCHEDULE = [
  [0, 7, 'sleep'],
  [7, 9, 'dance'],
  [9, 13, 'code'],
  [13, 14, 'chill'],
  [14, 16, 'read'],
  [16, 18, 'paint'],
  [18, 19, 'ramp'],
  [19, 21, 'sing'],
  [21, 23, 'code'],
  [23, 24, 'chill'],
];

export function activityAt(hour) {
  const h = ((hour % 24) + 24) % 24;
  return (SCHEDULE.find(([a, b]) => h >= a && h < b) ?? SCHEDULE[0])[2];
}

export function istHour(date = new Date()) {
  const utc = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  return (utc + 5.5) % 24;
}

export function fmtHour(h) {
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
