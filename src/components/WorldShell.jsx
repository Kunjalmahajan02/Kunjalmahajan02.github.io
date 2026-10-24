import { worlds } from '../data/worlds.js';
import { href } from '../router.js';

const base = import.meta.env.BASE_URL;

// The frame every world shares: where you are, the world's planet, a way
// home, and the way onward to the neighbouring worlds.
export default function WorldShell({ world, title, lead, crumb, children }) {
  const i = worlds.findIndex((w) => w.id === world.id);
  const prev = worlds[(i - 1 + worlds.length) % worlds.length];
  const next = worlds[(i + 1) % worlds.length];

  return (
    <article className={`world world--${world.id}`}>
      <header className="world__head">
        <nav className="crumbs" aria-label="You are here">
          <a href={href()}>Universe</a>
          <span aria-hidden="true"> / </span>
          {crumb ? (
            <>
              <a href={href(world.id)}>{world.name}</a>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{crumb}</span>
            </>
          ) : (
            <span aria-current="page">{world.name}</span>
          )}
        </nav>
        <p className="world__index">
          WORLD {world.index} · {world.theme}
        </p>
        <h1 id="page-title" tabIndex={-1}>
          {title ?? world.name}
        </h1>
        {lead && <p className="world__lead">{lead}</p>}
        <img className="world__planet" src={`${base}dream/${world.planet.file}.webp`} alt="" width={world.planet.w} height={world.planet.h} />
      </header>

      <div className="world__body">{children}</div>

      <nav className="world__onward" aria-label="Other worlds">
        <a href={href(prev.id)}>
          <span>← World {prev.index}</span>
          {prev.name}
        </a>
        <a href={href()} className="world__home">
          Back to the universe
        </a>
        <a href={href(next.id)} className="world__next">
          <span>World {next.index} →</span>
          {next.name}
        </a>
      </nav>
    </article>
  );
}
