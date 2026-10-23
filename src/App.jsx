import { useEffect, useRef } from 'react';
import { go, useRoute } from './router.js';
import Starfield from './components/Starfield.jsx';
import Scene from './components/Scene.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Universe from './pages/Universe.jsx';
import AiLab from './pages/AiLab.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Observatory from './pages/Observatory.jsx';
import LivingSystem from './pages/LivingSystem.jsx';
import IdeaArchive from './pages/IdeaArchive.jsx';
import CreativeRealm from './pages/CreativeRealm.jsx';
import NotFound from './pages/NotFound.jsx';
import { projectById } from './data/projects.js';
import { planetById } from './data/planets.js';

function pageFor([section, sub]) {
  switch (section) {
    case undefined:
      return <Universe />;
    case 'lab':
      if (!sub) return <AiLab />;
      return projectById[sub] ? <ProjectDetail project={projectById[sub]} /> : <NotFound />;
    case 'observatory':
      return <Observatory topicId={sub} />;
    case 'system':
      return <LivingSystem nodeId={sub} />;
    case 'archive':
      return <IdeaArchive />;
    case 'creative':
      return <CreativeRealm />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  const route = useRoute();
  const [section, sub] = route;
  const pageKey = section === 'lab' ? `lab/${sub ?? ''}` : section ?? 'home';
  const first = useRef(true);
  const focus = planetById[section] ? section : null;

  // Lets CSS tell the overview from a destination (header, footer, veil).
  useEffect(() => {
    document.documentElement.dataset.view = section === undefined ? 'universe' : 'destination';
  }, [section]);

  // Escape always returns to the universe from a planet.
  useEffect(() => {
    if (!focus) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (e.target.closest?.('input, textarea, select')) return;
      go('');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus]);

  // On a real page change, start at the top and move focus to the new heading
  // so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById('page-title')?.focus({ preventScroll: true });
  }, [pageKey]);

  const skipToContent = (e) => {
    e.preventDefault();
    const target = document.getElementById('page-title') ?? document.getElementById('main');
    target?.focus();
  };

  return (
    <>
      <a className="skip-link" href="#main" onClick={skipToContent}>
        Skip to content
      </a>
      <Starfield />
      <Header current={section} />
      <Scene focus={focus} />
      <main id="main" tabIndex={-1} key={pageKey} className="page-enter">
        {pageFor(route)}
      </main>
      <Footer />
    </>
  );
}
