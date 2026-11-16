import { GetServerSidePropsContext } from 'next';

import { getErrorRedirect } from './getErrorRedirect';

let context = {} as Partial<GetServerSidePropsContext>;

describe('getErrorRedirect', () => {
  it('returns error path for English', () => {
    context = {
      params: { language: 'en' },
    };
    expect(getErrorRedirect(context as GetServerSidePropsContext)).toBe(
      '/en/error',
    );
  });

  it('returns error path for Welsh', () => {
    context = {
      params: { language: 'cy' },
    };
    expect(getErrorRedirect(context as GetServerSidePropsContext)).toBe(
      '/cy/error',
    );
  });

  it('defaults to English if language is missing', () => {
    context = { params: {} };
    expect(getErrorRedirect(context as GetServerSidePropsContext)).toBe(
      '/en/error',
    );
  });

  it('defaults to English if params is undefined', () => {
    context = {};
    expect(getErrorRedirect(context as GetServerSidePropsContext)).toBe(
      '/en/error',
    );
  });

  it('falls back to English for unsupported language', () => {
    context = {
      params: { language: 'fr' },
    };
    expect(getErrorRedirect(context as GetServerSidePropsContext)).toBe(
      '/en/error',
    );
  });

  it('falls back to English for undefined language', () => {
    context = {
      params: { language: undefined },
    };
    expect(getErrorRedirect(context as GetServerSidePropsContext)).toBe(
      '/en/error',
    );
  });

  it('falls back to English for empty string language', () => {
    context = {
      params: { language: '' },
    };
    expect(getErrorRedirect(context as GetServerSidePropsContext)).toBe(
      '/en/error',
    );
  });
});
