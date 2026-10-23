// The Living System: projects, technologies and themes, and only the links
// that are technically real (a project uses a tool, a tool serves a theme,
// one field builds on another). Coordinates are on a 1000 × 640 canvas.

export const kinds = {
  project: { label: 'Project', shape: 'planet' },
  theme: { label: 'Research theme', shape: 'ring' },
  tech: { label: 'Technology', shape: 'diamond' },
};

export const nodes = [
  // projects
  { id: 'blinkbridge', kind: 'project', label: 'BlinkBridge AI', x: 290, y: 330, route: 'lab/blinkbridge', note: 'Blink-to-Morse decoding from webcam or video.' },
  { id: 'speech', kind: 'project', label: 'Speech Translation Engine', x: 680, y: 240, route: 'lab/speech', note: 'English speech → text → six languages → optional speech.' },
  { id: 'chaintrack', kind: 'project', label: 'ChainTrack', x: 790, y: 500, route: 'lab/chaintrack', note: 'Supply-chain custody enforced by a smart contract.' },

  // research themes
  { id: 't-vision', kind: 'theme', label: 'Computer vision', x: 170, y: 160, route: 'observatory/vision', note: 'Landmarks, eye aspect ratio, low-light enhancement.' },
  { id: 't-hci', kind: 'theme', label: 'Accessible HCI', x: 320, y: 545, route: 'observatory/hci', note: 'Blinks and head gestures as input.' },
  { id: 't-deep', kind: 'theme', label: 'Deep learning', x: 505, y: 360, route: 'observatory/deep', note: 'The neural networks underneath vision and speech tools.' },
  { id: 't-speech', kind: 'theme', label: 'Speech processing', x: 560, y: 95, route: 'observatory/speech', note: 'Recognition and synthesis.' },
  { id: 't-nlp', kind: 'theme', label: 'Multilingual NLP', x: 845, y: 110, route: 'observatory/nlp', note: 'Translation and transliteration across languages.' },
  { id: 't-eval', kind: 'theme', label: 'Model evaluation', x: 555, y: 490, route: null, note: 'Measuring how often a system works, and where it fails.' },
  { id: 't-data', kind: 'theme', label: 'Data visualization', x: 420, y: 455, route: 'observatory/data', note: 'Plots that make signals and results readable.' },
  { id: 't-chain', kind: 'theme', label: 'Blockchain & trust', x: 925, y: 380, route: null, note: 'Shared records no single party can quietly edit.' },

  // technologies
  { id: 'python', kind: 'tech', label: 'Python', x: 420, y: 205, route: null, note: 'Language for BlinkBridge and the speech engine.' },
  { id: 'opencv', kind: 'tech', label: 'OpenCV', x: 60, y: 265, route: null, note: 'Video capture, colour conversion, CLAHE.' },
  { id: 'mediapipe', kind: 'tech', label: 'MediaPipe', x: 85, y: 420, route: null, note: 'Face Mesh — 468 facial landmarks per frame.' },
  { id: 'pyqt', kind: 'tech', label: 'PyQt6', x: 165, y: 575, route: null, note: 'BlinkBridge desktop interface and Forensic Mode.' },
  { id: 'gradio', kind: 'tech', label: 'Gradio', x: 860, y: 260, route: null, note: 'Web interface for the speech engine.' },
  { id: 'assemblyai', kind: 'tech', label: 'AssemblyAI', x: 715, y: 55, route: null, note: 'Speech-to-text service.' },
  { id: 'elevenlabs', kind: 'tech', label: 'ElevenLabs', x: 950, y: 175, route: null, note: 'Text-to-speech for translated output.' },
  { id: 'solidity', kind: 'tech', label: 'Solidity', x: 930, y: 585, route: null, note: 'ChainTrack smart contract (0.8.20).' },
  { id: 'ethers', kind: 'tech', label: 'ethers.js', x: 690, y: 595, route: null, note: 'Optional ChainTrack web front-end.' },
];

export const edges = [
  ['blinkbridge', 't-vision'],
  ['blinkbridge', 't-hci'],
  ['blinkbridge', 't-nlp'],
  ['blinkbridge', 't-eval'],
  ['blinkbridge', 't-data'],
  ['blinkbridge', 'python'],
  ['blinkbridge', 'opencv'],
  ['blinkbridge', 'mediapipe'],
  ['blinkbridge', 'pyqt'],

  ['speech', 't-speech'],
  ['speech', 't-nlp'],
  ['speech', 'python'],
  ['speech', 'gradio'],
  ['speech', 'assemblyai'],
  ['speech', 'elevenlabs'],

  ['chaintrack', 't-chain'],
  ['chaintrack', 'solidity'],
  ['chaintrack', 'ethers'],

  ['opencv', 't-vision'],
  ['mediapipe', 't-vision'],
  ['t-vision', 't-hci'],
  ['t-vision', 't-deep'],
  ['t-speech', 't-deep'],
  ['t-speech', 't-nlp'],
  ['t-nlp', 't-deep'],
  ['t-deep', 't-eval'],
  ['t-eval', 't-data'],
];

export const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

export function neighbours(id) {
  return edges.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));
}
