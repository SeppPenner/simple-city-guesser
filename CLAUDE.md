# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm ci                    # reproducible install from package-lock.json

npm run dev               # Vite dev server on http://localhost:5173 (alias: npm start)
npm run build             # production build into dist/ in the repository root
npm run preview           # serve the production build on http://localhost:4173
```

Vite 8 and `@vitejs/plugin-react` 6 need Node.js `^20.19.0` or `>=22.12.0`.

There are no tests, no linter and no formatter. Verify a change with `npm run build` and by playing
a round in `npm run dev`.

`vite.config.js` sets `root: 'src'` and `outDir: '../dist'`. Because the output folder lies outside
the Vite root, Vite does not empty it before a build (it warns `Use --emptyOutDir to override`), so
old hashed bundles pile up in `dist/`. Delete `dist/` or run `npm run build -- --emptyOutDir` for a
clean build. `dist/` is gitignored.

Dependencies are updated by hand with npm (`npm outdated`, `npm update`, `npm audit`), there is no
update script. The `overrides` entry in `package.json` forces `d3-color` 3.1.0 or newer for the d3
packages that `react-simple-maps` pulls in, older versions have a ReDoS vulnerability. Keep it.

## Architecture Overview

Simple City Guesser is a single page React 19 game: it names a country, the player types its
capital, and correctly guessed capitals turn green on a world map. There is no backend, no
persistence and no router, the whole state lives in `App.jsx` and is lost on reload.

### Project Structure

- **src/index.html** - HTML template with the global styles and a Content Security Policy meta tag
- **src/index.jsx** - entry point, renders `App` inside `React.StrictMode`
- **src/App.jsx** - the whole game: state, answer check, map and UI, styled with inline style objects
- **src/capitals.js** - the game data, an array of `{ city, country, coordinates }` with
  `coordinates` as `[longitude, latitude]`
- **src/world-data.json** - a placeholder topology with a single world polygon, referenced nowhere
- **vite.config.js** - Vite with the React plugin, root `src`, output `../dist`

### Game Logic

- The map is drawn with `react-simple-maps` (`ComposableMap` with `geoMercator`). The country shapes
  are loaded at runtime from `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`, so
  they need network access to jsDelivr.
- A guess is correct when it equals `city` after `toLowerCase()` and `trim()`. There are no
  alternative spellings and no accent folding, the spelling in `capitals.js` is the only accepted
  answer.
- `city` is the identity of an entry: guessed entries are removed from the remaining list by
  `city`, and the map markers use it as React key. City names have to stay unique.
- A wrong guess shows the right answer and moves on after two seconds, the country stays in the
  pool. A correct guess moves on after one second.

### Content Security Policy

`src/index.html` restricts loading with a CSP meta tag: scripts and styles only from the own origin
(plus inline), `connect-src` additionally `https://cdn.jsdelivr.net` for the map data, images only
from the own origin and `data:`. A new external resource (font, API, map data) needs an entry there,
otherwise the browser blocks it.

## Claude Code Conventions

### Commit Messages
- All commit messages must be written in **English**
- Short subject in the imperative, like the existing history (`Update npm patch dependencies`)

### German Umlauts
- German text anywhere in this repository must use **real umlauts**: `ä ö ü Ä Ö Ü ß`
- Never transliterate them as `ae oe ue ss` (no `Gueltigkeit`, `ueberschreiben`, `Uebersicht`)
- Applies to everything: documentation, scripts, code comments, UI text, error messages and
  commit message bodies
- If umlauts arrive garbled somewhere, fix the encoding instead of rewriting the words: write files
  as UTF-8, use `git commit -F <utf8-file>` instead of `-m`, and `-Encoding utf8` for PowerShell output

### Versioning / Tags
- Version format is always `1.0.0` (without `v` prefix), not `v1.0.0`

### Plans
- Implementation plans are stored in the `/plans` directory, create it with the first plan

## Windows Compatibility

- **Reserved filenames**: Never create files with Windows reserved names (nul, con, prn, aux, com1-9, lpt1-9). These are invalid on Windows.

**⚠️ IMPORTANT**: Never amend existing commits (`git commit --amend`). Always create new commits instead.
