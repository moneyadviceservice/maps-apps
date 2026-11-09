import { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { ConfirmDetailsAnswers } from './ConfirmDetailsAnswers';

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({ children, ...props }: { children: ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

describe('ConfirmDetailsAnswers', () => {
  const mockQuestions = {
    'step-one': {
      heading: 'Do you have high blood pressure?',
      radioInput: {
        key: 'hbp_key',
        options: [
          { label: 'Yes, I do', value: 'true' },
          { label: 'No, I do not', value: 'false' },
        ],
      },
    },
    'step-two': {
      heading: 'Select your tier',
      radioInput: {
        key: 'tier_key',
        options: [
          { label: 'Gold Tier', value: 'gold' },
          { label: 'Silver Tier', value: 'silver' },
        ],
      },
    },
    'step-three': {
      heading: 'This should be hidden',
      hideOnDetailsPage: true,
      radioInput: {
        key: 'random',
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    },
  };

  const mockAnswers = {
    hbp_key: 'true',
    tier_key: 'silver',
  };

  const defaultProps = {
    questions: mockQuestions,
    answers: mockAnswers,
    pagePath: '/register/scenario' as const,
  };

  it('renders the correct headings for each question', () => {
    render(<ConfirmDetailsAnswers {...defaultProps} />);

    expect(
      screen.getByText('Do you have high blood pressure?'),
    ).toBeInTheDocument();
    expect(screen.getByText('Select your tier')).toBeInTheDocument();
    expect(screen.queryByText('This should be hidden')).not.toBeInTheDocument();
  });

  it('displays the mapped label instead of the raw value', () => {
    render(<ConfirmDetailsAnswers {...defaultProps} />);

    expect(screen.getByText('Yes, I do')).toBeInTheDocument();
    expect(screen.getByText('Silver Tier')).toBeInTheDocument();
  });

  it('falls back to the raw answer if no matching option is found', () => {
    const propsWithMismatch = {
      ...defaultProps,
      answers: { hbp_key: 'not-in-options' },
    };

    render(<ConfirmDetailsAnswers {...propsWithMismatch} />);
    expect(screen.getByText('not-in-options')).toBeInTheDocument();
  });

  it('contains the correct hidden inputs for form submission', () => {
    render(<ConfirmDetailsAnswers {...defaultProps} />);

    const pathInput = screen.getByTestId('pagePath-hbp_key');
    const stepInput = screen.getByTestId('pageStep-step-one');

    expect(pathInput).toHaveValue('/register/scenario');
    expect(stepInput).toHaveValue('step-one');
  });

  it('displays nested firm answers from full firm document', () => {
    const bespokeLabel =
      'Your firm undertakes a bespoke consultation with the applicant';

    render(
      <ConfirmDetailsAnswers
        questions={{
          step2: {
            heading: 'How does your firm assess medical risk?',
            copy: [],
            radioInput: {
              key: 'risk_profile_approach_question',
              options: [
                { label: bespokeLabel, value: 'bespoke' },
                { label: 'None of the above', value: 'neither' },
              ],
            },
          },
        }}
        answers={{
          medical_coverage: {
            risk_profile_approach_question: 'bespoke',
          },
        }}
        pagePath="/register/firm"
      />,
    );

    expect(screen.getByText(bespokeLabel)).toBeInTheDocument();
  });

  it('sets the correct formAction on the Change button', () => {
    render(<ConfirmDetailsAnswers {...defaultProps} />);

    const changeBtn = screen.getByTestId('change-question-hbp_key');
    expect(changeBtn).toHaveAttribute(
      'formAction',
      '/api/register/change-answer?change=true',
    );
  });
});
