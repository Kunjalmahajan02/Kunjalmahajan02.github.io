# Kunjal.exe — Her Little Universe

The personal portfolio of **Kunjal Mahajan**, AI & Data Science engineer and creative technologist.

The home page is **Mini Kunjal's home**: an illustrated isometric floor map (bedroom, living room, coding corner and entrance) surrounded by a fairy-lit garden, drawn entirely in code. Three more rooms have their own scenes and buttons: the **dance room** (mirror wall, barre, disco ball and a karaoke corner), the **walk room** (a lit runway for rampwalk practice) and the **art room** (easel, florals, paint desk).

Mini Kunjal is a chibi version of Kunjal drawn from her portrait: long chestnut waves, burgundy sunglasses worn low, an off-shoulder black cardigan with pink stars and moons. She follows her daily routine in India time, and walks out of the front door when it's time for the dance, walk or art room. She sleeps, codes, reads, takes boba breaks with Mochi the cat, dances, sings karaoke, practises her rampwalk and paints. Visitors can:

- **click any room** and she walks there, through the doorways;
- use the **room buttons** (Home, Dance room, Walk room, Art room) to send her somewhere;
- **click furniture**: the laptop (projects), the bookshelf (research), the pinboard (opens the résumé PDF), the mailbox (contact), the mirror, runway and easel (creative);
- **pick an activity** from the bar under the scene, or **scrub the day** to watch her routine and the sky change from morning to night;
- find **four hidden secrets**.

Four apps open as retro windows over the apartment: **PROJECTS.EXE** (`#/projects`, with a case study per project at `#/projects/<id>`), **RESEARCH.TXT** (`#/research`), **CREATIVE.EXE** (`#/creative`) and **CONTACT.ME** (`#/contact`). Older addresses (`#/inventor/…`, `#/observatory/…`, `#/about`, …) redirect to their new homes.

## Tech stack

- **React 18** + **Vite 5**, written in plain JavaScript (JSX)
- The rooms and Mini Kunjal are drawn on a `<canvas>` with smooth vector shapes (`src/scene/`), rendered at screen resolution. There are no image assets for the scene.
- Hand-written CSS (`src/styles/site.css`). No UI framework, no animation library.
- Self-hosted fonts via Fontsource: Fredoka, Caveat, Manrope, JetBrains Mono
- **Hash routing** (`#/projects/blinkbridge`), so every route works on GitHub Pages without server rewrites
- **GitHub Actions** builds the site and deploys it to **GitHub Pages**

There is no backend, database, API key or paid service. The whole site is static files.

## Project structure

```
index.html                 Page shell, meta tags, social preview
vite.config.js             base: './' → relative asset paths (works on any Pages URL)
public/                    Copied as-is into the build
  art/                     Moodboard illustrations for CREATIVE.EXE
  resume/                  Kunjal_Mahajan_Resume.pdf (replace to update)
  favicon.png, apple-touch-icon.png, og-image.png
src/
  main.jsx, App.jsx        Entry point and route table
  router.js                Tiny hash router (+ document titles)
  motion.js                Reduced-motion preference (OS setting + top-bar toggle)
  mascot.js                say()/discover(): Mini Kunjal's speech bubble and the secrets
  scene/
    kit.js                 The isometric drawing kit (projection, furniture, plants, lamps, windows, garden, night lights)
    home.js                Home: bedroom, living room, coding corner, entrance
    rooms.js               The dance room, walk room and art room
    scenes.js              The scene list + walking routes between rooms
    kunjal.js              Mini Kunjal: poses and drawing
    routine.js             Her day in IST: activities, which scene and spot, lines, schedule
  data/                    ← All portfolio content (edit these to update the site)
    profile.js             Summary, education, skills, certifications, links (from the résumé)
    projects.js            Case studies (with evidence notes)
    research.js            Research topics (add papers/notes here)
    creative.js            Dance, art, fashion, modeling credits (add photos here)
  components/              Dollhouse (the apartment + controls), TopBar, Panel, AppWindow, Pipeline, MorsePlay, CustodySim, …
  windows/                 ProjectsApp, ResearchApp, CreativeApp, ContactApp
  styles/                  site.css, widgets.css
tools/
  render_house.mjs         Renders a scene to a PNG in Node (any hour / activity)
  make_og.py               Rebuilds the social preview image (uses render_house.mjs)
  make_art.py              Builds the moodboard crops from the reference board
  check-dist.mjs           Post-build checks (relative paths, required assets, no secrets)
.github/workflows/deploy.yml  Build + deploy to GitHub Pages
```

## Prerequisites

- **Node.js 20 or newer** (CI uses Node 22) and npm
- **Git**
- Optional: **Python 3** with Pillow, only to rebuild the link-preview image (`python tools/make_og.py`).

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

- **Résumé:** replace `public/resume/Kunjal_Mahajan_Resume.pdf` with the new PDF (same name), and update `src/data/profile.js` if details changed.
- **Contact links:** edit `links` in `src/data/profile.js`. Empty (`null`) links stay hidden.
- **A new project:** add an object to `projects.js`. To feature it on the home panel, add its id to `FEATURED` in `src/components/Panel.jsx`.
- **A research paper or write-up:** push `{ title, venue, href }` into a topic's `papers` (or `notes`) in `research.js`. The empty state disappears on its own.
- **Mini Kunjal's routine and lines:** the schedule and what she says during each activity are in `src/scene/routine.js`; her click reactions and secret lines are at the top of `src/components/Dollhouse.jsx`.
- **Creative photos:** put optimised images (about 1200px wide, `.webp`) in `public/creative/` and set `photo: 'creative/name.webp'` on that stage in `creative.js`. Use no leading slash.
- **Speech engine:** when its repository is public, add the link to `links` and change `evidence.level` to `'verified'` in `projects.js` after you check the details against the code.

## Content and honesty notes

- BlinkBridge AI and ChainTrack case studies were checked against their public repositories ([Blink-to-Morse](https://github.com/Kunjalmahajan02/Blink-to-Morse), [ChainTrack](https://github.com/Kunjalmahajan02/ChainTrack)).
- The Speech-to-Text & Translation Engine, TB detection, Inventory & Billing and Hangman projects have no public code yet; they are described from the résumé, labelled **"Not yet verified against code"**, and make no accuracy or production claims.
- No metrics, awards, papers or credits are invented. Mini Kunjal's routine is a playful illustration, not a real schedule.

## Accessibility and motion

- Every clickable thing in the apartment is a real button (Tab to it, Enter or Space to use it), with a visible focus ring and a text label. The activity bar and the time slider work from the keyboard too.
- The canvas has a text description of where Mini Kunjal is and what she's doing; her speech bubble is announced politely to screen readers.
- App windows are dialogs: focus moves to the window title, Escape closes them, and the page behind is inert. A skip link is provided.
- When the OS asks for reduced motion, or with the **Motion** toggle in the top bar, she stops walking and animating (she appears at her spot) and CSS animations switch off.

## Credits

The rooms and Mini Kunjal are drawn in code (`src/scene/`); Mini Kunjal is based on Kunjal's own portrait. The moodboard images in CREATIVE.EXE come from that reference board (`reference/reference-ui.webp`), processed by `tools/make_art.py`.
