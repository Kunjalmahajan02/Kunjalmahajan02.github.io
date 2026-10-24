import { href, useDocumentTitle } from '../router.js';

const base = import.meta.env.BASE_URL;

export default function NotFound() {
  useDocumentTitle('Lost in space');
  return (
    <section className="lost">
      <img src={`${base}mascot/avatar.webp`} alt="" width="120" height="120" />
      <p className="world__index">SIGNAL LOST · 404</p>
      <h1 id="page-title" tabIndex={-1}>
        This orbit is empty.
      </h1>
      <p>There’s nothing at this address — maybe it drifted off. Let’s head back.</p>
      <a className="btn btn--moon" href={href()}>
        Return to the universe
      </a>
    </section>
  );
}
