import { useRouter } from 'next/router';

import { ErrorContext } from 'context/ErrorSummaryProvider';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FormWrapper } from './FormWrapper';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockContext = {
  setFormSummaryErrors: jest.fn(),
  setSubmittedEmail: jest.fn(),
  errorSummarySection: null,
  fieldErrors: {},
};

const defaultProps = {
  input: { key: 'testField', title: 'Test', options: [] },
  formAction: '/api/test',
  nextStep: '/next',
  currentPath: '/current',
  currentStep: '/cur-step',
  children: <input name="testField" defaultValue="some-value" />,
};

describe('FormWrapper', () => {
  test.each([
    {
      name: 'Continue button',
      testId: 'submit-button',
      expectedPath: '/next',
    },
    {
      name: 'Save and come back button',
      testId: 'save-button',
      expectedPath: '/next',
    },
  ])(
    'calls the API and redirects on success when clicking $name',
    async ({ testId, expectedPath }) => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

      globalThis.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ success: true, nextPath: expectedPath }),
      });

      render(
        <ErrorContext.Provider value={mockContext}>
          <FormWrapper {...defaultProps} nextStep={expectedPath} />
        </ErrorContext.Provider>,
      );

      const button = screen.getByTestId(testId);
      userEvent.click(button);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(expectedPath);
      });

      (globalThis.fetch as jest.Mock).mockClear();
    },
  );

  it('displays errors and scrolls when API returns error', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          error: true,
          fields: { testField: { error: 'required' } },
        }),
    });

    render(
      <ErrorContext.Provider value={mockContext}>
        <FormWrapper {...defaultProps} />
      </ErrorContext.Provider>,
    );

    userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockContext.setFormSummaryErrors).toHaveBeenCalled();
    });
  });
});
