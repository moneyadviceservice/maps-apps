import { getExpireTimeDate } from './getExpireTimeDate';

describe('getExpireTimeDate', () => {
  it('returns a date that is N minutes ahead of now', () => {
    const timeMinutes = 10;

    const before = new Date();
    const result = getExpireTimeDate(timeMinutes);
    const after = new Date();

    const expectedOffset = timeMinutes * 60 * 1000;

    const diffFromBefore = result.getTime() - before.getTime();
    const diffFromAfter = result.getTime() - after.getTime();

    expect(diffFromBefore).toBeGreaterThanOrEqual(expectedOffset - 50);
    expect(diffFromAfter).toBeLessThanOrEqual(expectedOffset + 50);
  });

  it('handles zero minutes', () => {
    const before = new Date();
    const result = getExpireTimeDate(0);
    const after = new Date();

    const diffFromBefore = result.getTime() - before.getTime();
    const diffFromAfter = result.getTime() - after.getTime();

    expect(diffFromBefore).toBeGreaterThanOrEqual(0);
    expect(diffFromAfter).toBeLessThanOrEqual(50);
  });

  it('handles negative minutes', () => {
    const timeMinutes = -5;
    const before = new Date();
    const result = getExpireTimeDate(timeMinutes);
    const after = new Date();

    const expectedOffset = timeMinutes * 60 * 1000;

    const diffFromBefore = result.getTime() - before.getTime();
    const diffFromAfter = result.getTime() - after.getTime();

    expect(diffFromBefore).toBeGreaterThanOrEqual(expectedOffset - 50);
    expect(diffFromAfter).toBeLessThanOrEqual(expectedOffset + 50);
  });
});
