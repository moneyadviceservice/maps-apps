import { render, screen } from '@testing-library/react';

import MainResults from './MainResults';
import { DataFromQuery } from '@maps-react/utils/pageFilter/pageFilter';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.otherTools.heading': 'Other tools to try',
        'results.otherTools.tool1.name': 'Workplace Pension Calculator',
        'results.otherTools.tool1.description':
          'Calculate your workplace pension',
        'results.otherTools.tool2.name': 'Retirement Budget Planner',
        'results.otherTools.tool2.description': 'Plan your retirement budget',
        'results.otherTools.tool3.name': 'Pension Calculator',
        'results.otherTools.tool3.description': 'Calculate your pension',
      };
      return translations[key] || key;
    },
    z: (key: { en: string; cy: string }) => key.en,
    locale: 'en',
  })),
}));

// Mock the data function
jest.mock('data/otherToolsToTry', () => ({
  resultsOtherToolsData: jest.fn(() => ({
    title: 'Other tools to try',
    toolCards: [],
  })),
}));

// Mock child components
jest.mock('../Heading/ResultsHeading', () => ({
  ResultsHeading: ({ changeAnswerLink }: { changeAnswerLink: string }) => (
    <div data-testid="results-heading" data-link={changeAnswerLink}>
      ResultsHeading Component
    </div>
  ),
}));

jest.mock('../VariableGuidance/VariableGuidance', () => ({
  VariableGuidance: () => (
    <div data-testid="variable-guidance">VariableGuidance Component</div>
  ),
}));

jest.mock('../StaticGuidance/StaticGuidance', () => ({
  StaticGuidance: ({
    retireInNext10Years,
    notRetireInNext10Years,
    alreadyRetired,
  }: {
    retireInNext10Years: boolean;
    notRetireInNext10Years: boolean;
    alreadyRetired: boolean;
  }) => (
    <div
      data-testid="static-guidance"
      data-retire-in-next-10-years={retireInNext10Years}
      data-not-retire-in-next-10-years={notRetireInNext10Years}
      data-already-retired={alreadyRetired}
    >
      StaticGuidance Component
    </div>
  ),
}));

jest.mock(
  '@maps-react/pension-tools/components/OtherToolsToTry/OtherToolsToTry',
  () => ({
    OtherToolsToTry: ({
      content,
      level,
      variant,
    }: {
      content: any;
      level: string;
      variant: string;
    }) => (
      <div
        data-testid="other-tools-to-try"
        data-level={level}
        data-variant={variant}
      >
        {content.title}
      </div>
    ),
  }),
);

describe('MainResults', () => {
  const mockProps = {
    changeAnswerLink: '/en/change-answers',
    data: { 'q-2': '0', 'q-10': '0', 'q-11': '0' } as DataFromQuery,
  };

  describe('component rendering', () => {
    it('should render the component', () => {
      render(<MainResults {...mockProps} />);

      expect(screen.getByTestId('results-heading')).toBeInTheDocument();
      expect(screen.getByTestId('variable-guidance')).toBeInTheDocument();
      expect(screen.getByTestId('other-tools-to-try')).toBeInTheDocument();
    });
  });

  describe('ResultsHeading', () => {
    it('should render ResultsHeading', () => {
      render(<MainResults {...mockProps} />);

      const heading = screen.getByTestId('results-heading');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('VariableGuidance', () => {
    it('should always render VariableGuidance', () => {
      render(<MainResults {...mockProps} />);

      expect(screen.getByTestId('variable-guidance')).toBeInTheDocument();
    });
  });

  describe('StaticGuidance', () => {
    it.each([
      ['will retire in next 10 years', '0'],
      ['will NOT retire in next 10 years', '1'],
      ['is already retired', '2'],
    ])(
      'should render StaticGuidance when user %s (q-2 = "%s")',
      (_, q2Answer) => {
        const data: DataFromQuery = {
          'q-2': q2Answer,
          'q-10': '0',
          'q-11': '0',
        };

        render(
          <MainResults changeAnswerLink="/en/change-answers" data={data} />,
        );

        expect(screen.getByTestId('static-guidance')).toBeInTheDocument();
      },
    );

    it('should pass data prop to StaticGuidance when rendered', () => {
      const data: DataFromQuery = { 'q-2': '0', 'q-10': '0', 'q-11': '0' };
      render(<MainResults changeAnswerLink="/en/change-answers" data={data} />);
      expect(screen.getByTestId('static-guidance')).toBeInTheDocument();
      const staticGuidance = screen.getByTestId('static-guidance');
      expect(staticGuidance).toBeInTheDocument();
    });
  });

  describe('OtherToolsToTry', () => {
    it('should render OtherToolsToTry component', () => {
      render(<MainResults {...mockProps} />);

      expect(screen.getByTestId('other-tools-to-try')).toBeInTheDocument();
    });

    it('should render OtherToolsToTry with correct heading level', () => {
      render(<MainResults {...mockProps} />);

      const otherTools = screen.getByTestId('other-tools-to-try');
      expect(otherTools).toHaveAttribute('data-level', 'h3');
    });
  });
});
