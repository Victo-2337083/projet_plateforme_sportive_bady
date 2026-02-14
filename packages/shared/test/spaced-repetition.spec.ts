import { nextIntervalDays } from '../src/spaced-repetition';

describe('spaced repetition interval', () => {
  it('returns J+1 on failure', () => {
    expect(nextIntervalDays(5, false)).toBe(1);
  });

  it.each([
    [0, 1],
    [1, 3],
    [2, 7],
    [3, 14],
    [4, 30],
    [8, 30]
  ])('returns expected interval for streak %s', (streak, expected) => {
    expect(nextIntervalDays(streak, true)).toBe(expected);
  });
});
