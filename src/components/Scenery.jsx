// Vector scenery for each world, drawn by hand in SVG so it stays sharp at
// any size. Everything here is decorative (aria-hidden by the parent).
// Shared gradient ids live in <Defs>.

function Defs() {
  return (
    <defs>
      <linearGradient id="sc-rock" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3B2B4E" />
        <stop offset="1" stopColor="#1A1222" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="sc-rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#DDA7C6" stopOpacity="0" />
        <stop offset="0.5" stopColor="#F4C9DE" />
        <stop offset="1" stopColor="#B9AED8" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="sc-city" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#30233D" />
        <stop offset="1" stopColor="#170F1D" />
      </linearGradient>
      <linearGradient id="sc-beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE3F0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FFE3F0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="sc-ribbon" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#DDA7C6" stopOpacity="0" />
        <stop offset="0.4" stopColor="#F6C8DD" />
        <stop offset="1" stopColor="#B9AED8" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="sc-glow">
        <stop offset="0" stopColor="#FFE9F4" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FFE9F4" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="sc-stem" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#5FB8A4" stopOpacity="0.15" />
        <stop offset="1" stopColor="#A6F0DA" />
      </linearGradient>
    </defs>
  );
}

// a far city of spires along the horizon, a few windows lit
function Spires({ y = 820, tone = 'url(#sc-city)' }) {
  const towers = [
    [40, 120, 26], [90, 200, 18], [130, 90, 30], [180, 260, 14], [215, 150, 24], [270, 110, 20], [1180, 140, 22],
    [1230, 280, 16], [1270, 170, 26], [1330, 230, 14], [1370, 120, 30], [1430, 190, 18], [1490, 140, 24], [1550, 250, 16],
  ];
  return (
    <g className="sc-layer sc-layer--far">
      {towers.map(([x, h, w], i) => (
        <g key={i}>
          <path d={`M${x} ${y} V${y - h} l${w / 2} -${w * 1.6} l${w / 2} ${w * 1.6} V${y} Z`} fill={tone} />
          {i % 2 === 0 && <rect x={x + w / 2 - 1.5} y={y - h + 30} width="3" height="5" fill="#F6C8DD" opacity="0.7" />}
          {i % 3 === 0 && <rect x={x + w / 2 - 1.5} y={y - h + 70} width="3" height="5" fill="#B9AED8" opacity="0.6" />}
        </g>
      ))}
      <rect x="0" y={y} width="1600" height={900 - y} fill="#170F1D" />
    </g>
  );
}

// a floating rock island; children sit on its top surface (y = 0)
function Island({ x, y, w, children, className = '' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`sc-float ${className}`}>
      <path
        d={`M${-w / 2} 0 Q${-w / 2.6} ${w * 0.18} ${-w / 5} ${w * 0.32} Q0 ${w * 0.62} ${w / 6} ${w * 0.34} Q${w / 2.4} ${w * 0.16} ${w / 2} 0 Z`}
        fill="url(#sc-rock)"
      />
      <path d={`M${-w / 2} 0 H${w / 2}`} stroke="url(#sc-rim)" strokeWidth="2.5" strokeLinecap="round" />
      {children}
      </g>
    </g>
  );
}

function HomeScene() {
  return (
    <>
      <g className="sc-layer sc-layer--far" opacity="0.5" stroke="#D7D3DF" strokeWidth="0.8" fill="none">
        <path d="M1180 90 L1250 140 L1320 110 L1390 170 L1440 130" />
        <path d="M120 140 L190 110 L250 160" />
      </g>
      <Spires />
      {/* an impossible staircase island with a ruined arch */}
      <g className="sc-layer sc-layer--mid">
        <Island x={700} y={700} w={240}>
          <path d="M-70 0 V-120 A45 45 0 0 1 20 -120 V0" fill="none" stroke="#D7D3DF" strokeWidth="5" opacity="0.8" />
          <path d="M-55 0 V-115 A30 30 0 0 1 5 -115 V0" fill="none" stroke="#B9AED8" strokeWidth="2" opacity="0.6" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={40 + i * 16} y={-14 - i * 16} width="22" height="5" rx="2" fill="#D7D3DF" opacity={0.85 - i * 0.12} />
          ))}
          <circle cx="-25" cy="-150" r="26" fill="url(#sc-glow)" className="sc-pulse" />
          <circle cx="-25" cy="-150" r="3" fill="#FFF7FB" />
        </Island>
        <Island x={1290} y={640} w={170}>
          <path d="M-20 0 V-50 Q0 -78 20 -50 V0" fill="#30233D" stroke="#DDA7C6" strokeWidth="1.5" />
          <circle cx="0" cy="-34" r="5" fill="#FFE3F0" className="sc-pulse" />
        </Island>
      </g>
      {/* a ribbon of light drifting through the scene */}
      <path className="sc-ribbon" d="M-40 470 C 300 380, 520 600, 820 480 S 1350 360, 1660 470" fill="none" stroke="url(#sc-ribbon)" strokeWidth="2" />
    </>
  );
}

function Gear({ x, y, r, teeth, speed, opacity = 0.5 }) {
  const ticks = Array.from({ length: teeth }, (_, i) => (i * 360) / teeth);
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <g className="sc-spin" style={{ animationDuration: `${Math.abs(speed)}s`, animationDirection: speed < 0 ? 'reverse' : 'normal' }}>
        <circle r={r} fill="none" stroke="#B9AED8" strokeWidth="1.5" />
        <circle r={r * 0.62} fill="none" stroke="#D7D3DF" strokeWidth="1" strokeDasharray="3 6" />
        {ticks.map((a) => (
          <rect key={a} x="-2" y={-r - 9} width="4" height="10" rx="1" fill="#B9AED8" transform={`rotate(${a})`} />
        ))}
      </g>
    </g>
  );
}

function InventorScene() {
  return (
    <>
      <g className="sc-layer sc-layer--far" stroke="#9FC8DD" strokeOpacity="0.08">
        {Array.from({ length: 17 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 100} 0 V900`} />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 100} H1600`} />
        ))}
      </g>
      <g className="sc-layer sc-layer--mid">
        <Gear x={1400} y={220} r={90} teeth={24} speed={60} />
        <Gear x={1265} y={330} r={48} teeth={14} speed={-34} opacity={0.4} />
        <Gear x={150} y={700} r={120} teeth={30} speed={80} opacity={0.35} />
        {/* a mechanical moon on a dotted orbit */}
        <ellipse cx="1400" cy="220" rx="190" ry="60" fill="none" stroke="#DDA7C6" strokeOpacity="0.35" strokeDasharray="2 8" />
        <g className="sc-orbit" style={{ transformOrigin: '1400px 220px' }}>
          <circle cx="1590" cy="220" r="10" fill="#30233D" stroke="#F6C8DD" strokeWidth="2" />
        </g>
      </g>
      <Spires y={860} />
    </>
  );
}

function ObservatoryScene() {
  return (
    <>
      <g className="sc-layer sc-layer--mid">
        {/* armillary sphere */}
        <g transform="translate(220 230)" opacity="0.7">
          <g className="sc-spin" style={{ animationDuration: '90s' }}>
            <ellipse rx="120" ry="120" fill="none" stroke="#D7D3DF" strokeWidth="2" />
            <ellipse rx="120" ry="38" fill="none" stroke="#B9AED8" strokeWidth="1.5" />
            <ellipse rx="38" ry="120" fill="none" stroke="#B9AED8" strokeWidth="1.5" />
            <ellipse rx="120" ry="38" fill="none" stroke="#DDA7C6" strokeWidth="1.5" transform="rotate(35)" />
          </g>
          <circle r="10" fill="#FFE3F0" />
          <path d="M0 120 V190 M-40 190 H40" stroke="#D7D3DF" strokeWidth="3" />
        </g>
      </g>
      {/* the observatory dome and its telescope */}
      <g className="sc-layer sc-layer--near">
      <g transform="translate(1340 900)">
        <path d="M-200 0 V-90 H200 V0 Z" fill="#1E1630" />
        <path d="M-160 -90 A160 140 0 0 1 160 -90 Z" fill="#2B2140" stroke="#B9AED8" strokeOpacity="0.5" />
        <path d="M-10 -228 L28 -232 L22 -90 L-4 -90 Z" fill="#170F1D" />
        <path d="M10 -150 L140 -300" stroke="#D7D3DF" strokeWidth="16" strokeLinecap="round" />
        <circle cx="140" cy="-300" r="12" fill="#FFE3F0" className="sc-pulse" />
      </g>
      </g>
      <Spires y={880} tone="#1B1428" />
    </>
  );
}

function Bloom({ x, y, h, hue, delay }) {
  return (
    <g transform={`translate(${x} 900)`}>
      <path className="sc-sway" style={{ animationDelay: `${delay}s` }} d={`M0 0 C -20 -${h * 0.4}, 20 -${h * 0.6}, 0 -${h}`} stroke="url(#sc-stem)" strokeWidth="3" fill="none" />
      <g transform={`translate(0 -${h})`} className="sc-pulse" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 -26 L12 -6 L0 14 L-12 -6 Z" fill={hue} opacity="0.85" />
        <path d="M0 -26 L12 -6 L0 -2 Z" fill="#FFF7FB" opacity="0.5" />
        <circle r="34" fill="url(#sc-glow)" opacity="0.5" />
      </g>
    </g>
  );
}

function GardenScene() {
  const blooms = [
    [80, 260, '#A6F0DA', 0], [170, 380, '#DDA7C6', 1.2], [260, 210, '#B9AED8', 0.4], [1330, 330, '#DDA7C6', 0.8],
    [1420, 230, '#A6F0DA', 1.6], [1520, 400, '#B9AED8', 0.2],
  ];
  return (
    <>
      <g className="sc-layer sc-layer--far">
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} className="sc-seed" style={{ animationDelay: `${i * 0.9}s` }} cx={120 + i * 105} cy={300 + ((i * 137) % 400)} r="3" fill="#FFF7FB" opacity="0.6" />
        ))}
      </g>
      <g className="sc-layer sc-layer--near">
        {blooms.map(([x, h, c, d]) => (
          <Bloom key={x} x={x} h={h} hue={c} delay={d} />
        ))}
      </g>
    </>
  );
}

function DaydreamScene() {
  return (
    <>
      <g className="sc-layer sc-layer--far" opacity="0.9">
        {/* the dream city: arches and domes */}
        <path
          d="M0 900 V760 H60 V700 Q90 650 120 700 V760 H200 V640 Q240 590 280 640 V760 H340 V720 H420 V600 Q470 520 520 600 V760 H600 V900 Z M1000 900 V740 H1080 V610 Q1130 540 1180 610 V740 H1260 V680 Q1300 640 1340 680 V740 H1420 V600 Q1460 560 1500 600 V760 H1600 V900 Z"
          fill="url(#sc-city)"
        />
      </g>
      <g className="sc-layer sc-layer--mid">
        {/* floating stages with spotlight beams */}
        {[
          [300, 520, 140],
          [1250, 470, 170],
        ].map(([x, y, w]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <g className="sc-float">
              <path d={`M${-w * 0.35} -260 L${-w / 2} 0 H${w / 2} L${w * 0.35} -260 Z`} fill="url(#sc-beam)" opacity="0.35" />
              <ellipse rx={w / 2} ry="14" fill="#30233D" stroke="#F6C8DD" strokeWidth="2" />
              <ellipse cy="6" rx={w / 2} ry="12" fill="none" stroke="#DDA7C6" strokeOpacity="0.4" />
            </g>
          </g>
        ))}
      </g>
      <path className="sc-ribbon" d="M-60 380 C 260 240, 560 520, 820 360 S 1340 220, 1660 400" fill="none" stroke="url(#sc-ribbon)" strokeWidth="3" />
      <path className="sc-ribbon sc-ribbon--slow" d="M-60 440 C 300 560, 600 300, 900 470 S 1400 560, 1660 330" fill="none" stroke="url(#sc-ribbon)" strokeWidth="1.5" />
    </>
  );
}

const SCENES = { home: HomeScene, inventor: InventorScene, observatory: ObservatoryScene, garden: GardenScene, daydream: DaydreamScene };

export default function Scenery({ world }) {
  const Scene = SCENES[world] ?? HomeScene;
  return (
    <svg className="scenery" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" focusable="false">
      <Defs />
      <Scene key={world} />
    </svg>
  );
}
