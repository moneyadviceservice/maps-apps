import type { SubmitEvent } from 'react';

import { defaultAboutYouData } from 'types/aboutYou';
import { act, renderHook } from '@testing-library/react';

import { useAboutYouForm } from './useAboutYouForm';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: {},
    pathname: '/en/about-you',
  }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

const mockFetch = ({
  ok = true,
  status = 200,
  body = {
    success: true,
    redirectPath: '/en/your-income?sessionId=abc',
  },
}: {
  ok?: boolean;
  status?: number;
  body?: Record<string, unknown>;
} = {}) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  }) as jest.Mock;
};

const submitEvent = (fields: Record<string, string> = {}) => {
  const form = document.createElement('form');
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  return {
    preventDefault: jest.fn(),
    currentTarget: form,
  } as unknown as SubmitEvent<HTMLFormElement>;
};

const validFields = {
  day: '10',
  month: '09',
  year: '1986',
  sex: 'male',
  retireAge: '65',
};

describe('useAboutYouForm', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockFetch();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not persist when the form is invalid', async () => {
    const { result } = renderHook(() =>
      useAboutYouForm({
        sessionId: 'abc',
        initialData: defaultAboutYouData(),
        initialErrors: {},
      }),
    );

    await act(async () => {
      await result.current.handleContinue(submitEvent());
    });

    expect(result.current.hasErrors).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('persists continue and navigates when the form is valid', async () => {
    const { result } = renderHook(() =>
      useAboutYouForm({
        sessionId: 'abc',
        initialData: defaultAboutYouData(),
        initialErrors: {},
      }),
    );

    await act(async () => {
      await result.current.handleContinue(submitEvent(validFields));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/about-you?action=continue',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(mockPush).toHaveBeenCalledWith('/en/your-income?sessionId=abc');
  });

  it('stays on the page when continue persistence fails', async () => {
    mockFetch({ ok: false, status: 500 });
    const { result } = renderHook(() =>
      useAboutYouForm({
        sessionId: 'abc',
        initialData: defaultAboutYouData(),
        initialErrors: {},
      }),
    );

    await act(async () => {
      await result.current.handleContinue(submitEvent(validFields));
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
