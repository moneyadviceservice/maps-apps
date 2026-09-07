import { formatAnalyticsObject } from './formatAnalyticsObject';

import '@testing-library/jest-dom';

const mockTranslationFunction = jest.fn((input) => input.en);

describe('formatAnalyticsObject', () => {
  it('should correctly format the analytics object', () => {
    const analyticsData = {
      tool: 'Budget Planner',
      toolCy: 'Cynlluniwr Cyllideb',
      toolStep: 'Step 1',
      pageToolName: 'budget-planner',
      stepData: {
        pageName: 'step-one',
        pageTitle: 'Step One',
        stepName: 'Introduction',
      },
      categoryLevels: ['Finance', 'Planning'],
      userId: '12345',
    };

    const expectedOutput = {
      page: {
        pageName: 'budget-planner--step-one',
        pageTitle: 'Budget Planner: Step One - MoneyHelper Tools',
        categoryLevels: ['Finance', 'Planning'],
      },
      tool: {
        toolName: 'Budget Planner',
        toolStep: 'Step 1',
        stepName: 'Introduction',
      },
      user: {
        loggedIn: true,
        userId: '12345',
      },
    };

    const result = formatAnalyticsObject(
      mockTranslationFunction,
      analyticsData,
    );
    expect(result).toEqual(expectedOutput);
  });

  it('should handle missing pageName and undefined user correctly', () => {
    const analyticsData = {
      tool: 'Savings Calculator',
      toolCy: 'Cyfrifiannell Cynilion',
      toolStep: 'Step 2',
      pageToolName: 'savings-calculator',
      stepData: {
        pageName: '',
        pageTitle: 'Savings Overview',
        stepName: 'Overview',
      },
      categoryLevels: ['Finance', 'Savings'],
    };

    const expectedOutput = {
      page: {
        pageName: 'savings-calculator',
        pageTitle: 'Savings Calculator: Savings Overview - MoneyHelper Tools',
        categoryLevels: ['Finance', 'Savings'],
      },
      tool: {
        toolName: 'Savings Calculator',
        toolStep: 'Step 2',
        stepName: 'Overview',
      },
      user: {
        loggedIn: false,
        userId: undefined,
      },
    };

    const result = formatAnalyticsObject(
      mockTranslationFunction,
      analyticsData,
    );
    expect(result).toEqual(expectedOutput);
  });
});
