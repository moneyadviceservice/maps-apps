import { GetServerSidePropsContext } from 'next';

import { getCurrentStep } from './getCurrentStep';

describe('getCurrentStep', () => {
  it('should return the step from the resolved URL', () => {
    const context = { resolvedUrl: '/en/example' } as GetServerSidePropsContext;
    expect(getCurrentStep(context)).toBe('example');
  });

  it('should handle query parameters in the resolved URL', () => {
    const context = {
      resolvedUrl: '/en/example?param=value',
    } as GetServerSidePropsContext;
    expect(getCurrentStep(context)).toBe('example');
  });

  it('should throw an error if the resolved URL has no step', () => {
    const context = { resolvedUrl: '/en/' } as GetServerSidePropsContext;
    expect(() => getCurrentStep(context)).toThrow(
      'Current step could not be determined from the URL',
    );
  });

  it('should throw an error if resolvedUrl is empty', () => {
    const context = { resolvedUrl: '' } as GetServerSidePropsContext;
    expect(() => getCurrentStep(context)).toThrow(
      'Current step could not be determined from the URL',
    );
  });
});
