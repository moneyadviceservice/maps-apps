import { PATHS, TOOL_BASE_PATH } from '../../CONSTANTS';
import { FLOW } from '../getQuestions';
import { getCurrentPath } from './getCurrentPath';

describe('getCurrentPath', () => {
  it('should return PATHS.START when flow is FLOW.START', () => {
    expect(getCurrentPath(FLOW.START)).toBe(PATHS.START);
  });

  it('should return PATHS.ONLINE when flow is FLOW.ONLINE', () => {
    expect(getCurrentPath(FLOW.ONLINE)).toBe(PATHS.ONLINE);
  });

  it('should return PATHS.TELEPHONE when flow is FLOW.TELEPHONE', () => {
    expect(getCurrentPath(FLOW.TELEPHONE)).toBe(PATHS.TELEPHONE);
  });

  it('should return TOOL_BASE_PATH when flow is undefined', () => {
    expect(getCurrentPath()).toBe(TOOL_BASE_PATH);
  });
});
