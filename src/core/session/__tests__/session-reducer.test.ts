import {
  createStudySession,
  sessionReducer,
  type SessionCard,
} from '@/src/core/session/session-reducer';

const cards: SessionCard[] = ['a', 'b', 'c', 'd'].map((id) => ({
  cardId: id,
  entryId: id,
  senseId: 'primary',
}));

describe('session reducer', () => {
  it('requires reveal before a rating is accepted', () => {
    const session = createStudySession(cards);
    expect(sessionReducer(session, { type: 'rate', rating: 'good' })).toBe(session);
  });

  it('places a forgotten card after two intervening cards', () => {
    const revealed = sessionReducer(createStudySession(cards), { type: 'reveal' });
    const rated = sessionReducer(revealed, { type: 'rate', rating: 'again' });

    expect(rated.current?.cardId).toBe('b');
    expect(rated.queue.map((card) => card.cardId)).toEqual(['c', 'a', 'd']);
  });

  it('does not requeue when two intervening cards are unavailable', () => {
    const revealed = sessionReducer(createStudySession(cards.slice(0, 2)), {
      type: 'reveal',
    });
    const rated = sessionReducer(revealed, { type: 'rate', rating: 'again' });

    expect(rated.current?.cardId).toBe('b');
    expect(rated.queue).toEqual([]);
  });

  it('always terminates even if every card is forgotten', () => {
    let session = createStudySession(cards);
    let safety = 0;

    while (session.phase !== 'complete' && safety < 100) {
      session = sessionReducer(session, { type: 'reveal' });
      session = sessionReducer(session, { type: 'rate', rating: 'again' });
      safety += 1;
    }

    expect(session.phase).toBe('complete');
    expect(safety).toBeLessThanOrEqual(cards.length * 2);
  });
});
