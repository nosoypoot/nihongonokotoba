import {
  classifyRecallOutcome,
  formatRecallOutcome,
} from '@/src/core/history/recall-outcome';

describe('recall outcome', () => {
  it('marks a confirmed answer as remembered', () => {
    expect(classifyRecallOutcome('good', 'good')).toBe('remembered');
    expect(classifyRecallOutcome('again', 'good')).toBe('remembered');
  });

  it('distinguishes forgetting from remembering incorrectly', () => {
    expect(classifyRecallOutcome('again', 'again')).toBe('forgotten');
    expect(classifyRecallOutcome('good', 'again')).toBe('misremembered');
  });

  it('keeps old attempts without a prediction understandable', () => {
    const outcome = classifyRecallOutcome(null, 'again');
    expect(formatRecallOutcome(outcome)).toBe('No recordé');
  });
});
