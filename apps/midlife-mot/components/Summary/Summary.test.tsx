import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import resultsFilter from 'utils/resultsFilter';

import { ListElement } from '@maps-react/common/components/ListElement';
import { Summary } from './Summary';

interface Question {
  questionNbr: number;
  group: string;
  title: string;
  type: string;
  answers: {
    text: string;
    score: number;
  }[];
}

const mockStoredData = {
  'q-1': '0',
  'q-2': '1',
  'q-3': '2',
  'q-4': '3',
  'score-q-1': '0',
  'score-q-2': '1.5', // High risk score
  'score-q-3': '2.5', // Medium risk score
  'score-q-4': '3.5', // Low risk score
};

const mockQuestions: Question[] = [
  {
    questionNbr: 1,
    group: 'group1',
    title: 'How well are you keeping up with bills and credit repayments?',
    type: 'single-choice',
    answers: [{ text: 'Answer A', score: 0 }],
  },
  {
    questionNbr: 2,
    group: 'group1',
    title: 'What’s your approach to budgeting?',
    type: 'single-choice',
    answers: [{ text: 'Answer B', score: 1.5 }],
  },
  {
    questionNbr: 3,
    group: 'group2',
    title:
      'Have you thought about ways to reduce the cost of these household bills?',
    type: 'multiple-choice',
    answers: [{ text: 'Answer C', score: 2.5 }],
  },
  {
    questionNbr: 4,
    group: 'group3',
    title: 'Do you have or will you be entitled to any of these pensions?',
    type: 'multiple-choice',
    answers: [{ text: 'Answer D', score: 3.5 }],
  },
];

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(() => ({
    addPage: jest.fn(),
  })),
}));

describe('Summary Component', () => {
  const mockTranslation = {
    z: jest.fn((input) => input.en),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
  });

  it('renders the component with correct headings and paragraphs', () => {
    render(
      <Summary
        storedData={mockStoredData}
        questions={mockQuestions}
        backLink="/back"
        nextLink="/next"
        isEmbed={false}
      />,
    );

    expect(screen.getByText('Summary of your results')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Congratulations on completing this tool. Here’s a summary of what to focus on, what to build on and what to keep doing for your financial wellbeing.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the personalised report link with correct text, href, and accessible attributes', () => {
    render(
      <Summary
        storedData={mockStoredData}
        questions={mockQuestions}
        backLink="/back"
        nextLink="/next"
        isEmbed={false}
      />,
    );

    const reportLink = screen.getByText('Get Your Personalised Report');
    expect(reportLink).toBeInTheDocument();
    expect(reportLink).toHaveAttribute('href', '/next');
    expect(reportLink).toHaveAttribute(
      'data-testid',
      'get-your-personalised-report',
    );
  });
});

describe('resultsFilter function', () => {
  it('correctly groups data into risk categories', () => {
    const groupWithScores = resultsFilter(
      mockQuestions,
      mockStoredData,
    ).filterGroupData();

    expect(groupWithScores.highRiskGroup).toEqual({
      group1: { score: 1.5, links: [] },
    });

    expect(groupWithScores.mediumRiskGroup).toEqual({
      group2: { score: 2.5, links: [] },
    });

    expect(groupWithScores.lowRiskGroup).toEqual({
      group3: { score: 3.5, links: [] },
    });
  });
});

describe('ListElement Component', () => {
  it('renders titles only for valid groupLinks', () => {
    const groupLinks: Record<'screening' | 'preventing-debts', boolean> = {
      screening: true,
      'preventing-debts': false,
    };

    const filtered = [
      { group: 'screening', title: 'About you' },
      { group: 'preventing-debts', title: 'Preventing debts' },
    ];

    const items = filtered
      .filter((i) => groupLinks[i.group as 'screening' | 'preventing-debts'])
      .map((i) => i.title);

    render(
      <ListElement
        color="pink"
        variant="unordered"
        className="space-y-2 text-gray-800"
        items={items.map((title) => (
          <>{title}</>
        ))}
      />,
    );
    expect(screen.getByText('About you')).toBeInTheDocument();
    expect(screen.queryByText('Preventing debts')).not.toBeInTheDocument();
  });
});

describe('Summary Component', () => {
  const mockTranslation = {
    z: jest.fn((input) => input.en),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
  });

  describe('Summary Component', () => {
    const mockTranslation = {
      z: jest.fn((input) => input.en),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
    });

    describe('Analytics tests', () => {
      beforeEach(() => {
        window.adobeDataLayer = [] as unknown as Array<Record<string, unknown>>;
        window.adobeDataLayer.push = jest.fn();
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('calls addPage analytics function with correct data', () => {
        const addPageMock = jest.fn();
        (useAnalytics as jest.Mock).mockReturnValue({ addPage: addPageMock });

        render(
          <Summary
            storedData={mockStoredData}
            questions={mockQuestions}
            backLink="/back"
            nextLink="/next"
            isEmbed={false}
          />,
        );

        const [analyticsData] = addPageMock.mock.calls[0];

        expect(analyticsData).toEqual([
          {
            page: {
              pageName: 'midlife-mot--summary',
              pageTitle: 'Summary',
            },
            tool: {
              toolName: 'Midlife MOT',
              toolStep: 20,
              stepName: 'Summary of your results',
            },
            event: 'pageLoadReact',
          },
        ]);
      });
    });
  });
});
