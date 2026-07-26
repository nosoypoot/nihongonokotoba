# Roadmap

## Current vertical slice

- Offline initialization of separate content and progress databases.
- One original Japanese lesson with five contextual vocabulary entries.
- Five-card focused practice with reveal, self-rating, retry, FSRS scheduling,
  lesson practice count, and attempt history.
- Validated language-neutral content contract plus a Yucatec Maya fixture.
- Android and iOS production bundle checks.

## Next MVP slice

1. Add cumulative review using all eligible, non-excluded lessons.
2. Offer five- and ten-minute practice budgets without promising an exact card
   count.
3. Let learners exclude and restore lessons from cumulative review.
4. Expand original Japanese content lesson by lesson with provenance review.
5. Add repository tests for eligibility, atomic attempt writes, and migrations.
6. Add device-level accessibility and navigation tests once Android tooling or
   an iOS Simulator runtime is available.

The private-reference conversion inventory and publication rules live in
`docs/content-sources.md`.

## Later

- Import pinned, checksummed content archives from independently maintained
  repositories at build time.
- Add pack migrations and tombstones before publishing pack updates.
- Promote the Maya fixture into a course only with a qualified contributor and a
  reviewed orthography, dialect, examples, translations, and license.
