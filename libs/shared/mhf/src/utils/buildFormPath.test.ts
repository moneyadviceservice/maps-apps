import { buildFormPath } from './buildFormPath';

describe('buildFormPath', () => {
  it('builds a flat form path when no base path is configured', () => {
    expect(buildFormPath('en', 'step-1')).toBe('/en/step-1');
  });

  it('includes the configured base path', () => {
    expect(buildFormPath('en', 'step-1', 'mock-path')).toBe(
      '/en/mock-path/step-1',
    );
  });

  it('normalizes leading and trailing base path slashes', () => {
    expect(buildFormPath('cy', 'step-1', '/mock-path/')).toBe(
      '/cy/mock-path/step-1',
    );
  });
});
