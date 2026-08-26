# Security & hygiene

Carried over from the audit of the previous repository
(`yavuzCodiin/yavuzcodiin.github.io`). GitHub Pages serves **everything** in a repo
publicly, and git history keeps deleted files retrievable — which is why this is a fresh
repo rather than a cleanup of the old one.

## What must never land here

| | |
| --- | --- |
| Personal research PDFs | `Genel duzenleme arastirma inceleme.pdf` (~33 MB) was publicly downloadable. Keep research notes out of the site repo entirely. |
| Virtualenvs | The old `website/` directory held a full Python venv (1000+ files). `.gitignore` covers `website/`, `.venv/`, `venv/`, `env/`. |
| A second email address | The old `_config.yml` leaked a gmail address while the site advertised the protonmail one. This repo publishes **one** address: `site.author.email`. |
| The CV with a phone number | The newest CV PDF contains a personal phone number. **No CV PDF is published at all** (owner decision — there is no download button); `/cv/` deliberately shows **no phone and no location**. If a PDF is ever added later, export it without the phone number first. |
| Loose root images | Migrate only what the design uses, into `images/`. |
| Broken analytics | The old `_includes/analytics.html` shipped dead Universal Analytics reading an undefined config key. No analytics ship here. Add GA4 or a privacy-light alternative (GoatCounter, Plausible) deliberately if you want one. |

## Old repository

Items 1–2 above are also in the **history** of the old repo, so deleting the files there is
not enough. Either rewrite history (`git filter-repo`) and force-push, or — simpler — archive
or delete that repository once this one is live, so the PDF and venv stop being reachable.

## Owner mode is not authentication

The `?owner=1` / `localStorage.owner` flag that reveals the markdown-download box is
progressive disclosure only. On a static site it is trivially bypassed by reading the page
source. Treat everything committed here as public, permanently.

---

## Pre-publication audit — 2026-08-26

Run against the working tree before the first push. Method and result:

| Check | Result |
| --- | --- |
| Secrets (API keys, tokens, passwords, private keys, `BEGIN … PRIVATE KEY`) | **none** — every "token" hit was a CSS design token |
| Phone numbers (`+90`, `05xx…`) | **none** anywhere, including the built site |
| Email addresses | **one**: `yavuz_ertugrul@protonmail.com`. The old repo's gmail address does not appear |
| Image GPS coordinates | **none** — all 309 images decoded, no GPS IFD carries a coordinate |
| Image metadata (EXIF / XMP / IPTC) | **stripped from 46 files.** One real leak was found and removed: `images/post-10/Share_Post_Image.png` carried `xmp:CreatorTool = "Canva (Renderer) doc=… user=UAFbLrFN5jE"` — a Canva account and document id |
| Third-party scripts / analytics | **none** |
| Third-party font CDN | **removed.** Google Fonts was still being requested on every page (297 references) even though Ioskeley Mono is self-hosted; every visitor's IP was going to Google. The `<link>` is gone and the two first-paint weights are preloaded from `/fonts/` |
| Forbidden files (PDF, `.env`, keys, venvs, `node_modules`, prototypes) | **none tracked** |
| Design-handoff folders | outside the repo, and ignored by pattern anyway |
| Largest tracked file | 7.4 MB (`images/post-1/pathfinding_demo.gif`) — well under GitHub's 50 MB warning |
| Tracked total | ~169 MB across 496 files |

Metadata stripping is lossless: JPEG APP1/APP13/COM segments and PNG text/eXIf chunks
are dropped without re-encoding, and every file's decoded dimensions were compared
before and after. ICC colour profiles are deliberately kept.

`.gitignore` was hardened and live-tested: `.env`, `private/`, `*.pdf`, `id_rsa` and
friends are all ignored. Re-run the test any time with:

```bash
printf 'X=1\n' > .env && git status --short --untracked-files=all | grep -c '\.env'   # → 0
rm .env
```

### Judgement calls left to the owner

These are yours to publish or not — all of it is your own writing, already public on
the old site:

- **Health mentions.** `_posts/2025-03-03-psoriasis.md` names a diagnosis, and
  `2024-03-21-burden.md` touches family loss. Nothing else in the corpus does.
- **City-level work locations.** `/cv/` shows "Istanbul, Türkiye" on the two employment
  entries (the handoff specs that grey location line) and "Northern Cyprus" for the
  university. The *contact line* carries no location, as required.
- **`repository:` in `_config.yml`** still points at the old repo, so owner-mode's
  `post.md ↓` links resolve to the wrong place. Update it when the new repo exists.
