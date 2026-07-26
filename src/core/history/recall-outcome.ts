import type { RecallRating } from '@/src/core/scheduling/scheduler';

export type RecallOutcome = 'remembered' | 'forgotten' | 'misremembered';

export function classifyRecallOutcome(
  recallClaim: RecallRating | null,
  confirmedRating: RecallRating,
): RecallOutcome {
  if (confirmedRating === 'good') {
    return 'remembered';
  }
  return recallClaim === 'good' ? 'misremembered' : 'forgotten';
}

export function formatRecallOutcome(outcome: RecallOutcome): string {
  if (outcome === 'remembered') {
    return 'Recordé';
  }
  if (outcome === 'misremembered') {
    return 'Recordé mal';
  }
  return 'No recordé';
}
