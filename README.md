# Kunjal.exe — Her Little Universe

The personal portfolio of **Kunjal Mahajan**, AI & Data Science engineer and creative technologist.

The site is a small, explorable solar system. The planets are the navigation: each one is a link to a part of the work, and Mini Kunjal, the mascot, acts as the guide.

| Planet | What's there |
|---|---|
| 01 · **AI Lab** | Case studies for BlinkBridge AI, the Speech-to-Text & Translation Engine, and ChainTrack, each with a workflow diagram you can step through. ChainTrack also has an in-browser simulation of the contract's rules. |
| 02 · **Research Observatory** | A constellation of six research interests. Select a star to see related projects and future write-ups. |
| 03 · **The Living System** | An interactive graph of projects, technologies and research themes, linked only where the connection is real. |
| 04 · **The Idea Archive** | Notebook pages: project logs, concepts, lessons and future ideas, plus a small terminal that can navigate the site. |
| 05 · **Creative Realm** | Dance, art, fashion and modeling, with a gallery ready for photos. |

## Tech stack

- **React 18** + **Vite 5**, written in plain JavaScript (JSX)
- Hand-written CSS with design tokens (`src/styles/tokens.css`). There's no UI framework.
- SVG and CSS for the planets, orbits, constellation and graph. There's no 3D or animation library.
- Self-hosted fonts via Fontsource: Fraunces (display), Manrope (body), JetBrains Mono (labels)
- **Hash routing** (`#/lab/blinkbridge`), so every route works on GitHub Pages without server rewrites
- **GitHub Actions** builds the site and deploys it to **GitHub Pages**

There is no backend, database, API key or paid service. The whole site is static files.

## Project structure

```
index.html                 Page shell, meta tags, social preview
vite.config.js             base: './' → relative asset paths (works on any Pages URL)
public/                    Copied as-is into the build
  mascot/                  Mini Kunjal cutout (webp + png, 1x/2x) and round avatar
  favicon.png, apple-touch-icon.png, og-image.png
reference/reference-ui.webp  Original reference artwork the mascot is cut from
src/
  main.jsx, App.jsx        Entry point and route table
  router.js                Tiny hash router (+ document titles)
  motion.js                Reduced-motion preference (OS setting + footer toggle)
  data/                    ← All content lives here (edit these to update the site)
    profile.js             Name, intro, links
    planets.js             The five planets: names, colours, orbit positions
    projects.js            AI Lab case studies (with evidence notes)
    research.js            Observatory topics (add papers/notes here)
    graph.js               Living System nodes and edges
    archive.js             Idea Archive entries
    creative.js            Creative Realm sections (add photos here)
  components/              SolarSystem, PlanetArt, Mascot, FlowDiagram, CustodySim, Terminal, …
  pages/                   One file per destination
  styles/                  tokens, base, universe (home), destinations
tools/
  make_mascot.py           Rebuilds the mascot assets from the reference artwork
  make_og.py               Rebuilds the social preview image
  check-dist.mjs           Post-build checks (relative paths, required assets, no secrets)
.github/workflows/deploy.yml  Build + deploy to GitHub Pages
```

## Prerequisites

- **Node.js 20 or newer** (CI uses Node 22) and npm
- **Git**
- Optional: **Python 3** with Pillow, OpenCV and NumPy, but only if you want to regenerate the mascot or social image

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build      # outputs static files to dist/
npm run check      # verifies dist/ is safe for GitHub Pages
npm run preview    # serves dist/ locally to try the production build
```

## Base path: user site vs. project site

`vite.config.js` uses `base: './'`, so every asset URL in the build is **relative**. The same build works unchanged at either address:

- **User site:** repository named exactly `Kunjalmahajan02.github.io` → `https://kunjalmahajan02.github.io/`
- **Project site:** any other repository name, e.g. `kunjal-universe` → `https://kunjalmahajan02.github.io/kunjal-universe/`

Because routes live after the `#`, refreshing or sharing a deep link such as `…/#/lab/chaintrack` always works. GitHub Pages only ever serves `index.html`.

The one place that benefits from an absolute URL is the social preview. Once you know the final address, change the two `og-image.png` lines in `index.html` to the full URL (for example `https://kunjalmahajan02.github.io/og-image.png`) and add `<meta property="og:url" content="…">`. Link previews on LinkedIn, WhatsApp and similar sites need absolute image URLs.

## Publish to GitHub Pages

1. **Create the repository** on GitHub (github.com → New repository). For the main address, name it `Kunjalmahajan02.github.io`. Leave it empty, without a README or license.
2. **Push this folder** (run these in the project folder):
   ```bash
   git init
   git add .
   git commit -m "Kunjal.exe — Her Little Universe"
   git branch -M main
   git remote add origin https://github.com/Kunjalmahajan02/Kunjalmahajan02.github.io.git
   git push -u origin main
   ```
   Replace the repository name in the URL if you chose a different one.
3. **Turn on Pages with Actions:** in the repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. **Deploy:** the push in step 2 already started the workflow. If it ran before step 3 and failed, open **Actions → Deploy to GitHub Pages → Run workflow** (or push any commit).
5. **Visit the site** at the URL shown in the workflow's *deploy* step, or under **Settings → Pages**.

### Where to find deployment logs

**Actions** tab → **Deploy to GitHub Pages** → the latest run. The *build* job shows install/build/check output; the *deploy* job shows the published URL.

### Common deployment problems

| Symptom | Fix |
|---|---|
| Workflow fails at *Deploy* with "Pages not enabled" / 404 | Settings → Pages → Source must be **GitHub Actions**, then re-run the workflow. |
| `npm ci` fails: lockfile missing or out of sync | Run `npm install` locally, commit `package-lock.json`, push again. |
| Site loads but is unstyled / images missing | Make sure `base: './'` is still in `vite.config.js` and run `npm run check`; it flags root-relative paths. |
| Deploy blocked by "environment protection rules" | Settings → Environments → `github-pages` → allow the `main` branch. |
| Old version still showing | Wait a minute and hard-refresh (Ctrl+Shift+R). Pages caches for a short time. |
| 404 at the URL | User sites need the repository named exactly `<username>.github.io`. Otherwise the URL includes `/<repo>/`. |

## Updating the portfolio later

Almost everything is data in `src/data/`. Edit, run `npm run dev` to check, then commit and push to `main`. The site redeploys automatically.

- **Contact links:** fill `linkedin`, `email` or `resume` in `src/data/profile.js`. Empty (`null`) links stay hidden.
- **A new project:** add an object to `projects.js` and add it to `graph.js` with its real connections.
- **A research paper or write-up:** push `{ title, venue, href }` into a topic's `papers` (or `notes`) in `research.js`. The empty state disappears on its own.
- **Archive notes:** append to `entries` in `archive.js`. Empty categories show an empty state.
- **Creative photos:** put optimised images (about 1200px wide, `.webp`) in `public/creative/` and list them in `creative.js` as `{ src: 'creative/name.webp', alt: '…' }`. Use no leading slash.
- **Speech engine:** when its repository is public, add the link to `links` and change `evidence.level` to `'verified'` in `projects.js` after you check the details against the code.

## Content and honesty notes

- BlinkBridge AI and ChainTrack case studies were checked against their public repositories ([Blink-to-Morse](https://github.com/Kunjalmahajan02/Blink-to-Morse), [ChainTrack](https://github.com/Kunjalmahajan02/ChainTrack)).
- The Speech-to-Text & Translation Engine has no public code yet, so the site labels it **"Not yet verified against code"** and makes no accuracy or production claims.
- No metrics, awards, papers or credits are invented. Starter Archive entries cite their source README.

## Accessibility and motion

- Every planet, star and graph node is a real link or button, reachable with Tab and activated with Enter or Space, with a visible focus ring.
- Planets have text names, and node types use different shapes as well as colours, so colour is never the only cue.
- Focus moves to the new page heading after navigation. A skip link is provided.
- Motion is slow and sparse. It switches off when the OS asks for reduced motion, or with the **Reduce motion** toggle in the footer.

## Credits

Mini Kunjal is cut from the reference illustration Kunjal supplied (`reference/reference-ui.webp`) by `tools/make_mascot.py`.
