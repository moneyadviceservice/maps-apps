import { render, screen } from '@testing-library/react';

import { SelfServeReviewSummaryTable } from './SelfServeReviewSummaryTable';

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

describe('SelfServeReviewSummaryTable', () => {
  it('renders table headers and change action', () => {
    render(
      <SelfServeReviewSummaryTable
        changeAnswerApi="/api/account/trip-cover/change-answer"
        changeAnswerHiddenFields={{ firmId: 'firm-123' }}
        questionColumnLabel="Age limit regions"
        answerColumnLabel="Selection"
        rows={[
          {
            id: 'region-europe',
            heading: 'Europe',
            answer: 'Selected',
            changeTargetPath: '/account/trip-cover/regions/firm-123',
          },
        ]}
      />,
    );

    expect(screen.getByText('Age limit regions')).toBeInTheDocument();
    expect(screen.getByText('Selection')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.getByTestId('change-question-region-europe')).toHaveAttribute(
      'formAction',
      '/api/account/trip-cover/change-answer',
    );
  });

  it('renders configurable hidden fields on change forms', () => {
    const { container } = render(
      <SelfServeReviewSummaryTable
        changeAnswerApi="/api/custom/change-answer"
        changeAnswerHiddenFields={{ firmId: 'firm-456', flow: 'contact' }}
        questionColumnLabel="Questions"
        answerColumnLabel="Submission"
        rows={[
          {
            id: 'email',
            heading: 'Email',
            answer: 'support@example.com',
            changeTargetPath: '/account/contact/email?firmId=firm-456',
          },
        ]}
      />,
    );

    const firmIdInput = container.querySelector('input[name="firmId"]');
    const flowInput = container.querySelector('input[name="flow"]');
    const targetPathInput = container.querySelector('input[name="targetPath"]');

    expect(firmIdInput).toHaveAttribute('value', 'firm-456');
    expect(flowInput).toHaveAttribute('value', 'contact');
    expect(targetPathInput).toHaveAttribute(
      'value',
      '/account/contact/email?firmId=firm-456',
    );
    expect(screen.getByTestId('change-question-email')).toHaveAttribute(
      'formAction',
      '/api/custom/change-answer',
    );
  });
});
