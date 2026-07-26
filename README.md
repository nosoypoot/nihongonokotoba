# Nihongo no Kotoba

An offline vocabulary app built around spaced repetition and contextual
understanding. The first course teaches Japanese, but the content format is
language-neutral, so adding another language does not require changing the engine.

Runs on Android, iOS, and the browser, and keeps working with no network once
installed. The interface itself is in Spanish.

## Principles

- Works without internet after installation.
- No points, streaks, or synthetic rewards.
- The word, its structure, and its usage are the center of the experience.
- Progress is stored separately from content, so updating a course never erases
  learning history.
- Packs never claim affiliation with commercial books or courses.

## How studying works

A focused practice draws due cards first, then introduces at most five unseen
words from a single lesson. The learner reveals the answer and self-rates it:
`Recordé`, `No recordé`, or `Recordé mal` (remembered, forgot, misremembered).
Only the post-reveal confirmation changes the FSRS schedule, but both signals are
kept in an append-only attempt history.

A forgotten word returns after two intervening cards. FSRS owns the longer-term
schedule with 90% desired retention. Three completed focused practices make a
lesson eligible for cumulative review.

## Development

Requires Node.js 20 or newer, plus Expo Go to test on a phone.

```bash
npm install
npm run validate:content
npm test
npm start
```

Scan the QR code with Expo Go on Android. On macOS you can also run `npm run ios`
to open the iPhone simulator without owning a physical iPhone, or `npm run web`
for the browser build.

Full checks:

```bash
npm run validate:content
npm run lint
npm run typecheck
npm test
```

## Structure

```text
app/           Expo Router screens
src/features/  user flows and hooks
src/ui/        components and visual tokens
src/data/      per-platform storage and repositories
src/core/      content contracts, FSRS adapter, pure session state
content/       content packs bundled at build time
tools/         pack validation
```

Dependencies flow `app → features → data → core`, and the linter enforces it.
`src/core` is pure logic: it does not import React Native, Expo, or SQLite.

Android and iOS store data in Expo SQLite, with a disposable `content.db` and a
durable `progress.db`. The web build uses IndexedDB through `idb` behind the same
repository contracts.

## Web deployment

```bash
export CLOUDFLARE_ACCOUNT_ID=<your-account-id>
npm run deploy:web
```

`npm run build:web` produces only the static bundle in `dist/`.

## Content

Every pack declares authorship, license, source notes, Spanish and English
meanings, and stable IDs. The basic Japanese pack and the Yucatec Maya fixture are
CC0-1.0; the Japanese study notes are CC-BY-4.0. Check the license declared inside
a pack before reusing its content.

The Yucatec Maya pack exists only to prove the core is not tied to Japanese. It is
a schema fixture, not a publishable course.

## Documentation

- `CONTRIBUTING.md` — how to contribute code and content
- `DESIGN.md` — design system and visual decisions
- `docs/architecture.md` — layers, storage, and card identity
- `docs/content-sources.md` — content provenance and publishing rules
- `docs/roadmap.md` — what is done and what comes next
- `docs/security.md` — dependency and data posture

## License

Code is MIT licensed (see `LICENSE`). Content uses the license declared in each
pack.
