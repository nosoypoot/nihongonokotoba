# Architecture

## Goal

One Expo/TypeScript application, offline-first, with independently versioned
content packs. Japanese is the first course; a small Yucatec Maya fixture proves
that the core is not tied to Japanese.

## Dependency direction

```text
app → features → data → core
```

- `app/`: Expo Router screens and provider composition.
- `src/features/`: user flows and React hooks.
- `src/data/`: platform storage initialization and repositories.
- `src/core/`: content contracts, FSRS adapter, and pure session state.
- `content/`: source packs bundled at build time.

## Offline storage

- Android and iOS use Expo SQLite. `content.db` is disposable and can be rebuilt
  from bundled, validated packs. `progress.db` is durable and stores scheduling
  state plus immutable attempts.
- Web uses IndexedDB through `idb`. Bundled content is read directly and progress
  uses the same repository contracts as native.
- SQLite is intentionally excluded from the web bundle. Expo SDK 54 labels its
  web support alpha, and its OPFS VFS holds exclusive access handles that make a
  second browser tab or installed PWA instance fail during startup.
- Native databases reference each other only through stable strings. They never
  use cross-database foreign keys.

A card ID is:

```text
courseId:entryId:templateId:senseId
```

## Content federation

The MVP keeps content in this repository. When a second real course has a separate
maintainer, its repository may publish a versioned archive. This app will pin the
archive URL, version, and checksum in `content.lock.json`, validate it during CI,
and bundle it. Runtime behavior remains offline.

## Compatibility

Semantic changes to a target form, primary sense, lesson identity, or card identity
require a migration map or a new ID plus tombstone. Cosmetic copy edits preserve
progress.

## Learning decisions

- A focused practice draws due cards first and then introduces at most five unseen
  words from one lesson.
- The learner reveals the answer and self-rates it as remembered or forgotten.
  There are no points, streaks, or synthetic rewards.
- Recall uses two signals: a prediction before reveal and an ○/× confirmation
  after comparing the mental answer with context. Only the confirmation changes
  the FSRS schedule; both values remain in the append-only attempt history.
- A forgotten word returns once after two intervening cards. FSRS owns the
  longer-term schedule with 90% desired retention and 1/10 minute learning steps.
- Three completed focused practices make a lesson eligible for cumulative review.
  Eligibility is automatic; excluding a mastered lesson remains a learner choice.
- Attempts are append-only so future explanations and scheduling changes do not
  erase the learning history.
- The learner's kanji-first or furigana-first preference changes hierarchy only.
  Both forms remain visible in prompts and Japanese examples, and both variants
  share one card identity and scheduling history.

## Content provenance

Course packs must contain original, public-domain, or compatibly licensed material
with source metadata. Lesson order may complement a learner's external curriculum,
but pack names and descriptions must not imply affiliation with commercial books.
The Yucatec Maya pack is only a schema fixture, not a publishable course.
