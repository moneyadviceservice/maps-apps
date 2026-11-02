/**
 * @jest-environment node
 */

import { focusHashTarget } from './focusHashTarget';

describe('focusHashTarget server-side rendering', () => {
  it('should not throw error when window is undefined', () => {
    expect(() => focusHashTarget()).not.toThrow();
  });
});
