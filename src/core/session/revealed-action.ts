import type { RecallRating } from '@/src/core/scheduling/scheduler';

export type SwipeDirection = 'left' | 'right';

export function getRevealedRating(
  recallClaim: RecallRating,
  direction: SwipeDirection,
): RecallRating {
  if (recallClaim === 'again') {
    return 'again';
  }
  return direction === 'left' ? 'again' : 'good';
}
