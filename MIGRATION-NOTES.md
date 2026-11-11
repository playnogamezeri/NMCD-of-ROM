# Migration notes

This repository was initialized as a separate project home on 2026-11-10.

## Source snapshot

Project files were recovered from `playnogamezeri/nu-miracles-of-rom`, commit `c5c75dbe53315fdbe0947039fff09bd7ba59126c`, the organized 160-story snapshot immediately before subsequent commits removed collaborator-created sections from the original repository.

The migration includes the website, 160-entry pantheon data, all 16 active Numerical Story volumes, the legacy Volume XVII notice, Divine Toolbox, Divine Council, and the Cloudflare Worker source.

## Numerical Stories

The active collection contains 160 chapters in canonical order: 16 volumes × 10 chapters. The former Volume XVII page is retained as a legacy notice explaining where its three stories were integrated.

## Notes

- The new README replaces the old README to avoid an incorrect expansion of the name ROM.
- Historical collaborator notes are retained under `archive/` because their workflow guidance may no longer be current.
- The original repository was not modified by this migration.
- Cloudflare Worker deployment and secret configuration remain separate deployment tasks.
