# Content sources

## Private study references

`docs/References/` contains local study material supplied by the learner. PDF
files in that directory are intentionally ignored by Git and must not be
distributed with the open-source application.

The reference currently covers 25 introductory vocabulary lessons plus appendices
for numerals, time expressions, weekdays, dates, duration, counters, and verb
forms. OCR output is treated only as an inventory aid because small furigana and
table layouts produce recognition errors.

## Publishing rule

Public packs may use the private material to define learning scope, but every
translation, explanation, example, grouping, and title committed to this
repository must be independently written and reviewed. Pack metadata must not
claim affiliation with a commercial textbook.

## Conversion status

| Source area | App treatment | Status |
|---|---|---|
| Lesson 1 | Focused lesson: introductions | First reviewed pass |
| Word types | `partOfSpeech` metadata | Integrated |
| Weekdays | Contextual microlesson | First reviewed pass |
| General counter `つ` | Pattern microlesson | First reviewed pass |
| Lessons 2-25 | Focused lessons | Pending manual conversion |
| Numerals, dates, time, duration, other counters | Pattern microlessons | Pending |
| Verb conjugation tables | Reference/pattern view, not recall cards | Deferred |

Numbered lessons preserve their original 1-25 position. Pattern lessons use the
`special` kind and a private sort order, so the interface never presents them as
invented lessons 26 or 27.
