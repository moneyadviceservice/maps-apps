import type { MouseEvent, SubmitEvent } from 'react';

import { STATE_PENSION_WEEKLY_AMOUNT_ID } from 'data/state-pension';
import { act, renderHook } from '@testing-library/react';

import { useStatePensionForm } from './useStatePensionForm';

const mockPush = jest.fn();

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

const mockFetch = (body: Record<string, unknown>, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: async () => body,
  }) as jest.Mock;
};

const renderForm = (
  overrides?: Partial<Parameters<typeof useStatePensionForm>[0]>,
) =>
  renderHook(() =>
    useStatePensionForm({
      sessionId: 'abc',
      initialWeeklyAmount: '180',
      maxWeeklyAmount: '250.00',
      initialErrors: {},
      ...overrides,
    }),
  );

const submit = async (
  result: ReturnType<typeof renderForm>['result'],
  action: 'continue' | 'save',
) => {
  await act(async () => {
    await (action === 'continue'
      ? result.current.handleContinue(submitEvent)
      : result.current.handleSave(clickEvent));
  });
};

describe('useStatePensionForm', () => {
  beforeEach(() => {
    mockPush.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sets the page title from the heading and the error state', () => {
    renderForm();
    expect(document.title).toBe('Your State Pension - Pension calculator');

    renderForm({
      initialErrors: { [STATE_PENSION_WEEKLY_AMOUNT_ID]: ['Enter an amount'] },
    });
    expect(document.title).toBe(
      'Error: Your State Pension - Pension calculator',
    );
  });

  it.each([
    ['continue', '/en/state-pension?sessionId=abc'],
    ['save', '/en/save?sessionId=abc'],
  ] as const)(
    'navigates after a successful %s',
    async (action, redirectPath) => {
      mockFetch({ success: true, redirectPath });
      const { result } = renderForm();

      act(() => {
        result.current.setWeeklyAmount('200');
      });
      await submit(result, action);

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/state-pension?action=${action}`,
        expect.objectContaining({ method: 'POST' }),
      );
      expect(
        JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body),
      ).toEqual(
        expect.objectContaining({
          language: 'en',
          sessionId: 'abc',
          weeklyAmount: '200',
        }),
      );
      expect(mockPush).toHaveBeenCalledWith(redirectPath);
      expect(result.current.errors).toEqual({});
    },
  );

  it.each([
    ['continue', '/en/state-pension?sessionId=abc'],
    ['save', '/en/save?sessionId=abc'],
  ] as const)(
    'uses the %s fallback when the response has no redirect',
    async (action, fallback) => {
      mockFetch({ success: true });
      const { result } = renderForm();

      await submit(result, action);

      expect(mockPush).toHaveBeenCalledWith(fallback);
    },
  );

  it('shows the returned errors and focuses the summary', async () => {
    mockFetch({
      success: false,
      errors: { [STATE_PENSION_WEEKLY_AMOUNT_ID]: ['Enter an amount'] },
    });
    const { result } = renderForm();
    const focus = jest.fn();
    result.current.errorSummaryRef.current = {
      focus,
      scrollIntoView: jest.fn(),
    };

    await submit(result, 'continue');

    expect(result.current.hasErrors).toBe(true);
    expect(result.current.errors[STATE_PENSION_WEEKLY_AMOUNT_ID]).toEqual([
      'Enter an amount',
    ]);
    expect(focus).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('clears errors when a failed response omits them', async () => {
    mockFetch({ success: false });
    const { result } = renderForm({
      initialErrors: { [STATE_PENSION_WEEKLY_AMOUNT_ID]: ['Enter an amount'] },
    });

    await submit(result, 'save');

    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('keeps a large weekly amount locally until submit', () => {
    const { result } = renderForm();

    act(() => {
      result.current.setWeeklyAmount('1,000,000');
    });

    expect(result.current.weeklyAmount).toBe('1,000,000');
    expect(result.current.errors).toEqual({});
  });

  it('stays on the page when the request throws', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('offline')) as jest.Mock;
    const { result } = renderForm();

    await submit(result, 'continue');

    expect(mockPush).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to persist state pension',
      expect.any(Error),
    );
  });
});
