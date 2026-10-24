import { useCallback, useEffect, useRef } from 'react';
import { useRoute } from './router.js';
import { say } from './mascot.js';
import { worldById, mission } from './data/worlds.js';
import DreamSky from './components/DreamSky.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Mascot from './components/Mascot.jsx';
import Home from './pages/Home.jsx';
import Inventor from './pages/Inventor.jsx';
import ProjectCase from './pages/ProjectCase.jsx';
import ObservatoryBeyond from './pages/ObservatoryBeyond.jsx';
import ThoughtGarden from './pages/ThoughtGarden.jsx';
import Daydream from './pages/Daydream.jsx';
import MissionControl from './pages/MissionControl.jsx';
import NotFound from './pages/NotFound.jsx';
import { projectById } from './data/projects.js';

// Addresses from earlier versions of the site keep working.
const ALIASES = {
  universe: [''],
  lab: ['inventor'],
  projects: ['inventor'],
  research: ['observatory'],
  system: ['garden'],
  archive: ['inventor'],
  creative: ['daydream'],
  contact: ['about'],
};

function resolve([section, sub, third]) {
  if (section === 'research' && sub === 'map') return ['garden', third];
  if (section in ALIASES) {
    const [to] = ALIASES[section];
    return to === '' ? [] : [to, ['lab', 'projects', 'research', 'system'].includes(section) ? sub : undefined];
  }
  return [section, sub];
}

function pageFor([section, sub]) {
  switch (section) {
    case undefined:
      return <Home />;
    case 'inventor':
      if (!sub) return <Inventor />;
      return projectById[sub] ? <ProjectCase project={projectById[sub]} /> : <NotFound />;
    case 'observatory':
      return <ObservatoryBeyond topicId={sub} />;
    case 'garden':
      return <ThoughtGarden nodeId={sub} />;
    case 'daydream':
      return <Daydream />;
    case 'about':
      return <MissionControl />;
    default:
      return <NotFound />;
  }
}

const GREETING = 'hey, you found my little universe ♡ click anywhere and i’ll follow you.';

export default function App() {
  const raw = useRoute();
  const route = resolve(raw);
  const [section] = route;
  const world = worldById[section];
  const first = useRef(true);
  const pageKey = section === 'inventor' ? `inventor/${route[1] ?? ''}` : section ?? 'home';

  useEffect(() => {
    if (raw[0] in ALIASES || (raw[0] === 'research' && raw[1] === 'map')) {
      window.history.replaceState(null, '', `#/${route.filter(Boolean).join('/')}`);
    }
  }, [raw, route]);

  // On a page change: start at the top, move focus to the heading, and let
  // Mini Kunjal introduce where we are.
  useEffect(() => {
    document.documentElement.dataset.world = world?.id ?? (section === 'about' ? 'about' : 'home');
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById('page-title')?.focus({ preventScroll: true });
    if (world) say(world.enter, world.pose);
    else if (section === 'about') say(mission.enter, mission.pose);
    else if (section === undefined) say('back home ✦ pick a world, or click anywhere and i’ll follow.', 'hello');
  }, [pageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Where she rests: on the crescent moon at home, in a corner elsewhere.
  const restSpot = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (section === undefined && vw >= 1000) {
      const moon = document.querySelector('.crescent');
      if (moon) {
        const r = moon.getBoundingClientRect();
        if (r.width) return { x: r.left + r.width * 0.5, y: Math.min(r.top + r.height * 0.36, vh - 8) };
      }
      return { x: Math.max(110, vw * 0.12), y: vh - 30 };
    }
    return { x: vw, y: vh - 6 }; // clamped to the bottom-right corner
  }, [section]);

  const skipToContent = (e) => {
    e.preventDefault();
    (document.getElementById('page-title') ?? document.getElementById('main'))?.focus();
  };

  return (
    <>
      <a className="skip-link" href="#main" onClick={skipToContent}>
        Skip to content
      </a>
      <DreamSky world={world?.id ?? 'home'} />
      <Header current={section === undefined ? '' : section} />
      <main id="main" tabIndex={-1} key={pageKey} className="page-enter">
        {pageFor(route)}
      </main>
      <Footer />
      <Mascot restSpot={restSpot} restPose={world?.pose ?? (section === 'about' ? 'think' : 'hello')} greeting={GREETING} />
    </>
  );
}
