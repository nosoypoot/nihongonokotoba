# Contributing

Thanks for your interest. This is a vocabulary study app that works without a
network connection. Before writing code, read `AGENTS.md`, `DESIGN.md`, and
`docs/architecture.md` — they describe boundaries the linter enforces, not
suggestions.

Note that the application interface is written in Spanish. Code, comments, and
documentation are in English; user-facing strings and content packs are not.

## Setting up

Requires Node.js 20 or newer. To test on a phone, install Expo Go.

```bash
git clone https://github.com/nosoypoot/nihongonokotoba.git
cd nihongonokotoba
npm install
npm start
```

Scan the QR code with Expo Go on Android. On macOS, `npm run ios` opens the iPhone
simulator. `npm run web` starts the browser build.

## Before opening a pull request

Run all four checks. Every one must pass:

```bash
npm run validate:content   # validates the content pack schema
npm run lint               # includes the layer boundary rules
npm run typecheck
npm test
```

## Architecture rules

Dependencies flow in one direction only:

```text
app → features → data → core
```

- `src/core/` must not import React Native, Expo, or SQLite. It is pure logic.
- Only `src/data/` may import `expo-sqlite`.
- Only `src/core/scheduling/` may import `ts-fsrs`.
- Screens in `app/` compose features; they contain no SQL and no scheduling rules.
- The application must remain fully usable without network access.

`eslint-plugin-boundaries` verifies this, so a pull request that crosses a layer
fails `npm run lint` before review.

## Contributing content

Content packs carry the most requirements, because they are published educational
material. Every pack must declare:

- `authors`, `license` (name and URL), and verifiable `sourceNotes`.
- Meanings in Spanish **and** English.
- Stable IDs. A card ID is `courseId:entryId:templateId:senseId`.

In addition:

- Content must be original, public domain, or compatibly licensed.
- Do not copy word lists, translations, or explanations from commercial books or
  courses. Private material may define the *scope* of a lesson, but every
  translation, explanation, and example committed here must be independently
  written and reviewed.
- Pack metadata must not imply affiliation with any commercial textbook.
- Do not commit PDFs or scans of study material. `docs/References/` is gitignored
  deliberately.

See `docs/content-sources.md` for the full publishing rules.

Changing a word's target form, primary sense, lesson identity, or card identity
breaks people's study history. That requires a migration map, or a new ID plus a
tombstone. Purely cosmetic copy edits preserve progress.

The Yucatec Maya pack is only a schema fixture, not a course. It would become a
course only with a qualified contributor reviewing orthography, dialect, examples,
translations, and license.

## Design

`DESIGN.md` defines typography, color, spacing, motion, and accessibility. Two
rules that are easy to break:

- No points, streaks, or synthetic rewards. The word is the reward.
- No red and no shame language for a forgotten answer, and never use color as the
  only way to communicate an outcome.

Accessibility target: WCAG AA (4.5:1 for normal text, 3:1 for large text), touch
targets of at least 44 × 44 dp, and no required action that depends on a swipe,
hover, long press, or device orientation.

## Web deployment

Deployment uses Cloudflare Workers. The account identifier is intentionally not
committed, so export it before deploying:

```bash
export CLOUDFLARE_ACCOUNT_ID=<your-account-id>
npm run deploy:web
```

For the static bundle alone, `npm run build:web` writes output to `dist/`.

## Pull requests

- One concern per pull request, with a title that describes the change.
- Explain the *why*, not only the *what*, especially for changes to scheduling,
  card identity, or storage.
- Add tests for new logic in `src/core/` and for new repositories.
- Never commit secrets, `.env` files, signing keys, or account credentials.
  `.gitignore` covers the common cases, but review your diff.

## License

Code is contributed under the MIT license (see `LICENSE`). Content is published
under the license declared in each pack: CC0-1.0 or CC-BY-4.0 depending on the
pack. By submitting a pull request you confirm you have the right to contribute
that material under those licenses.
