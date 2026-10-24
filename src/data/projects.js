// Inventor's Planet case studies.
//
// `evidence` records where each case study's facts come from: BlinkBridge and
// ChainTrack were checked against their public repositories; the other
// projects are described from Kunjal's résumé and the project brief, and are
// labelled that way on the site. No metrics or results are invented.

export const projects = [
  {
    id: 'blinkbridge',
    moon: 'MOON 01',
    name: 'BlinkBridge AI',
    repoName: 'Blink-to-Morse',
    tagline: 'Eye blinks in, Morse code out — then text, translation and speech.',
    summary:
      'A computer-vision prototype that reads Morse code from eye blinks, from a live webcam or a recorded video, and decodes it into text in English and 14 Indian languages.',
    status: 'Founder project · ongoing',
    role: 'Founder — building BlinkBridge, an assistive communication tool for people who cannot speak or type.',
    why: 'For someone with severe motor impairment, a webcam and their eyes may be the only reliable way left to communicate. A tool that works with ordinary hardware, adapts to each person and speaks the message aloud lowers that barrier.',
    evidence: {
      level: 'verified',
      note: 'Checked against the public repository (code, README and evaluation files) and Kunjal’s résumé.',
    },
    links: [{ label: 'GitHub repository', href: 'https://github.com/Kunjalmahajan02/Blink-to-Morse' }],
    stack: [
      'Python 3.12',
      'OpenCV',
      'MediaPipe Face Mesh',
      'NumPy',
      'PyQt6',
      'Matplotlib',
      'deep-translator',
      'pyttsx3 / gTTS',
      'indic-transliteration',
    ],
    highlights: [
      'Modular Python architecture — blink detection, head-gesture recognition, Morse translation, calibration, speech output and session logging are separate components that can be tested and improved independently.',
      'Auto-calibration adapts detection to each user’s eyes and camera; a countdown-based interface guides each input.',
      'Head nods and turns act as extra input gestures alongside blinks.',
      'Decoded messages are spoken aloud with text-to-speech, and every session is logged.',
    ],
    improve: ['Adaptive timing in live webcam mode', 'Telling intentional blinks from involuntary ones', 'Running on low-power edge hardware'],
    problem:
      'Some people can’t speak or use their hands but can still control their eyes — patients with severe motor impairments, or someone filmed against their will. Morse code blinked on camera can carry a message, but only if someone notices it and decodes it reliably.',
    solution:
      'BlinkBridge tracks the eyes frame by frame, turns each closure into a dot or a dash, groups them into letters and words, and decodes the message. Uncertain blinks are flagged rather than trusted, and a Forensic Mode lets a human review and correct the reading before it is translated or spoken.',
    flow: [
      { label: 'Webcam or video', detail: 'Live webcam, or a recorded file timed with the video’s own clock (frame ÷ fps) so durations stay correct at any processing speed.' },
      { label: 'Face landmarks', detail: 'MediaPipe Face Mesh finds 468 facial points per frame, six around each eye. Dark frames are first lifted with gamma correction and CLAHE.' },
      { label: 'Eye Aspect Ratio', detail: 'EAR = (|p2−p6| + |p3−p5|) / (2·|p1−p4|). It holds steady while the eye is open and drops sharply on a blink.' },
      { label: 'Dot or dash', detail: 'Calibrated to the person: the blink threshold is 75% of their open-eye baseline. Closed < 0.3 s is a dot, ≥ 0.3 s a dash.' },
      { label: 'Letters & words', detail: 'Pauses split letters (> 1.2 s) and words (> 3.0 s). For recorded video, adaptive timing learns the person’s rhythm and repairs merged letters.' },
      { label: 'Decode & review', detail: 'Morse is decoded to text with confidence flags. Forensic Mode shows the EAR graph, ranked alternative readings and manual corrections.' },
      { label: 'Translate & speak', detail: 'Offline by default: a phrasebook and transliteration for 14 Indian languages, plus offline speech. Online translation is an opt-in.' },
    ],
    decisions: [
      {
        title: 'Timing by ratio, not by seconds',
        body: 'Morse is defined by ratios (1 : 3 : 7). Adaptive mode estimates each person’s rhythm unit and splits letters relative to it, because people under stress keep a rhythm but rarely exact timings.',
      },
      {
        title: 'Flag doubt instead of hiding it',
        body: 'A blink near the dot/dash cutoff, or next to a lost face-tracking frame, is marked low-confidence. Reconstructed letters are shown in a different colour. No confidence percentages are invented.',
      },
      {
        title: 'RAW, FINAL and corrections kept apart',
        body: 'The detector’s raw output is never overwritten. Analyst corrections are logged separately, so every final message can be audited back to the original blinks.',
      },
      {
        title: 'Offline first',
        body: 'Detection always runs on-device, and output stays offline by default — in the motivating scenario, sending a decoded message to a translation server would leak it.',
      },
      {
        title: 'Robust to camera angle',
        body: 'Visibility-weighted EAR, a rolling open-eye baseline (85th percentile of the last 6 s) and automatic rotation detection keep detection usable when the face isn’t square to the camera.',
      },
    ],
    lessons: [
      'Early testing showed a correctly blinked S-O-S decoding as “?” because the pauses between letters were shorter than the fixed 1.2 s rule. That failure led to adaptive timing and pattern repair.',
      'Splitting too much can’t be undone, but merging too much can be repaired, so the adaptive thresholds are deliberately cautious and rely on repair for the fine work.',
      'Low-light enhancement can’t recover detail the camera never captured — so its effect is measured with an evaluation script rather than assumed.',
    ],
    evaluation:
      'The repository includes an evaluation tool (evaluate.py) and a labelled set of test videos across lighting, glasses and angle conditions. The README marks its results tables as still being filled in, so no accuracy figures are quoted here.',
  },
  {
    id: 'speech',
    moon: 'MOON 02',
    name: 'Speech-to-Text & Translation Engine',
    tagline: 'Speak in English, read it — or hear it — in six other languages.',
    summary:
      'An AI speech-processing project that transcribes English speech and translates it into Hindi, Marathi, Korean, Japanese, Turkish and Spanish, with optional spoken output.',
    status: 'Project',
    why: 'Most speech tools assume one language. Turning a single English recording into readable — and audible — Hindi, Marathi, Korean, Japanese, Turkish or Spanish makes it useful to far more listeners.',
    improve: ['Publishing the code', 'Testing translation quality for each target language with native speakers'],
    evidence: {
      level: 'unverified',
      note: 'The source code isn’t public yet, so this is based on the project description and Kunjal’s résumé. No accuracy or production-readiness claims are made.',
    },
    links: [],
    stack: ['Python', 'Gradio', 'AssemblyAI', 'A translation library', 'ElevenLabs (text-to-speech)'],
    languages: ['Hindi', 'Marathi', 'Korean', 'Japanese', 'Turkish', 'Spanish'],
    problem:
      'Spoken English is a barrier for many listeners. A single tool that turns speech into text, then into the listener’s language — and optionally back into speech — makes a recording usable across languages.',
    solution:
      'A Gradio web interface where a user records or uploads English audio. The audio is transcribed by AssemblyAI’s speech-to-text service, the transcript is passed through a translation library into the chosen target language, and ElevenLabs can optionally voice the translation.',
    flow: [
      { label: 'Audio input', detail: 'The user records or uploads English speech through a Gradio interface.' },
      { label: 'Transcription', detail: 'AssemblyAI converts the speech to English text.' },
      { label: 'Translation', detail: 'A translation library renders the transcript in Hindi, Marathi, Korean, Japanese, Turkish or Spanish.' },
      { label: 'Speech output (optional)', detail: 'ElevenLabs text-to-speech reads the translated text aloud.' },
    ],
    decisions: [
      {
        title: 'A pipeline of specialised services',
        body: 'Each stage — recognition, translation, synthesis — is handled by a tool built for it, so any one stage can be swapped without rewriting the others.',
      },
      {
        title: 'Gradio for the interface',
        body: 'Gradio provides audio recording, upload and output components in Python, keeping the whole project in one language.',
      },
      {
        title: 'Speech output is optional',
        body: 'Text output works on its own; voicing the translation is an extra step the user chooses.',
      },
    ],
    lessons: [],
    evaluation: null,
  },
  {
    id: 'chaintrack',
    moon: 'MOON 03',
    name: 'ChainTrack',
    repoName: 'ChainTrack',
    tagline: 'Supply-chain custody, recorded and enforced on-chain.',
    summary:
      'A Solidity smart contract that records product registration and every change of custody — Manufacturer → Distributor → Retailer — on an EVM blockchain, with the rules enforced by the contract itself.',
    status: 'Prototype on a local test network',
    why: 'When every party keeps its own records, custody can be disputed or quietly edited. Putting the rules and the history in a shared contract means no single party can rewrite who held a product.',
    improve: ['Linking products to trusted real-world inputs — QR codes, tamper-proof tags or IoT sensors', 'Deploying beyond the local test network'],
    evidence: {
      level: 'verified',
      note: 'Details checked against the public repository (contract source, README, architecture notes and test cases).',
    },
    links: [
      { label: 'GitHub repository', href: 'https://github.com/Kunjalmahajan02/ChainTrack' },
      { label: 'Project report (PDF)', href: 'https://github.com/Kunjalmahajan02/ChainTrack/blob/main/docs/ChainTrack_Project_Report.pdf' },
      { label: 'Test evidence (screenshots)', href: 'https://github.com/Kunjalmahajan02/ChainTrack/tree/main/screenshots' },
    ],
    stack: [
      'Solidity 0.8.20',
      'EVM — Remix VM test network',
      'Remix IDE',
      'HTML, CSS, JavaScript',
      'ethers.js v6',
      'MetaMask (optional front-end)',
    ],
    problem:
      'In a supply chain, each party keeps its own records of who held a product and when. Those records can disagree or be edited after the fact, so tracing a product’s custody depends on trusting every party.',
    solution:
      'ChainTrack moves custody records into a smart contract. An admin assigns roles; only a manufacturer can register a product; only the current owner can transfer it, and only to another authorised participant. Anyone can verify a product and read its ordered ownership history.',
    flow: [
      { label: 'Admin deploys', detail: 'The deploying account becomes admin.' },
      { label: 'Assign roles', detail: 'setRole(address, role): Manufacturer (1), Distributor (2) or Retailer (3). Emits RoleAssigned.' },
      { label: 'Register product', detail: 'registerProduct(name, category, batch) — manufacturer only. Stores the product and its first owner. Emits ProductRegistered.' },
      { label: 'Transfer custody', detail: 'transferProduct(id, newOwner) — caller must be the current owner and the recipient must hold a role. Emits OwnershipTransferred.' },
      { label: 'Verify & trace', detail: 'getProduct, getOwnershipHistory and verifyProduct are read-only calls anyone can make.' },
    ],
    decisions: [
      {
        title: 'Rules live in the contract',
        body: 'Access control is enforced with Solidity modifiers and require checks, so an unauthorised action is rejected by the chain itself — not just hidden in a user interface.',
      },
      {
        title: 'Events as a permanent log',
        body: 'RoleAssigned, ProductRegistered and OwnershipTransferred events give an append-only record that front-ends can read.',
      },
      {
        title: 'History as an ordered list',
        body: 'Each product keeps an array of owner addresses, so its full custody chain can be returned in order with one call.',
      },
    ],
    tests: [
      ['TC01', 'Admin assigns roles', 'Success'],
      ['TC02', 'Manufacturer registers product', 'Success'],
      ['TC03', 'Account with no role registers product', 'Rejected — Manufacturer only'],
      ['TC04', 'Transfer Manufacturer → Distributor → Retailer', 'Success'],
      ['TC05', 'Previous owner tries to transfer again', 'Rejected — Not current owner'],
      ['TC06', 'Transfer to address with no role', 'Rejected — Recipient not authorized'],
      ['TC07', 'getProduct(1)', 'Correct details returned'],
      ['TC08', 'getOwnershipHistory(1)', '3 owners in order'],
      ['TC09', 'getProduct(999)', 'Rejected — Product not found'],
      ['TC10', 'Non-admin calls setRole', 'Rejected — Admin only'],
    ],
    lessons: [
      'Product data is stored on-chain in plain text, so it must never hold confidential information.',
      'verifyProduct confirms that a product ID exists — it can’t prove a physical item is genuine without trusted real-world inputs such as QR codes, tamper-proof tags or IoT sensors.',
      'The optional web front-end needs a local node (e.g. Ganache) and MetaMask on the same network; it can’t talk to Remix VM directly.',
    ],
    evaluation:
      'The repository documents 10 test cases run in Remix VM, all passing, with screenshots of every test and transaction details in the project report.',
  },
  {
    id: 'tb-detection',
    moon: 'MOON 04',
    name: 'Tuberculosis Detection from Chest X-Rays',
    tagline: 'A CNN that reads chest X-rays for signs of tuberculosis.',
    summary: 'A deep learning system that detects tuberculosis from chest X-ray images using CNN-based medical image analysis, to support early detection.',
    status: 'Project',
    why: 'Early detection matters for TB, and reading X-rays takes trained specialists. An automated first look can help flag images that need attention.',
    evidence: { level: 'unverified', note: 'Described from Kunjal’s résumé; the code isn’t public yet. No accuracy figures are claimed.' },
    links: [],
    stack: ['Python', 'Deep learning', 'CNN', 'Medical image processing'],
    problem: 'Tuberculosis screening relies on reading chest X-rays, which needs expertise and time that isn’t always available.',
    solution: 'A convolutional neural network learns patterns in chest X-ray images and classifies them, as a support tool for early detection.',
    flow: [
      { label: 'Chest X-ray', detail: 'An X-ray image is the input.' },
      { label: 'Pre-processing', detail: 'The image is prepared for the network (medical image processing).' },
      { label: 'CNN', detail: 'A convolutional neural network extracts visual features.' },
      { label: 'Prediction', detail: 'The model outputs whether signs of tuberculosis are detected.' },
    ],
    decisions: [],
    lessons: [],
    improve: ['Publishing the code and evaluation', 'Explaining predictions visually (e.g. heat-maps) for clinicians'],
    evaluation: null,
  },
  {
    id: 'inventory',
    moon: 'MOON 05',
    name: 'Inventory Management & Billing System',
    tagline: 'Stock, billing and reports — automated with Python and MySQL.',
    summary: 'A Python and MySQL system that automates inventory tracking, billing and report generation, with a structured, user-friendly interface for stock and sales management.',
    status: 'Project',
    why: 'Small shops often track stock and bills by hand; automating it reduces errors and saves time.',
    evidence: { level: 'unverified', note: 'Described from Kunjal’s résumé; the code isn’t public yet.' },
    links: [],
    stack: ['Python', 'MySQL'],
    problem: 'Tracking stock, writing bills and producing sales reports by hand is slow and error-prone.',
    solution: 'A Python application backed by a MySQL database that records stock, generates bills and produces reports.',
    flow: [
      { label: 'Stock entry', detail: 'Products and quantities are recorded in MySQL.' },
      { label: 'Billing', detail: 'Sales generate bills and update stock.' },
      { label: 'Reports', detail: 'Stock and sales reports are generated from the database.' },
    ],
    decisions: [],
    lessons: [],
    improve: [],
    evaluation: null,
  },
  {
    id: 'hangman',
    moon: 'MOON 06',
    name: 'Hangman Game',
    tagline: 'A classic word game, written in Python.',
    summary: 'An interactive Hangman game in Python with clean game-flow logic and a user-friendly interface.',
    status: 'Project',
    why: 'A small, complete program — a good exercise in game state, input handling and clear flow.',
    evidence: { level: 'unverified', note: 'Described from Kunjal’s résumé.' },
    links: [],
    stack: ['Python'],
    problem: 'Build a complete interactive game with clear rules and state.',
    solution: 'A Python game loop that tracks guesses, remaining lives and the revealed word.',
    flow: [
      { label: 'Pick a word', detail: 'The game chooses a secret word.' },
      { label: 'Guess', detail: 'The player guesses letters.' },
      { label: 'Reveal or lose a life', detail: 'Correct letters are revealed; wrong ones cost a life.' },
      { label: 'Win or lose', detail: 'The game ends when the word is found or lives run out.' },
    ],
    decisions: [],
    lessons: [],
    improve: [],
    evaluation: null,
  },
];

export const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));
