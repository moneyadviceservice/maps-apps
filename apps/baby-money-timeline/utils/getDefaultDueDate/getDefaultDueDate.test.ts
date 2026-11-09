import { getDefaultDueDate } from 'utils/getDefaultDueDate';

describe('getDefaultDueDate', () => {
  it('returns a string in DD-MM-YYYY format for a future date', () => {
    const result = getDefaultDueDate();
    // Should match DD-MM-YYYY format
    expect(result).toMatch(/^\d{1,2}-\d{2}-\d{4}$/);

    // Should be a valid future date
    const [day, month, year] = result.split('-').map(Number);
    const generatedDate = new Date(year, month - 1, day);
    expect(generatedDate.getTime()).toBeGreaterThan(Date.now());
  });
});
