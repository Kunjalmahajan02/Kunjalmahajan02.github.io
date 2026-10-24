# Kunjal.exe — Her Little Universe

The personal portfolio of **Kunjal Mahajan**, AI & Data Science engineer and creative technologist.

**The Dreamscape** — an interactive, illustrated universe that happens to be a portfolio. Mini Kunjal, a character cut from Kunjal's own reference art, is a guide on every page: click or tap anywhere and she flies there, she changes pose and talks in each world, reacts when clicked, and can be tucked away.

| Place | What's there |
|---|---|
| **The opening** (`#/`) | A layered night scene — painted nebula, stars, vector floating architecture — with the bowed Kunjal.exe planet and the four worlds around it. Mini Kunjal sits on a crescent moon. A short version for recruiters sits below. |
| **01 · Inventor's Planet** (`#/inventor`) | Projects as blueprints: BlinkBridge AI (founder, ongoing), the Speech-to-Text & Translation Engine, ChainTrack, TB detection, the Inventory & Billing System and Hangman. Each opens a case study: problem, why it matters, approach, the system as a schematic, technologies, and what's next. BlinkBridge has a Morse "blink" toy; ChainTrack has an in-browser model of its contract rules. |
| **02 · Observatory Beyond** (`#/observatory`) | A telescope over a constellation of research interests, with an observation log for each. |
| **03 · Thought Garden** (`#/garden`) | Projects, research themes and tools as blooms, crystals and seeds joined by vines — only where the connection is real. |
| **04 · Daydream District** (`#/daydream`) | Dance, art, fashion and modeling on floating stages, with real credits from the résumé. |
| **Mission Control** (`#/about`) | Summary, education, skills, certifications, leadership, contact links, a terminal and the résumé. |

The **Résumé** button in the top bar always opens `public/resume/Kunjal_Mahajan_Resume.pdf`. There are four hidden secrets to find.

## Tech stack

- **React 18** + **Vite 5**, written in plain JavaScript (JSX)
- Hand-written CSS with design tokens (`src/styles/tokens.css`) — no UI framework, no animation library
- Scenery is hand-drawn **SVG** (sharp at any size); pointer parallax via CSS custom properties
- Character poses and illustrated planets are cut from `reference/reference-ui.webp`, upscaled 4× with Real-ESRGAN and cut out with u2net + GrabCut (`tools/make_dreamscape.py`); skies are procedurally painted by the same script. Images are never shown larger than their real pixels.
- Self-hosted fonts via Fontsource: Playfair Display, Caveat, Manrope, JetBrains Mono
- **Hash routing** (`#/inventor/blinkbridge`), so every route works on GitHub Pages without server rewrites
- **GitHub Actions** builds the site and deploys it to **GitHub Pages**

There is no backend, database, API key or paid service. The whole site is static files.

## Project structure

```
index.html                 Page shell, meta tags, social preview
vite.config.js             base: './' → relative asset paths (works on any Pages URL)
public/                    Copied as-is into the build
  dream/                   Mini Kunjal's poses, the world planets, painted skies
  art/                     Moodboard illustrations for Daydream District
  resume/                  Kunjal_Mahajan_Resume.pdf (replace to update)
  mascot/avatar.webp       Round avatar for the header
  favicon.png, apple-touch-icon.png, og-image.png
reference/reference-ui.webp  Kunjal's reference board — the source of every character illustration
src/
  main.jsx, App.jsx        Entry point and route table
  router.js                Tiny hash router (+ document titles)
  motion.js                Reduced-motion preference (OS setting + footer toggle)
  mascot.js                say()/discover() — how pages talk to Mini Kunjal; secrets
  data/                    ← All content lives here (edit these to update the site)
    profile.js             Summary, education, skills, certifications, links (from the résumé)
    worlds.js              The four worlds, their planets and Mini Kunjal's lines
    projects.js            Case studies (with evidence notes)
    research.js            Observatory topics (add papers/notes here)
    graph.js               Thought Garden nodes and edges
    creative.js            Daydream stages, credits (add photos here)
  components/              Mascot, DreamSky, Scenery, Header, WorldShell, Schematic, Terminal, …
  pages/                   Home, Inventor, ProjectCase, ObservatoryBeyond, ThoughtGarden, Daydream, MissionControl
  styles/                  tokens, base, dream
tools/
  make_dreamscape.py       Cuts out poses and planets, paints the skies
  make_art.py              Builds the moodboard crops from the reference board
  make_og.py               Rebuilds the social preview image
  check-dist.mjs           Post-build checks (relative paths, required assets, no secrets)
.github/workflows/deploy.yml  Build + deploy to GitHub Pages
```

## Prerequisites

- **Node.js 20 or newer** (CI uses Node 22) and npm
- **Git**
- Optional: **Python 3** with Pillow, OpenCV, NumPy, onnxruntime and `realesrgan-ncnn-py` — only to regenerate the artwork (`python tools/make_dreamscape.py`; upscaling runs on the GPU via Vulkan, and the open-source u2net model is downloaded once to `~/.u2net/`).

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

Because routes live after the `#`, refreshing or sharing a deep link such as `…/#/inventor/chaintrack` always works. GitHub Pages only ever serves `index.html`.

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

- **Résumé:** replace `public/resume/Kunjal_Mahajan_Resume.pdf` with the new PDF (same name), and update `src/data/profile.js` if details changed.
- **Contact links:** edit `links` in `src/data/profile.js`. Empty (`null`) links stay hidden.
- **A new project:** add an object to `projects.js` and add it to `graph.js` with its real connections.
- **A research paper or write-up:** push `{ title, venue, href }` into a topic's `papers` (or `notes`) in `research.js`. The empty state disappears on its own.
- **Mini Kunjal's lines:** each world's `enter` and `hint` lines are in `src/data/worlds.js`; her click reactions are in `src/components/Mascot.jsx`.
- **Creative photos:** put optimised images (about 1200px wide, `.webp`) in `public/creative/` and set `photo: 'creative/name.webp'` on that stage in `creative.js`. Use no leading slash.
- **Speech engine:** when its repository is public, add the link to `links` and change `evidence.level` to `'verified'` in `projects.js` after you check the details against the code.

## Content and honesty notes

- BlinkBridge AI and ChainTrack case studies were checked against their public repositories ([Blink-to-Morse](https://github.com/Kunjalmahajan02/Blink-to-Morse), [ChainTrack](https://github.com/Kunjalmahajan02/ChainTrack)).
- The Speech-to-Text & Translation Engine, TB detection, Inventory & Billing and Hangman projects have no public code yet; they are described from the résumé, labelled **"Not yet verified against code"**, and make no accuracy or production claims.
- No metrics, awards, papers or credits are invented. Starter Archive entries cite their source README.

## Accessibility and motion

- Every planet, star and graph node is a real link or button, reachable with Tab and activated with Enter or Space, with a visible focus ring.
- Planets have text names, and node types use different shapes as well as colours, so colour is never the only cue.
- Focus moves to the new page heading after navigation. A skip link is provided.
- Motion is slow and sparse. It switches off when the OS asks for reduced motion, or with the **Reduce motion** toggle in the footer.

## Credits

Every illustration — Mini Kunjal's room, the universe, the robot, the cat, the chibi stickers, desktop icons and moodboard images — comes from the reference board Kunjal supplied (`reference/reference-ui.webp`), processed by `tools/make_art.py`.
