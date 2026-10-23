// The illustrated universe (public/art/universe-*.webp). Each world is a
// clickable planet in that artwork. Positions are percentages of the artwork
// box: `x`/`y` is the planet centre, `r` its radius (of the width), and
// `label` where its name is drawn.
export const worlds = [
  {
    id: 'ai-lab',
    name: 'AI Lab',
    lines: ['ML · DL · CV', 'Projects & experiments'],
    route: 'projects',
    x: 21.3, y: 23.7, r: 4.2,
    label: { x: 26.3, y: 19.6 },
  },
  {
    id: 'language-nebula',
    name: 'Language Nebula',
    lines: ['NLP · Speech · Multilingual', 'Translation Engine'],
    route: 'projects/speech',
    x: 47.5, y: 26.7, r: 3.6,
    label: { x: 51.9, y: 22.6 },
  },
  {
    id: 'vision-station',
    name: 'Vision Station',
    lines: ['BlinkBridge AI', 'Human-computer interaction'],
    route: 'projects/blinkbridge',
    x: 76.0, y: 27.7, r: 4.6,
    label: { x: 81.1, y: 20.6 },
  },
  {
    id: 'open-questions',
    name: 'Open Questions',
    lines: ['Research interests', 'Future projects'],
    route: 'research',
    x: 17.1, y: 43.4, r: 3.9,
    label: { x: 20.8, y: 39.9 },
  },
  {
    id: 'data-realm',
    name: 'Data Realm',
    lines: ['Analytics · Visualization', 'How it all connects'],
    route: 'research/map',
    x: 76.0, y: 52.9, r: 4.6,
    label: { x: 80.7, y: 47.8 },
  },
  {
    id: 'mission-control',
    name: 'Mission Control',
    lines: ['About · Contact', 'Kunjal.exe OS'],
    route: 'contact',
    x: 23.6, y: 63.3, r: 4.1,
    label: { x: 19.3, y: 68.0 },
  },
  {
    id: 'idea-archive',
    name: 'Idea Archive',
    lines: ['Research notes', 'Logs · Learnings'],
    route: 'archive',
    x: 80.1, y: 72.8, r: 4.2,
    label: { x: 85.3, y: 70.8 },
  },
  {
    id: 'creative-planet',
    name: 'Creative Planet',
    lines: ['Art · Fashion · Modeling', 'Dance · Lifestyle'],
    route: 'creative',
    x: 62.6, y: 78.6, r: 4.6,
    label: { x: 60.5, y: 84.5 },
  },
];

// The big bowed planet in the middle: Kunjal.exe itself.
export const core = { name: 'Kunjal.exe — her little universe', route: '', x: 49.8, y: 55.4, r: 8.6 };
