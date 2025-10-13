import { DataPath } from 'types';

import { render } from '@testing-library/react';

import { QuestionPage } from './QuestionPage';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
  }),
}));

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(() => ({
    addStepPage: jest.fn(),
  })),
}));

jest.mock('@maps-react/form/components/Questions', () => ({
  Questions: jest.fn(() => null),
}));

const mockLinks = {
  question: {
    backLink: '/back-link',
    goToQuestionOne: '2',
    goToQuestionTwo: '2',
    goToQuestionThree: '2',
  },
  change: {
    backLink: '/back-link',
    nextLink: 'next-link',
  },
  summary: {
    backLink: '/back-link',
    nextLink: 'next-link',
  },
  result: {
    backLink: '/back-link',
    firstStep: '/first-step',
  },
};

describe('QuestionPage component', () => {
  it('renders Questions component with correct props', () => {
    const storedData = {};
    const data = '';
    const currentStep = 1;
    const isEmbed = false;
    const analyticsData = {
      pageName: 'Page Name',
      pageTitle: 'Page Title',
      toolName: 'Tool Name',
      stepNames: ['Step 1', 'Step 2', 'Step 3'],
    };

    render(
      <QuestionPage
        storedData={storedData}
        data={data}
        currentStep={currentStep}
        dataPath={DataPath.PensionType}
        links={mockLinks}
        isEmbed={isEmbed}
        analyticsData={analyticsData}
      />,
    );

    expect(
      jest.requireMock('@maps-react/form/components/Questions').Questions,
    ).toHaveBeenCalledTimes(1);
  });
});
