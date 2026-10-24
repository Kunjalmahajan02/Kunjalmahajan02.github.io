// The four worlds of the Dreamscape (plus Mission Control). `planet` names an
// illustration in public/dream (planet-<name>-<w>.webp), `pose` is the pose
// Mini Kunjal takes there, and the lines are what she says.
export const worlds = [
  {
    id: 'inventor',
    index: '01',
    name: 'Inventor’s Planet',
    theme: 'AI, engineering & experiments',
    blurb: 'Projects — what I built, how it works, and what I’d improve.',
    planet: { file: 'planet-inventor-272', w: 272, h: 279 },
    pose: 'work',
    enter: 'welcome to the lab ♡ everything here was built, broken and rebuilt.',
    hint: 'this planet is where my ideas get a little too ambitious.',
    home: { x: 74, y: 22 },
  },
  {
    id: 'observatory',
    index: '02',
    name: 'Observatory Beyond',
    theme: 'Research & open questions',
    blurb: 'The questions I keep looking up at.',
    planet: { file: 'planet-observatory-242', w: 242, h: 296 },
    pose: 'think',
    enter: 'point the telescope anywhere — these are the questions I can’t stop thinking about.',
    hint: 'curious what i’m curious about? look up.',
    home: { x: 88, y: 50 },
  },
  {
    id: 'garden',
    index: '03',
    name: 'Thought Garden',
    theme: 'How my ideas connect',
    blurb: 'Projects, tools and themes, growing into each other.',
    planet: { file: 'planet-garden-241', w: 241, h: 287 },
    pose: 'hello',
    enter: 'welcome to my brain. it’s a little chaotic in here — tap a flower.',
    hint: 'tiny detour? i promise it’s worth it.',
    home: { x: 70, y: 80 },
  },
  {
    id: 'daydream',
    index: '04',
    name: 'Daydream District',
    theme: 'Dance, art, fashion & modeling',
    blurb: 'The creative side of my brain lives over here.',
    planet: { file: 'planet-daydream-310', w: 310, h: 279 },
    pose: 'dance',
    enter: 'the creative side of my brain lives here ♡ dance, art, fashion, all of it.',
    hint: 'okay, this one’s one of my favourites.',
    home: { x: 42, y: 84 },
  },
];

export const mission = {
  id: 'about',
  name: 'Mission Control',
  theme: 'About, résumé & contact',
  pose: 'think',
  enter: 'mission control ✦ résumé, contact, and the less dreamy details.',
};

export const worldById = Object.fromEntries(worlds.map((w) => [w.id, w]));
