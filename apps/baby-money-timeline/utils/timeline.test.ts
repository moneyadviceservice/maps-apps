import { mapEventDates, parseDateString } from './timeline';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: jest.fn() }),
}));

describe('mapEventDates', () => {
  it('should return an array of events with the correct date', () => {
    const z = jest.fn();
    const result = mapEventDates(`2024-09-01`, 1, z);
    expect(result.length).toBe(4);
  });

  it('returns fallback date for invalid input', () => {
    const result = parseDateString('not-a-date');
    expect(result instanceof Date).toBe(true);
    expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(1000);
  });
});
