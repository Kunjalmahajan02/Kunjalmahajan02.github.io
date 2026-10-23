// The Idea Archive. Starter entries are drawn from what is already documented
// in the project repositories (`source`), so nothing here is invented.
// Add new notes by appending to `entries`; categories with no entries show
// an empty state automatically.

export const categories = [
  { id: 'all', label: 'All notes' },
  { id: 'log', label: 'Project logs' },
  { id: 'research', label: 'Research notes' },
  { id: 'experiment', label: 'Experiment journals' },
  { id: 'concept', label: 'Technical concepts' },
  { id: 'ideas', label: 'Future ideas' },
  { id: 'lesson', label: 'Lessons learned' },
];

const BLINK = { label: 'Blink-to-Morse README', href: 'https://github.com/Kunjalmahajan02/Blink-to-Morse#readme' };
const CHAIN = { label: 'ChainTrack README', href: 'https://github.com/Kunjalmahajan02/ChainTrack#readme' };

export const entries = [
  {
    id: 'sos-question-mark',
    category: 'log',
    project: 'blinkbridge',
    title: 'When S-O-S decoded as “?”',
    body: [
      'A tester blinked S-O-S correctly but paused only about half a second between letters. The fixed 1.2 s letter gap merged everything into one group — “…---…” — which isn’t a valid letter, so it decoded as “?”.',
      'The fix was adaptive timing: estimate the person’s own rhythm from their short gaps, split letters relative to it, and repair any group that still isn’t a valid letter.',
    ],
    source: BLINK,
  },
  {
    id: 'split-vs-merge',
    category: 'lesson',
    project: 'blinkbridge',
    title: 'Splitting can’t be undone. Merging can.',
    body: [
      'If a blink group is split too eagerly, the pieces still look like valid letters, so the mistake is invisible. If it’s merged too eagerly, the result is an invalid pattern that can be detected and repaired.',
      'So the thresholds lean cautious and let pattern repair do the fine work.',
    ],
    source: BLINK,
  },
  {
    id: 'ear',
    category: 'concept',
    project: 'blinkbridge',
    title: 'The Eye Aspect Ratio in one line',
    body: [
      'EAR = (|p2 − p6| + |p3 − p5|) / (2 · |p1 − p4|)',
      'The vertical gap of the eyelids divided by the width of the eye. It stays roughly constant while the eye is open and drops sharply when it closes — a blink detector without training a model.',
    ],
    source: BLINK,
  },
  {
    id: 'raw-final',
    category: 'log',
    project: 'blinkbridge',
    title: 'Keeping RAW, FINAL and corrections apart',
    body: [
      'When one wrong letter can change a message’s meaning, the output shouldn’t be trusted blindly. Forensic Mode keeps three layers: the detector’s raw output, the reviewed final message, and the list of corrections between them.',
    ],
    source: BLINK,
  },
  {
    id: 'verify-limits',
    category: 'lesson',
    project: 'chaintrack',
    title: 'What verifyProduct can’t prove',
    body: [
      'The contract can confirm that a product ID exists and show who held it. It can’t prove the physical item in your hand is that product — that needs trusted real-world inputs like QR codes, tamper-proof tags or IoT sensors.',
    ],
    source: CHAIN,
  },
  {
    id: 'rules-in-contract',
    category: 'concept',
    project: 'chaintrack',
    title: 'Rules belong in the contract, not the UI',
    body: [
      'A front-end can hide a button, but anyone can call a contract directly. ChainTrack enforces roles with modifiers and require checks, so an unauthorised transfer is rejected by the chain itself — with messages like “Not current owner”.',
    ],
    source: CHAIN,
  },
  {
    id: 'blink-future',
    category: 'ideas',
    project: 'blinkbridge',
    title: 'Next for BlinkBridge',
    list: [
      'Adaptive timing in live webcam mode',
      'Telling intentional blinks from involuntary ones',
      'Video integrity checks for edited or tampered footage',
      'Running on low-power edge hardware such as a Raspberry Pi',
    ],
    source: BLINK,
  },
  {
    id: 'whiteboard',
    category: 'ideas',
    project: null,
    title: 'On the whiteboard',
    note: 'Ideas only — none of these has been started.',
    list: ['Multimodal AI', 'Sign-language recognition', 'Image captioning', 'AI for healthcare'],
    source: null,
  },
];
