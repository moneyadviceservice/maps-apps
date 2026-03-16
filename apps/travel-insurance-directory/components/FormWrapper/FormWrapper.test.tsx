import { useRouter } from 'next/router';

import { ErrorContext } from 'context/ErrorSummaryProvider';
import { CopyItem } from 'data/pages/register/firmQuestions';
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
  copy: [
    { component: 'paragraph', style: 'text-bold', content: 'Hello world' },
    { component: 'list', style: 'text-bold', items: ['First', 'Second'] },
  ] as CopyItem[],
  input: { key: 'testField', title: 'Test', options: [] },
  formAction: '/api/test',
  nextStep: '/next',
  currentPath: '/current',
  currentStep: '/cur-step',
  children: <input name="testField" defaultValue="some-value" />,
};

describe('FormWrapper', () => {
  it('calls the API and redirects on success', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    globalThis.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    });

    render(
      <ErrorContext.Provider value={mockContext}>
        <FormWrapper {...defaultProps} />
      </ErrorContext.Provider>,
    );

    const para = screen.getByTestId('copyItemContent-0');
    expect(para).toHaveTextContent('Hello world');

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/next');
    });
  });

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
