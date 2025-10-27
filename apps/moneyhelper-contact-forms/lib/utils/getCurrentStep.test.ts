import { GetServerSidePropsContext } from 'next';

import { getCurrentStep } from './getCurrentStep';

describe('getCurrentStep', () => {
  it('returns step for URL', () => {
    const context = {
      resolvedUrl: '/en/about-mhpd',
    } as GetServerSidePropsContext;
    expect(getCurrentStep(context)).toEqual('about-mhpd');
  });

  it('returns fallback for missing step', () => {
    const context = { resolvedUrl: '/en/' } as GetServerSidePropsContext;
    expect(getCurrentStep(context)).toEqual('');
  });

  it('returns fallback for empty URL', () => {
    const context = { resolvedUrl: '' } as GetServerSidePropsContext;
    expect(getCurrentStep(context)).toEqual('');
  });

  it('returns fallback for malformed URL', () => {
    const context = { resolvedUrl: '/foo' } as GetServerSidePropsContext;
    expect(getCurrentStep(context)).toEqual('');
  });
});
