# yavuzertugrul.com

Personal site of Yavuz Ertuğrul — Jekyll, GitHub Pages compatible, no JS framework.
Built on the "Modernist" layout from the redesign handoff: visible rules, zero border
radius, sidebar navigation. Dark by default, with a light theme on a button.

**Information architecture:** posts, Medium pieces and short notes are ONE stream at
`/writing/`, sliced by eight topics. There is no separate Posts, Thoughts or Archive
page — `/posts/`, `/thoughts/` and `/archive/` redirect to `/writing/`.

This is a **fresh repository**. The previous repo must not be carried over as-is —
see [SECURITY.md](SECURITY.md).

---

## Running it

With Homebrew Ruby (`brew install ruby`, any 3.x/4.x):

```bash
bundle install
bundle exec jekyll serve      # http://localhost:4000
```

On macOS's stock system Ruby (2.6), Bundler cannot resolve modern gems — use the fallback
script instead, which runs a user-installed Jekyll directly:

```bash
./bin/serve
```

**Why the Gemfile doesn't use `github-pages`:** GitHub Pages' classic build ignores this
Gemfile entirely and builds server-side with its own pinned set (Jekyll 3.10, Ruby 3.3) —
the Gemfile exists only for local preview. The `github-pages` gem itself cannot install on
Ruby ≥ 4.0 (its `commonmarker` dependency caps Ruby at < 4.0), and older versions of it
crash at runtime (`liquid 4.0.3` → `tainted?` removed in Ruby 3.2). So the Gemfile mirrors
the parts of the Pages environment this site actually uses: `jekyll ~> 3.10`,
`kramdown-parser-gfm`, plus the stdlib gems (`csv`, `base64`, `bigdecimal`, `logger`) that
left Ruby's default set in 3.4+.

One environment note: Ruby Sass reads sources as US-ASCII unless the locale says otherwise,
and the stylesheet comments contain em dashes — a non-UTF-8 shell fails with
`Invalid US-ASCII character "\xE2"`. If you hit that:

```bash
export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
```

## Structure

```
_config.yml            collections (art), permalinks, defaults
_layouts/              default · page · post · note · topic · album · collection
_includes/             sidebar · topbar+menu · search pill · search dialog
                       lightbox · book-note · owner-box · tag · icon · site-footer
                       img (responsive <img>) · body (post/note body) · clip
_sass/                 _tokens · _base · _layout · _components · _pages
assets/css/main.scss   the only stylesheet
assets/js/             menu · search · tocspy · lightbox · booknote · owner · filters · clip
_posts/                ALL writing — long posts AND notes (`type: post|note`)
_art/                  sketch metadata (output: false — rendered on /sketches/)
_data/                 topics · books · albums · cv · nav · sitemap · home
                       images.json — written by bin/images, never by hand
writing.html           the stream;  writing/<topic>.html  one stub per topic
fonts/                 Inter (text) and Ioskeley Mono (code) woff2, subset by bin/fonts
_fonts-src/            the full fonts bin/fonts subsets from (not published)
images/                curated assets;  images/sized/  WebP copies from bin/images
bin/new                create an entry;  bin/sync-vault  mirror an Obsidian vault
bin/images · bin/clip · bin/fonts   the speed tools — see "Speed" below
_templates/            front-matter templates for post and note
search.json            build-time search index
atom.xml               everything;  feed-longform.xml  long-form only
```

### Type

Text and interface use the system stack from stephango.com
(`-apple-system, BlinkMacSystemFont, "Inter", …`): San Francisco on Apple devices, with
nothing to download, and self-hosted **Inter** (OFL 1.1) everywhere else. **Ioskeley Mono**
(OFL 1.1, github.com/ahatem/IoskeleyMono) sets code only. The site makes no third-party
font request. The files in `fonts/` are subsets (see "Speed"); the full originals stay in
`_fonts-src/`.

`--type-read` (running text), `--type-display` (page H1) and `--type-post` (post and note
H1) grow gently with the window and become fixed sizes on phones, at the end of
`_sass/_pages.scss`. `--type-hero` (About/Contact) and `--type-whoami` stay fixed. All of
them live in `_sass/_tokens.scss`.

### Design tokens

`_sass/_tokens.scss` keeps the structure of the handoff's `_ds/modernist-*/styles.css`.
The colours are Flexoki (stephango.com/flexoki): `:root` is the black theme and
`html[data-theme="paper"]` overrides it for the light one.

### Themes

Dark is the default for everyone, whatever the device is set to. Light is chosen with the
button beside the name (top bar on phones) and remembered in `localStorage`. An inline
script in `_layouts/default.html` applies the saved choice before the stylesheet, so the
page never flashes the wrong theme.

The change is a view transition: `assets/js/theme.js` paints two noisy masks once, and
`_sass/_theme.scss` slides them over the old and new page with the accent colour showing
through the gap. Browsers without view transitions, and visitors who ask for reduced
motion, get an instant switch. The moon and sun in `_includes/theme-icons.html` are
original drawings.

### Whoami scene

`_includes/horizon.html` holds the man and the rex as vector parts traced from the photo
that used to be on the page, and `assets/js/horizon.js` walks them with inverse kinematics
over a moving grid, so the planted foot stays on the floor. The scene stops when it is
off-screen and stands still under reduced motion. The rex stops growing on wide windows;
only the floor gets longer.

### Photography rule

Editorial / hero photos get the `.grayscale` wrapper. **Always in colour:** your own
artwork (sketches, gallery frames, thought images), book covers, and
technical diagrams / screenshots. On a post, set `image_color: true` in the front matter
to keep the hero in colour.

### CV

There is **no cv.pdf download** — owner decision. The CV exists only as the `/cv/` page,
which deliberately shows no phone number and no location (see SECURITY.md).

---

## Adding content

**A post** — `_posts/YYYY-MM-DD-slug.md`:

```yaml
---
title: Full title as published
short_title: Shorter title for list rows   # optional
date: 2025-01-16
type: post                                 # post | note
topic: robotics                            # one of the eight — drives the breadcrumb
tags: [Robotics, ROS2]                     # free-form, shown on the entry row
origin: medium                             # optional — adds the outline "medium" chip
description: One line for cards, search and social previews.
image: /images/post-10/Post_IMAGE.png
image_color: true                          # optional — skip the grayscale wrapper
hero: false                                # optional — the image is already the first figure
                                           #   of the body: keep it for the list thumbnail and
                                           #   social card, don't show it twice on the page
date_display: "—"                          # optional — for Medium posts with no known date
notes:                                     # optional — numbered end matter
  - Tested on ROS2 Humble.
related: [asr-research-test]               # optional — post slugs
---
```

The table of contents builds itself from the `##` / `###` headings — no config needed.

**A note** — same `_posts/` folder, shorter body:

```yaml
---
title: "Back to Routine"
date: 2025-03-18
type: note
topic: life
layout: note
image: /images/visual_thoughts/routine.png   # optional
parts:                                       # optional — labelled sections
  - label: Rejection
    text: …
---
Body text of the note.
```

Or just run `./bin/new note "Back to routine"` (or `./bin/new post "Title"`) — it writes
the file with today's date, a slug and the right front matter, then opens `$EDITOR`.

**Topics.** Every entry carries exactly one `topic:` from `_data/topics.yml`
(robotics · ai · power · linux · scraping · life · mind · notes), so the tile grid on
`/writing/` partitions the whole stream and its counts always add up. A topic is the
**subject**, not the type: a short note about AI goes under `ai`, next to the long AI
posts. Of the personal three, `life` is days, habits, health, films and games; `mind` is
thinking about thinking — purpose, patience, discipline; `notes` is gear, setups,
opinions and everything else. Each topic's `description` in that file is the filing rule.
Adding a topic = one entry in that file, a `writing/<slug>.html` stub, and a glyph in
`_includes/icon.html`.

**A sketch** — `_art/NN-slug.md`, front matter only:

```yaml
---
order: 9
title: Piece name
date: 2025-02-01
image: /images/sketch-library/file.jpg
category: Characters
span: feature | tall                       # optional mosaic span
position: 50% 30%                          # optional object-position
---
```

**A book** — add to `_data/books.yml`. **An album** — add to `_data/albums.yml`, then
create a stub page (`gallery/<collection>/<album>.html`) with `layout: album` and the two
slugs; four lines of front matter, no body.

---

## Speed

Images are most of a page's weight, so a visitor never downloads the original file when
a lighter one will look the same.

**After adding or changing images, run `./bin/images` and commit what it writes**
(`images/sized/` and `_data/images.json`). It makes WebP copies at 320 / 720 / 1440 px of
every cover, tile, hero and body image — never upscaled, and only what changed is redone.
`_includes/img.html` (templates) and `_includes/body.html` (post bodies) turn the index
into `srcset`, so each screen gets the smallest copy that is still sharp. The markdown is
never rewritten: keep writing `<img src="/images/…">` or `![](…)` as usual. Forgetting the
run costs speed, never correctness — an image missing from the index is served as the
original. `./bin/images --clean` also deletes copies nothing uses any more.

**Animated GIF → `./bin/clip images/…/name.gif`.** A screen-recording GIF is the heaviest
thing a page can carry (the pathfinding demo: 7.4 MB as GIF, 0.75 MB as MP4, and animated
WebP came out larger than the GIF). The script writes `name.mp4` and `name.poster.webp`
next to the GIF and prints the `{% include clip.html … %}` line to put where the `<img>`
was. The clip loops silently like the GIF, but downloads nothing until it scrolls near
and pauses off-screen; reduced-motion visitors get a play button instead.

**Fonts.** Apple devices download no text font at all. `./bin/fonts` rebuilds `fonts/` from
`_fonts-src/`, keeping only the OpenType features that are on by default. Ioskeley Mono
keeps Latin (with Turkish), Greek, punctuation, arrows, math and box drawing (94 KB → 66 KB
per weight). Inter keeps Latin, Greek letters and common punctuation (about 24 KB per
weight); if you change that set, change `$inter-range` in `_sass/_fonts.scss` to match.
Run it only after changing a font file or if a post needs a script outside those ranges.

The tools need Python 3 with `python3 -m pip install --user pillow fonttools brotli`, and
ffmpeg (`brew install ffmpeg`) for clips. GitHub Pages never runs them — their output is
committed.

---

## Interactions

| Behaviour | File |
| --- | --- |
| Mobile full-screen menu, scroll lock | `assets/js/menu.js` |
| ⌘K / Ctrl-K search over `search.json` | `assets/js/search.js` |
| TOC scroll-spy (IntersectionObserver) | `assets/js/tocspy.js` |
| Sketch / frame lightbox, zoom 50–300% | `assets/js/lightbox.js` |
| Book-note modal | `assets/js/booknote.js` |
| Sketch chip filtering, "Load more" | `assets/js/filters.js` |
| Owner mode | `assets/js/owner.js` |
| GIF-style clips: load near view, play on screen | `assets/js/clip.js` |
| Light/dark switch and its transition | `assets/js/theme.js` |
| Whoami scene | `assets/js/horizon.js` |

Every overlay closes on ESC and on backdrop click. Nothing scrolls the page on load.

### Owner mode — obscurity, not security

The per-post markdown download is hidden behind `localStorage.owner === '1'`, set by
visiting any page with `?owner=1` (or pressing **Shift+O** three times). `?owner=0` clears it.

**This is progressive disclosure, not authentication.** The site is static: anyone can read
the page source, flip the flag, and see the box. It only keeps owner-facing controls out of a
visitor's way. Anything genuinely private must never be committed to this repository at all.

---

## Content status

Everything from the old repository is migrated and now lives in one stream: **77 entries**
— 21 long-form posts, all with full bodies (old URLs such as `/Lidar_part_1` and `/WSL`
are kept via explicit `permalink:`; the 12 that first appeared on Medium carry the
outline "medium" chip), and 56 notes. Also **23 sketches** and **42 books**. All counts on
the site are computed from this content, so the topic tiles always add up.

Old individual thought URLs (`/thoughts/2024-03-19-pain` style) were **not** preserved —
those pages were broken on the old site (the layout rendered every thought on every page)
and nothing linked to them; notes now live at root-level `/<slug>` like every other entry.

## Still to do (owner)

- [ ] **Note excerpts** — the stream auto-truncates the note body for the one-line
      excerpt. Add a `description:` to any entry whose opening sentence reads badly
      cut off.
- [ ] **Sketch dates & categories** — all 23 pieces are in `_art/`; dates and the
      Characters/Pixel art/Scenes/Abstract taxonomy are placeholders (the 15 newly added
      ones are marked with a TODO comment). Set the real ones.
- [ ] **Books** — fill `rating:` (0–5) and `note:` per entry in `_data/books.yml` (they feed
      the book-note modal), fix the few `TODO(owner)` title/author guesses, and replace the
      two placeholder `want_to_read` lines.
- [ ] **Gallery** — replace the stand-in frames in `_data/albums.yml` with the real album
      photos and descriptions; build out the Gaming and AI Generated collections.

---

## Editor pipeline

The goal is arslan.io's "managing friction" argument: every step between writing and
publishing costs writing. The flow this repo is built for:

1. **Obsidian** holds the vault; **word-smith** (github.com/sadsnake1/word-smith) sits on
   top as the distraction-free editor. Entries are plain markdown with Jekyll front matter.
2. **Write inside the repository**, so there is no copy step. Do **not** symlink
   `_posts/` or `images/` to a folder outside it: git commits a symlink as a link, not the
   files behind it, so GitHub Pages would build the site with no posts at all. If you
   would rather keep the vault separate, `./bin/sync-vault ~/Obsidian/Site` mirrors
   `entries/` → `_posts/` and `images/` → `images/` before you commit.
3. **Publish = commit + push.** The obsidian-git plugin can do it on a timer; GitHub Pages
   builds. No local Jekyll run is needed for routine publishing.
4. `_templates/post.md` and `_templates/note.md` double as Obsidian Templater templates,
   so a new entry never means remembering front matter.

Templates and layouts are deliberately stable: writing should never require touching
layout code.

## Deploying

GitHub Pages builds the `main` branch of `yavuzCodiin/yavuzertugrul.com` (classic build,
custom domain from `CNAME`, HTTPS enforced). Publishing = pushing to `main`; the build
takes about a minute. Pages runs its own pinned Jekyll and ignores the Gemfile — that is
only for local preview (see "Running it") — and it never runs the `bin/` tools, so their
output must be committed.
