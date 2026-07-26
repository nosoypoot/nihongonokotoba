import { getRevealedRating } from '@/src/core/session/revealed-action';

describe('revealed card actions', () => {
  it('advances as forgotten in either direction after “No recuerdo”', () => {
    expect(getRevealedRating('again', 'left')).toBe('again');
    expect(getRevealedRating('again', 'right')).toBe('again');
  });

  it('calibrates the answer after “Recuerdo”', () => {
    expect(getRevealedRating('good', 'left')).toBe('again');
    expect(getRevealedRating('good', 'right')).toBe('good');
  });
});
