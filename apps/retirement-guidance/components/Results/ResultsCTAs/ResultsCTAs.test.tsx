import { render, screen } from '@testing-library/react';

import { ResultsCTAs, type ResultsCTAsProps } from './ResultsCTAs';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.changeAnswersButton': 'Change your answers',
        'results.copyResultsLink.default': 'Copy link to your results',
        'results.copyResultsLink.confirmation': 'Link copied',
      };
      return translations[key] || key;
    },
    z: (key: { en: string; cy: string }) => key.en,
  })),
}));

describe('ResultsCTAs', () => {
  const mockProps: ResultsCTAsProps = {
    changeAnswerLink: '/en/change-answers',
  };

  it('should render the component', () => {
    const { container } = render(<ResultsCTAs {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should display change your answers button with correct text and attributes', () => {
    render(<ResultsCTAs {...mockProps} />);

    const changeYourAnswersButton = screen.getByTestId('change-answers-link');
    expect(changeYourAnswersButton).toBeInTheDocument();
    expect(changeYourAnswersButton).toHaveTextContent('Change your answers');
    expect(changeYourAnswersButton).toHaveAttribute(
      'href',
      '/en/change-answers',
    );
  });

  it('should handle different changeAnswerLink values', () => {
    const customLink = '/cy/newid-atebion';
    render(<ResultsCTAs changeAnswerLink={customLink} />);

    const changeYourAnswersButton = screen.getByTestId('change-answers-link');
    expect(changeYourAnswersButton).toHaveAttribute('href', customLink);
  });

  it('should display copy URL button with correct text and attributes', () => {
    render(<ResultsCTAs {...mockProps} />);

    const copyUrlButton = screen.getByTestId('copy-url-button');
    expect(copyUrlButton).toBeInTheDocument();
    expect(copyUrlButton).toHaveTextContent('Copy link to your results');
    expect(copyUrlButton).toHaveAttribute('type', 'button');
  });
});
