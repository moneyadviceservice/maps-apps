import { render, screen } from '@testing-library/react';

import { SelfServeReviewSummary } from './SelfServeReviewSummary';

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

describe('SelfServeReviewSummary', () => {
  it('renders multiple sections and passes row data through to each table', () => {
    render(
      <SelfServeReviewSummary
        sections={[
          {
            heading: 'Age limits',
            questionColumnLabel: 'Age limit regions',
            answerColumnLabel: 'Selection',
            rows: [
              {
                id: 'region-europe',
                heading: 'Europe',
                answer: 'Selected',
                changeTargetPath: '/account/trip-cover/regions/firm-123',
              },
            ],
          },
          {
            heading: 'Service details',
            questionColumnLabel: 'Service details questions',
            answerColumnLabel: 'Selection',
            rows: [
              {
                id: 'telephone-quote',
                heading: 'Do you offer a telephone quote service?',
                answer: 'Yes',
                changeTargetPath:
                  '/account/trip-cover/service-details/firm-123',
              },
            ],
          },
        ]}
        changeAnswerApi="/api/account/trip-cover/change-answer"
        changeAnswerHiddenFields={{ firmId: 'firm-123' }}
      />,
    );

    expect(
      screen.getByTestId('summary-section-Age limits'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('summary-section-Service details'),
    ).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(
      screen.getByText('Do you offer a telephone quote service?'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('summary-answer-region-europe'),
    ).toHaveTextContent('Selected');
    expect(
      screen.getByTestId('summary-answer-telephone-quote'),
    ).toHaveTextContent('Yes');
  });
});
