# Kunjal.exe — Her Little Universe

The personal portfolio of **Kunjal Mahajan**, AI & Data Science engineer and creative technologist.

A dreamy, pink, illustrated portfolio built from Kunjal's own reference board: her room at night, an illustrated universe of planets, a Kunjal.exe OS desktop, project windows, a notebook and a moodboard. All the text, menus, tabs and the terminal are real HTML; the illustrations come from the reference board.

| Page | What's there |
|---|---|
| **Home** | Mini Kunjal's room with the glowing Kunjal.exe title, a working menu, and a short project log. |
| **Universe** | The illustrated planets — each one is a link (AI Lab, Language Nebula, Vision Station, Open Questions, Data Realm, Mission Control, Idea Archive, Creative Planet). |
| **Projects** | A project window with tabs (overview, how it works, tech stack, results, future scope) for BlinkBridge AI, the Speech-to-Text & Translation Engine and ChainTrack. "Try it" has a Morse blink toy and an in-browser model of ChainTrack's contract rules. |
| **Research** | "Open Questions" — a star map of research interests — and "Data Realm", a graph of how projects, tools and themes connect. |
| **Archive** | A pink notebook of project logs, concepts, lessons and future ideas, each linked to its source. |
| **Creative** | A moodboard gallery for dance, art, fashion and modeling (ready for real photos). |
| **Contact** | Kunjal.exe OS: desktop icons, a working terminal, System Info and contact links. |

## Tech stack

- **React 18** + **Vite 5**, written in plain JavaScript (JSX)
- Hand-written CSS with design tokens (`src/styles/tokens.css`). There's no UI framework.
- Illustrations are cut from `reference/reference-ui.webp`, cleaned of baked-in text and upscaled 4× with Real-ESRGAN (`tools/make_art.py`).
- Self-hosted fonts via Fontsource: Playfair Display (wordmark), Caveat (handwriting), Manrope (body), JetBrains Mono (terminal)
- **Hash routing** (`#/projects/blinkbridge`), so every route works on GitHub Pages without server rewrites
- **GitHub Actions** builds the site and deploys it to **GitHub Pages**

There is no backend, database, API key or paid service. The whole site is static files.

## Project structure

```
index.html                 Page shell, meta tags, social preview
vite.config.js             base: './' → relative asset paths (works on any Pages URL)
public/                    Copied as-is into the build
  art/                     Illustrations (room, universe, stickers, icons, moodboard) at several widths
  mascot/avatar.webp       Round avatar for the header
  favicon.png, apple-touch-icon.png, og-image.png
reference/reference-ui.webp  Kunjal's reference board — the source of every illustration
src/
  main.jsx, App.jsx        Entry point and route table
  router.js                Tiny hash router (+ document titles)
  motion.js, vibe.js       Reduced-motion preference; the "just vibe ♡" mode
  data/                    ← All content lives here (edit these to update the site)
    profile.js             Name, college, location, "currently", links
    worlds.js              Where each clickable planet sits in the universe artwork
    projects.js            Project case studies (with evidence notes)
    research.js            Research topics (add papers/notes here)
    graph.js               Data Realm nodes and edges
    archive.js             Idea Archive entries
    creative.js            Creative sections (add photos here)
  components/              Win (pink window), Art, Terminal, Pipeline, CustodySim, MorsePlay, …
  pages/                   Home, UniverseMap, Projects, Research, IdeaArchive, CreativeRealm, OsDesktop
  styles/                  tokens, base, pages
tools/
  make_art.py              Cleans and upscales the illustrations from the reference board
  make_og.py               Rebuilds the social preview image
  check-dist.mjs           Post-build checks (relative paths, required assets, no secrets)
.github/workflows/deploy.yml  Build + deploy to GitHub Pages
```

## Prerequisites

- **Node.js 20 or newer** (CI uses Node 22) and npm
- **Git**
- Optional: **Python 3** with Pillow, OpenCV, NumPy and `realesrgan-ncnn-py` — only to regenerate the artwork (`python tools/make_art.py`; it upscales on the GPU via Vulkan).

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

Because routes live after the `#`, refreshing or sharing a deep link such as `…/#/projects/chaintrack` always works. GitHub Pages only ever serves `index.html`.

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

Every illustration — Mini Kunjal's room, the universe, the robot, the cat, the chibi stickers, desktop icons and moodboard images — comes from the reference board Kunjal supplied (`reference/reference-ui.webp`), processed by `tools/make_art.py`.
