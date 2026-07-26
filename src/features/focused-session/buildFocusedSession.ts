import { buildCardId } from '@/src/core/content-schema/card-id';
import type { VocabularyEntry } from '@/src/core/content-schema/schema';
import { isDue } from '@/src/core/scheduling/scheduler';
import type { SessionCard } from '@/src/core/session/session-reducer';
import type { ProgressRepository } from '@/src/data/progress/repository';

type BuildFocusedSessionInput = {
  courseId: string;
  entries: VocabularyEntry[];
  progress: ProgressRepository;
  now: number;
  newCardLimit?: number;
};

export async function buildFocusedSessionCards({
  courseId,
  entries,
  progress,
  now,
  newCardLimit = 5,
}: BuildFocusedSessionInput): Promise<SessionCard[]> {
  const candidates = entries.flatMap((entry) =>
    entry.senses.map((sense) => ({
      cardId: buildCardId({
        courseId,
        entryId: entry.id,
        senseId: sense.id,
      }),
      entryId: entry.id,
      senseId: sense.id,
    })),
  );

  const resolved = await Promise.all(
    candidates.map(async (card) => ({
      card,
      state: await progress.getCardState(card.cardId),
    })),
  );

  const due = resolved
    .filter(({ state }) => state !== null && isDue(state, now))
    .sort((a, b) => (a.state?.dueAt ?? 0) - (b.state?.dueAt ?? 0))
    .map(({ card }) => card);
  const unseen = resolved
    .filter(({ state }) => state === null)
    .slice(0, newCardLimit)
    .map(({ card }) => card);

  return [...due, ...unseen];
}
