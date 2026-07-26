# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Project boundaries

- Read `DESIGN.md` before visual or UI work.
- Keep dependencies flowing `app -> features -> data -> core`.
- `src/core` must not import React Native, Expo, or SQLite.
- Only `src/data` may import `expo-sqlite`.
- Only `src/core/scheduling` may import `ts-fsrs`.
- Screens compose features; they do not contain SQL or scheduling rules.
- The application must remain fully usable without network access.
- Course content must include authorship, license, source notes, Spanish and
  English meanings, and stable IDs.
