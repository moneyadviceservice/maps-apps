import { useRouter } from 'next/router';
import Results from 'pages/[language]/results';
import { useState } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { act, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const props = {
  storedData: {
    'q-1': '0',
    'score-q-1': '0',
    'q-2': '1',
    'score-q-2': '2',
    'q-3': '0',
    'score-q-3': '3',
    'q-4': '1',
    'score-q-4': '2',
    'q-5': '0',
    'score-q-5': '1',
  },
  links: {
    question: {
      backLink: '/questions',
      goToQuestionOne: '/question/1',
      goToQuestionTwo: '/question/2',
      goToQuestionThree: '/question/3',
    },
    change: {
      backLink: '/change/back',
      nextLink: '/change/next',
    },
    summary: {
      backLink: '/summary/back',
      nextLink: '/summary/next',
    },
    result: {
      backLink: '/result/back',
      firstStep: '/result/first',
    },
  },
  isEmbed: true,
  groupWithScores: {
    highRiskGroup: {
      budgeting: {
        links: [
          {
            title: 'Budget planner',
            link: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
            type: 'tool',
            description:
              "will help you keep track of your money by working out exactly how much you’ve got coming in and where it's being spent.",
          },
          {
            title: "Beginner's guide to managing your money",
            link: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money',
            type: 'article',
            description:
              'will help you learn to budget so you can stay on top of bills and start saving.',
          },
          {
            title: "Understanding the government's Help for Households support",
            link: 'https://www.moneyhelper.org.uk/en/blog/everyday-money/government-cost-of-living-support-package-to-help-with-energy-bills',
            type: 'article',
            description:
              'can tell you what government support is available to help you with the rising cost of living.',
          },
        ],
        score: 1,
      },
    },
    lowRiskGroup: {
      preventingDebts: {
        links: [
          {
            title: 'Debt Advice Locator',
            link: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
            type: 'tool',
            description:
              'can help you find free advice from trained specialists who can help you with debt.',
          },
        ],
        score: 3,
      },
    },
  },
};

describe('Mid-Life MOT Results Component', () => {
  beforeAll(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {
        isEmbedded: 'true',
        language: 'en',
      },
    });
  });

  it('renders with correct heading', () => {
    const { getByTestId } = render(<Results {...props} />);

    const heading = getByTestId(
      'midlife-mot-results-page-heading',
    ).querySelector('h1');

    expect(heading).toHaveTextContent('Your personalised report');
  });

  it('renders the description correctly', () => {
    const { getByTestId } = render(<Results {...props} />);

    const description = getByTestId('midlife-mot-results-page-description');
    expect(description).toHaveTextContent(
      "Well done for completing the Money Midlife MOT. You'll find your results below, listed in order from what you should focus on improving now to what you're already doing well.",
    );
  });

  it('renders the "What to focus on" section when highRiskGroup has data', () => {
    const { getByText } = render(<Results {...props} />);

    expect(getByText('What to focus on')).toBeInTheDocument();

    expect(getByText('Budget planner')).toBeInTheDocument();
    expect(
      getByText("Beginner's guide to managing your money"),
    ).toBeInTheDocument();
  });

  it('renders the descriptions correctly for highRiskGroup links', () => {
    const { getByText } = render(<Results {...props} />);

    expect(
      getByText(
        "will help you keep track of your money by working out exactly how much you’ve got coming in and where it's being spent.",
      ),
    ).toBeInTheDocument();

    expect(
      getByText(
        'will help you learn to budget so you can stay on top of bills and start saving.',
      ),
    ).toBeInTheDocument();

    expect(
      getByText(
        'can tell you what government support is available to help you with the rising cost of living.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the low-risk title, link, and description correctly', () => {
    const { getByText, getByRole } = render(<Results {...props} />);

    expect(getByText('Debt Advice Locator')).toBeInTheDocument();

    expect(
      getByText(
        'can help you find free advice from trained specialists who can help you with debt.',
      ),
    ).toBeInTheDocument();

    const link = getByRole('link', { name: /Debt Advice Locator/i });
    expect(link).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
    );
  });
});

describe('CopyButton', () => {
  const CopyButton = () => {
    const [copyButtonText, setCopyButtonText] = useState(
      'Copy your custom report link',
    );
    const initialCopyButtonText = 'Copy your custom report link';

    const handleCopyButtonText = () => {
      const timeout = window.setTimeout(() => {
        setCopyButtonText(initialCopyButtonText);
      }, 3000);

      setCopyButtonText('Link copied!');

      return () => clearTimeout(timeout);
    };

    return (
      <div>
        <Button variant="primary" onClick={handleCopyButtonText}>
          {copyButtonText}
        </Button>
      </div>
    );
  };

  it('changes button text and resets after 3 seconds', () => {
    render(<CopyButton />);

    const button = screen.getByRole('button', {
      name: /Copy your custom report link/i,
    });

    jest.useFakeTimers();

    act(() => {
      button.click();
    });

    expect(button).toHaveTextContent('Link copied!');

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(button).toHaveTextContent('Copy your custom report link');
  });
});
