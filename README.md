# Nu Miracles of ROM

The independent project repository for the Nu Miracles of ROM website, pantheon, worlds, stories, Divine Toolbox, and Divine Council.

> **Canon note:** The name ROM is used without an expanded phrase.

## Project map

- `index.html` — website home
- `pantheon.html` and `gods-data.js` — the pantheon and its structured data
- `worlds.html` — the Five Societies and their shared civilization
- `stories.html` and `miracles.html` — story collections
- `numericals-story.html` — the 160-chapter Numerical Stories library
- `numericals-story-volume-01.html` through `numericals-story-volume-16.html` — sixteen ordered volumes, ten chapters each
- `tools.html`, `divine-engine.js`, `divine-systems.js` — Divine Toolbox
- `divine-council.html`, `divine-council.js`, `divine-debate.js` — Divine Council
- `divine-council-worker/` — optional Cloudflare Worker backend

## Numerical Stories

The active collection contains 160 chapters in canonical pantheon order, organized as 16 volumes of 10 chapters. The former Volume XVII page is retained as a legacy redirect/notice because its three stories were integrated into their proper numbered positions.

These are creative story drafts. They do not independently change canonical divine names, domains, genealogy, powers, allegiances, or unresolved questions.

## Running locally

This is a static website. Open `index.html` in a browser or serve the repository with any static HTTP server. The Worker backend is separate and requires deployment/configuration before its live features can operate.

## Deployment

The repository can be published with GitHub Pages from the `main` branch (root). Configure this in the repository's **Settings → Pages**.

## Project history

This repository is a new home for the project files recovered from the original repository's 160-story organized snapshot. See `MIGRATION-NOTES.md` for the source revision and migration scope.
