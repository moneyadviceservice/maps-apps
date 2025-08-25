import { FLOW } from '../getQuestions';
import { getPrefix } from './getPrefix';

describe('getPrefix', () => {
  it('should return "q-" for FLOW.START', () => {
    expect(getPrefix(FLOW.START)).toBe('q-');
  });

  it('should return "o-" for FLOW.ONLINE', () => {
    expect(getPrefix(FLOW.ONLINE)).toBe('o-');
  });

  it('should return "t-" for FLOW.TELEPHONE', () => {
    expect(getPrefix(FLOW.TELEPHONE)).toBe('t-');
  });

  it('should return "q-" for an unrecognized flow', () => {
    expect(getPrefix('invalid-flow' as FLOW)).toBe('q-');
  });
});
