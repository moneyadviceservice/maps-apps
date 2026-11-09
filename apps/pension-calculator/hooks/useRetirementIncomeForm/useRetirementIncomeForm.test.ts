import {
  itFollowsServerRedirect,
  itStaysWhenRequestThrows,
  itUsesRedirectFallback,
  mockJourneyFetch,
  mockPush,
  resetJourneyFormTests,
  submitJourney,
} from 'test-utils/journeyFormTestUtils';
import { renderHook } from '@testing-library/react';

import { useRetirementIncomeForm } from './useRetirementIncomeForm';

const renderForm = () => renderHook(() => useRetirementIncomeForm('abc'));

describe('useRetirementIncomeForm', () => {
  resetJourneyFormTests();

  it('sets the page title from the heading', () => {
    renderForm();

    expect(document.title).toBe(
      'Your retirement income needs - Pension calculator',
    );
  });

  itFollowsServerRedirect(renderForm, '/api/retirement-income', [
    ['continue', '/en/check-your-answers?sessionId=abc'],
    ['save', '/en/save?sessionId=abc'],
  ]);

  itUsesRedirectFallback(renderForm, [
    ['continue', '/en/check-your-answers?sessionId=abc'],
    [
      'save',
      '/en/save?returnTo=%2Fen%2Fretirement-income%3FsessionId%3Dabc&sessionId=abc',
    ],
  ]);

  it('stays on the page when the response is unsuccessful', async () => {
    mockJourneyFetch({ success: false });
    const { result } = renderForm();

    await submitJourney(result.current, 'continue');

    expect(mockPush).not.toHaveBeenCalled();
  });

  itStaysWhenRequestThrows(
    renderForm,
    'save',
    'Failed to continue from retirement income',
  );
});
