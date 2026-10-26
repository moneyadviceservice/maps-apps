import type { MouseEvent, SubmitEvent } from 'react';

import { act } from '@testing-library/react';

export const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

const submitEvent = {
  preventDefault: jest.fn(),
} as unknown as SubmitEvent<HTMLFormElement>;

const clickEvent = {
  preventDefault: jest.fn(),
} as unknown as MouseEvent<HTMLButtonElement>;

type JourneyActionName = 'continue' | 'save';

type JourneyCase = readonly [JourneyActionName, string];

type JourneyHandlers = {
  handleContinue: (event: SubmitEvent<HTMLFormElement>) => unknown;
  handleSave: (event: MouseEvent<HTMLButtonElement>) => unknown;
};

type RenderedForm<T extends JourneyHandlers> = {
  result: { current: T };
};

export const mockJourneyFetch = (body: Record<string, unknown>) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  }) as jest.Mock;
};

export const resetJourneyFormTests = () => {
  beforeEach(() => {
    mockPush.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
};

export const submitJourney = async (
  handlers: JourneyHandlers,
  action: JourneyActionName,
) => {
  await act(async () => {
    await (action === 'continue'
      ? handlers.handleContinue(submitEvent)
      : handlers.handleSave(clickEvent));
  });
};

export const itFollowsServerRedirect = <T extends JourneyHandlers>(
  render: () => RenderedForm<T>,
  api: string,
  cases: ReadonlyArray<JourneyCase>,
  options?: {
    prepare?: (current: T) => void;
    assertRequest?: () => void;
    assertResult?: (current: T) => void;
  },
) => {
  it.each(cases)(
    'navigates after a successful %s',
    async (action, redirectPath) => {
      mockJourneyFetch({ success: true, redirectPath });
      const { result } = render();

      options?.prepare?.(result.current);
      await submitJourney(result.current, action);

      expect(global.fetch).toHaveBeenCalledWith(
        `${api}?action=${action}`,
        expect.objectContaining({ method: 'POST' }),
      );
      options?.assertRequest?.();
      options?.assertResult?.(result.current);
      expect(mockPush).toHaveBeenCalledWith(redirectPath);
    },
  );
};

export const itUsesRedirectFallback = <T extends JourneyHandlers>(
  render: () => RenderedForm<T>,
  cases: ReadonlyArray<JourneyCase>,
) => {
  it.each(cases)(
    'uses the %s fallback when the response has no redirect',
    async (action, fallback) => {
      mockJourneyFetch({ success: true });
      const { result } = render();

      await submitJourney(result.current, action);

      expect(mockPush).toHaveBeenCalledWith(fallback);
    },
  );
};

export const itStaysWhenRequestThrows = <T extends JourneyHandlers>(
  render: () => RenderedForm<T>,
  action: JourneyActionName,
  message: string,
) => {
  it('stays on the page when the request throws', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('offline')) as jest.Mock;
    const { result } = render();

    await submitJourney(result.current, action);

    expect(mockPush).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(message, expect.any(Error));
  });
};
