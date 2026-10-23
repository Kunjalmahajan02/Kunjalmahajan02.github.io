import { useEffect, useRef } from 'react';
import { useRoute } from './router.js';
import Starfield from './components/Starfield.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import UniverseMap from './pages/UniverseMap.jsx';
import Projects from './pages/Projects.jsx';
import Research from './pages/Research.jsx';
import IdeaArchive from './pages/IdeaArchive.jsx';
import CreativeRealm from './pages/CreativeRealm.jsx';
import OsDesktop from './pages/OsDesktop.jsx';
import NotFound from './pages/NotFound.jsx';

// Addresses from the earlier version of the site keep working.
const ALIASES = { lab: 'projects', observatory: 'research', system: 'research' };

function resolve([section, sub]) {
  if (section in ALIASES) return [ALIASES[section], section === 'system' ? 'map' : sub];
  return [section, sub];
}

function pageFor([section, sub]) {
  switch (section) {
    case undefined:
      return <Home />;
    case 'universe':
      return <UniverseMap />;
    case 'projects':
      return <Projects projectId={sub} />;
    case 'research':
      return <Research sub={sub} />;
    case 'archive':
      return <IdeaArchive />;
    case 'creative':
      return <CreativeRealm />;
    case 'contact':
      return <OsDesktop />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  const raw = useRoute();
  const route = resolve(raw);
  const [section] = route;
  const first = useRef(true);

  // Rewrite old addresses in place so the URL matches what's shown.
  useEffect(() => {
    if (raw[0] in ALIASES) window.history.replaceState(null, '', `#/${route.filter(Boolean).join('/')}`);
  }, [raw, route]);

  // On a page change, start at the top and move focus to the new heading.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById('page-title')?.focus({ preventScroll: true });
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
      <Starfield />
      <Header current={section ?? ''} />
      <main id="main" tabIndex={-1} key={section ?? 'home'} className="page-enter">
        {pageFor(route)}
      </main>
      <Footer />
    </>
  );
}
