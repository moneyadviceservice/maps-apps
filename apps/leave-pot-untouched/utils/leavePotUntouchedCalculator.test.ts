import { leavePotUntouchedCalculator } from './leavePotUntouchedCalculator';

describe('leavePotUntouchedCalculator', () => {
  it('should return an empty array if pot and contribution are both zero', () => {
    const result = leavePotUntouchedCalculator(20000, 2000);
    expect(result).toEqual([44600, 69938, 96036, 122917, 150605]);
  });

  it('should return an empty array if pot and contribution are both zero', () => {
    const result = leavePotUntouchedCalculator(20000, 200);
    expect(result).toEqual([23000, 26090, 29273, 32551, 35927]);
  });
});
