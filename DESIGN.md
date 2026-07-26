# Design System — Nihongo no Kotoba

## Product Context

- **What this is:** una app móvil offline para recordar vocabulario mediante
  repetición espaciada y contexto lingüístico.
- **Who it is for:** estudiantes autodidactas que quieren complementar su estudio
  formal con sesiones de 5 a 10 minutos.
- **Project type:** aplicación móvil centrada en una tarea.

## Aesthetic Direction

- **Direction:** cuaderno lingüístico anotado.
- **Decoration:** mínima e intencional.
- **Mood:** sereno, curioso y honesto. La palabra es interesante por sí misma; la
  interfaz no necesita convertirla en un premio.
- **Visual reference:** el preview aprobado vive fuera del repositorio en
  `~/.gstack/projects/nihongonokotoba/designs/design-system-20260725/preview.html`.

## Typography

- **Target word and editorial headings:** Noto Serif JP 600.
- **Interface and translations:** Atkinson Hyperlegible 400/700.
- **Japanese readings and examples:** Noto Sans JP 400/700.
- Never truncate translations, lesson names, or actions.
- Support Dynamic Type. Target words may use a bounded display scale; explanatory
  text must remain fully scalable.

## Color

| Token | Light | Dark | Use |
|---|---|---|---|
| paper | `#F6F1E7` | `#1C1B18` | app background |
| surface | `#FFFCF6` | `#25231F` | reading surface |
| ink | `#25231F` | `#F3EBDD` | primary text |
| muted | `#6E6A61` | `#BDB4A7` | secondary text |
| rule | `#D8D0C2` | `#48433B` | separators |
| annotation | `#B84A2F` | `#E07A5F` | primary action and notes |
| remembered | `#2F6653` | `#7FB59F` | remembered action |
| focus | `#245F88` | `#8DC4E8` | keyboard focus |

`No la recordé` stays neutral. Never use red, shame language, or color alone to
communicate an answer.

## Spacing and Shape

- Base unit: 4 dp.
- Phone side margin: 20 dp.
- Reading column: maximum 680 dp on tablets.
- Corners: 4 dp annotations, 6 dp controls. Avoid repeated bubbly containers.
- Touch targets: minimum 44 × 44 dp.
- Lesson entries are divided rows, not cards.
- Application screens do not use shadows.

## Layout

- One vertical column below 600 dp.
- On tablets, center content. A revealed word may become a two-column composition
  in landscape; the recall prompt remains centered.
- Safe-area insets apply to every screen.
- No required action depends on swipe, hover, long press, or orientation.

## Motion and Accessibility

- Reveal and card advance: 160–220 ms, functional only.
- Reduced motion turns transitions into immediate state changes.
- WCAG AA: 4.5:1 for normal text and 3:1 for large text.
- Screen-reader order: target, reading, reveal, meaning, structure, example,
  translations, rating.
- Move accessibility focus to `Significado` after reveal.
- Japanese strings use the `ja` language tag where supported.

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-07-25 | Annotated language field guide | Understanding is the emotional reward |
| 2026-07-25 | No gamification | Scores do not validate durable learning |
| 2026-07-25 | Editorial reveal, not card flip | Context should feel discovered, not dispensed |
| 2026-07-25 | Working name `Nihongo no Kotoba` | Naming should not block the first learning loop |
| 2026-07-25 | Learner chooses kanji-first or furigana-first presentation | Both forms remain visible; hierarchy changes without duplicating progress |
| 2026-07-25 | Numbered lessons preserve 1-25; pattern lessons display “Especial” | Internal sorting must not invent a source lesson number |
| 2026-07-25 | Conditional recall flow after reveal | “Recuerdo” requires “Recordé mal / Sí recordé” calibration; “No recuerdo” only requires advancing because the outcome is already known |
| 2026-07-25 | Separate numbered and special lesson sections; newest first | Special practice remains reachable as the numbered curriculum grows |
| 2026-07-25 | History outcomes: Recordé / No recordé / Recordé mal | False certainty is pedagogically different from simple forgetting |
| 2026-07-25 | Gesture Handler card plus explicit text actions | Native horizontal recognition avoids ScrollView conflicts; visible button labels clarify each stage and preserve accessibility |
| 2026-07-25 | Entire study surface is draggable; only Spanish is shown | A large gesture target reduces friction and removes secondary copy from the core learning loop |
| 2026-07-25 | Study card fills the available screen height | The word and its context remain the primary surface; actions stay reachable at the bottom and revealed content scrolls inside the card |
| 2026-07-25 | History rows open read-only vocabulary details | Past answers become an entry point for contextual study without creating another review attempt |
| 2026-07-25 | Home offers PWA installation only on web | Friends can install the same offline learning experience from a link without adding irrelevant controls to native builds |
