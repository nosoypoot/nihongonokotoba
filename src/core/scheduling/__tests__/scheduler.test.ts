import { createInitialStoredCard, rateCard } from '@/src/core/scheduling/scheduler';

describe('FSRS adapter', () => {
  const now = Date.UTC(2026, 6, 25, 12);

  it('uses a one-minute first step after forgetting', () => {
    const result = rateCard(null, 'again', now);
    expect(result.next.dueAt).toBe(now + 60_000);
    expect(result.next.reps).toBe(1);
  });

  it('moves a new remembered card to the ten-minute step', () => {
    const result = rateCard(createInitialStoredCard(now), 'good', now);
    expect(result.next.dueAt).toBe(now + 10 * 60_000);
  });

  it('does not mutate the stored input', () => {
    const card = createInitialStoredCard(now);
    const snapshot = structuredClone(card);
    rateCard(card, 'good', now);
    expect(card).toEqual(snapshot);
  });
});
