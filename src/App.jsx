import { useEffect, useRef } from 'react';
import { go, href, useDocumentTitle, useRoute } from './router.js';
import { projectById } from './data/projects.js';
import { topicById } from './data/research.js';
import TopBar from './components/TopBar.jsx';
import Panel from './components/Panel.jsx';
import Dollhouse from './components/Dollhouse.jsx';
import AppWindow from './components/AppWindow.jsx';
import ProjectsApp from './windows/ProjectsApp.jsx';
import ResearchApp from './windows/ResearchApp.jsx';
import CreativeApp from './windows/CreativeApp.jsx';
import ContactApp from './windows/ContactApp.jsx';
import ResumeApp from './windows/ResumeApp.jsx';

// Addresses from earlier versions of the site keep working.
const ALIASES = {
  universe: '',
  lab: 'projects',
  inventor: 'projects',
  archive: 'projects',
  observatory: 'research',
  garden: 'research',
  system: 'research',
  daydream: 'creative',
  about: 'contact',
};

function resolve([section, sub, third]) {
  if (section === 'research' && sub === 'map') return ['research', third];
  if (section in ALIASES) {
    const to = ALIASES[section];
    if (!to) return [];
    return [to, ['lab', 'inventor', 'archive', 'observatory'].includes(section) ? sub : undefined];
  }
  return [section, sub];
}

function windowFor([section, sub]) {
  switch (section) {
    case undefined:
      return null;
    case 'projects':
      if (sub && !projectById[sub]) return <NotFound />;
      return <ProjectsApp project={projectById[sub]} />;
    case 'research':
      if (sub && !topicById[sub]) return <NotFound />;
      return <ResearchApp topicId={sub} />;
    case 'creative':
      return <CreativeApp />;
    case 'contact':
      return <ContactApp />;
    case 'resume':
      return <ResumeApp />;
    default:
      return <NotFound />;
  }
}

function NotFound() {
  useDocumentTitle('Not found');
  return (
    <AppWindow file="ERROR.TXT" title="This room doesn’t exist (yet)" tone="lilac">
      <p className="window__lead">The link may be old or mistyped. Mini Kunjal checked every room ♡</p>
      <a className="btn" href={href('')}>
        Back to the house
      </a>
    </AppWindow>
  );
}

export default function App() {
  const raw = useRoute();
  const route = resolve(raw);
  const [section] = route;
  const win = windowFor(route);

  useEffect(() => {
    if (raw[0] in ALIASES || (raw[0] === 'research' && raw[1] === 'map')) {
      window.history.replaceState(null, '', href(route.filter(Boolean).join('/')));
    }
  }, [raw, route]);

  // closing a window restores the title and hands focus back to the house
  const prevSection = useRef(section);
  useEffect(() => {
    const closed = prevSection.current && !section;
    prevSection.current = section;
    if (section) return;
    document.title = 'Kunjal.exe — Her Little Universe';
    if (closed) document.getElementById('dollhouse-title')?.focus({ preventScroll: true });
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
      <TopBar current={section} />
      <main id="main" tabIndex={-1} className="desk" inert={win ? '' : undefined} aria-hidden={win ? true : undefined}>
        <Panel />
        <Dollhouse onOpen={(to) => go(to)} />
      </main>
      <footer className="foot">
        <p>
          Every room drawn in code · <span className="hand">made with ♡ in Thane, Mumbai</span> · ©{' '}
          {new Date().getFullYear()} Kunjal Mahajan
        </p>
      </footer>
      {win}
    </>
  );
}
