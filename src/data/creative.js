// CREATIVE.EXE — the creative side. Achievements come from Kunjal's résumé.
// `art` names an illustration of Mini Kunjal in public/art (made from
// Kunjal's own pose art by tools/make_creative.py). To use a photo instead,
// put it in public/creative/ and set `photo: 'creative/name.webp'`.

export const stages = [
  {
    id: 'dance',
    name: 'Dance & choreography',
    line: 'Kathak, folk and contemporary — and leading a crew on stage.',
    credits: [
      'National Level Championship Winner — Kathak, Folk and Contemporary Dance',
      'State-Level Classical Dance Artist',
      'Head of the College Dance Crew, Terna Engineering College',
    ],
    art: {
      name: 'creative-dance',
      w: 640,
      h: 480,
      alt: 'Mini Kunjal dancing — one leg kicked up, arm raised, mid-move.',
    },
  },
  {
    id: 'art',
    name: 'Sketching & painting',
    line: 'Pencil, paint, and whatever the page wants to become.',
    credits: [],
    art: { name: 'creative-art', w: 640, h: 480, alt: 'Mini Kunjal holding up a paintbrush and a palette of colours.' },
  },
  {
    id: 'fashion',
    name: 'Fashion & styling',
    line: 'Fashion designing and putting looks together — colour, silhouette, detail.',
    credits: [],
    art: {
      name: 'creative-fashion',
      w: 640,
      h: 480,
      alt: 'Mini Kunjal in a sparkly pink gown, holding out the skirt.',
    },
  },
  {
    id: 'modeling',
    name: 'Modeling',
    line: 'On the other side of the camera.',
    credits: ['Miss Fresher 2023, Terna Engineering College'],
    art: {
      name: 'creative-modeling',
      w: 640,
      h: 480,
      alt: 'Mini Kunjal posing and waving in her starry black cardigan and burgundy trousers.',
    },
  },
];

export const alsoMe = [
  'Yoga — State Champion',
  'Singing',
  'Writing',
  'Karate',
  'Photography',
  'Archery & shooting',
  'Sports',
  'Cooking',
];

export const creativeQuote = 'Dance, art, fashion, code… just different parts of the same me.';
