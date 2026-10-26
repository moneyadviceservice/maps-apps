import { STATE_PENSION_WEEKLY_AMOUNT_ID } from 'data/state-pension';
import {
  itFollowsServerRedirect,
  itStaysWhenRequestThrows,
  itUsesRedirectFallback,
  mockJourneyFetch,
  mockPush,
  resetJourneyFormTests,
  submitJourney,
} from 'test-utils/journeyFormTestUtils';
import { act, renderHook } from '@testing-library/react';

import { useStatePensionForm } from './useStatePensionForm';

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

describe('useStatePensionForm', () => {
  resetJourneyFormTests();

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

  itFollowsServerRedirect(
    renderForm,
    '/api/state-pension',
    [
      ['continue', '/en/state-pension?sessionId=abc'],
      ['save', '/en/save?sessionId=abc'],
    ],
    {
      prepare: (current) => {
        act(() => {
          current.setWeeklyAmount('200');
        });
      },
      assertRequest: () => {
        expect(
          JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body),
        ).toEqual(
          expect.objectContaining({
            language: 'en',
            sessionId: 'abc',
            weeklyAmount: '200',
          }),
        );
      },
      assertResult: (current) => {
        expect(current.errors).toEqual({});
      },
    },
  );

  itUsesRedirectFallback(renderForm, [
    ['continue', '/en/retirement-income?sessionId=abc'],
    ['save', '/en/save?sessionId=abc'],
  ]);

  it('shows the returned errors and focuses the summary', async () => {
    mockJourneyFetch({
      success: false,
      errors: { [STATE_PENSION_WEEKLY_AMOUNT_ID]: ['Enter an amount'] },
    });
    const { result } = renderForm();
    const focus = jest.fn();
    result.current.errorSummaryRef.current = {
      focus,
      scrollIntoView: jest.fn(),
    };

    await submitJourney(result.current, 'continue');

    expect(result.current.hasErrors).toBe(true);
    expect(result.current.errors[STATE_PENSION_WEEKLY_AMOUNT_ID]).toEqual([
      'Enter an amount',
    ]);
    expect(focus).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('clears errors when a failed response omits them', async () => {
    mockJourneyFetch({ success: false });
    const { result } = renderForm({
      initialErrors: { [STATE_PENSION_WEEKLY_AMOUNT_ID]: ['Enter an amount'] },
    });

    await submitJourney(result.current, 'save');

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

  itStaysWhenRequestThrows(
    renderForm,
    'continue',
    'Failed to persist state pension',
  );
});
