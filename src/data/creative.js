// Daydream District — the creative side. Achievements come from Kunjal's
// résumé. `art` names an illustration in public/art (moodboard stand-ins
// from the reference board) until real photos are added: to use a photo, put
// it in public/creative/ and set `photo: 'creative/name.webp'`.

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
    art: { name: 'mood-dance', w: 636, h: 792, alt: 'Illustration of Mini Kunjal mid-dance in a studio.' },
  },
  {
    id: 'art',
    name: 'Sketching & painting',
    line: 'Pencil, paint, and whatever the page wants to become.',
    credits: [],
    art: { name: 'mood-sketch', w: 432, h: 312, alt: 'A pencil sketch of Mini Kunjal looking over her shoulder.' },
  },
  {
    id: 'fashion',
    name: 'Fashion & styling',
    line: 'Fashion designing and putting looks together — colour, silhouette, detail.',
    credits: [],
    art: { name: 'mood-back', w: 572, h: 520, alt: 'Illustration of Mini Kunjal from behind in a backless top, against a painted floral wall.' },
  },
  {
    id: 'modeling',
    name: 'Modeling',
    line: 'On the other side of the camera.',
    credits: ['Miss Fresher 2023, Terna Engineering College'],
    art: { name: 'mood-portrait', w: 688, h: 378, alt: 'Illustrated portrait of Mini Kunjal in sunglasses, hair blowing in warm light.' },
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
