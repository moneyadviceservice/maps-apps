import { useRouter } from 'next/router';

import { fireEvent, getByText, render, screen } from '@testing-library/react';

import { Question } from '@maps-react/form/types';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { PensionPotCalculatorType } from '../../types/index';
import {
  analayticsProps,
  mockDataEn,
  mockerrors,
  mockQuestions,
  mockResults,
} from './mockTestData';
import { ErrorObject, PensionPotCalculator } from './PensionPotCaclulator';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

const scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: jest.fn(),
  }),
}));

const renderPensionPotCalculator = (
  data: PensionPotCalculatorType,
  getquestions: Question[],
  fieldsEn: Question[],
  query: DataFromQuery = {},
  errors: ErrorObject = {},
  isEmbed = false,
) => {
  const { container } = render(
    <PensionPotCalculator
      action={'api/pension-pot-calculator'}
      isEmbed={isEmbed}
      errors={errors}
      queryData={query}
      analyticsData={analayticsProps}
      data={data}
      fields={getquestions}
      fieldsEn={fieldsEn}
      results={mockResults}
    />,
  );
  return container;
};

const MockRouter = (push: jest.Mock) => {
  (useRouter as jest.Mock).mockImplementation(() => ({
    push,
    query: {
      language: 'en',
    },
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }));
};

describe('PensionPotCalculator component', () => {
  it('should render PensionPotCalculator component', () => {
    const container = renderPensionPotCalculator(
      mockDataEn,
      mockQuestions,
      mockQuestions,
      {
        pot: '100000',
        age: '57',
      },
      mockerrors,
    );

    expect(container).toMatchSnapshot();
  });

  it('should not fail when query is emtpy', () => {
    const container = renderPensionPotCalculator(
      mockDataEn,
      mockQuestions,
      mockQuestions,
      {},
      mockerrors,
    );

    expect(container).toMatchSnapshot();
  });

  it('should display results when calculating', async () => {
    const push = jest.fn();
    MockRouter(push);

    const container = renderPensionPotCalculator(
      mockDataEn,
      mockQuestions,
      mockQuestions,
      {
        pot: '100000',
        age: '57',
      },
      mockerrors,
    );

    fireEvent(
      getByText(container, 'Calculate'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    setTimeout(() => {
      expect(screen.queryAllByText('Your results').length).toBe(1);

      fireEvent.change(screen.getByLabelText(/How much is in your pot?/i), {
        target: { value: '40000' },
      });

      expect(screen.queryAllByText('£25,000').length).toBe(1);
    }, 10000);
  });

  it('should not display results when no inputs are added', () => {
    const push = jest.fn();
    MockRouter(push);

    const container = renderPensionPotCalculator(
      mockDataEn,
      mockQuestions,
      mockQuestions,
      {
        pot: '',
        age: '',
      },
      mockerrors,
    );

    fireEvent(
      getByText(container, 'Calculate'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(screen.queryAllByText('Your results').length).toBe(0);
  });

  it('should render embed version of PensionPotCalculator', () => {
    const push = jest.fn();
    MockRouter(push);

    const container = renderPensionPotCalculator(
      mockDataEn,
      mockQuestions,
      mockQuestions,
      {
        pot: '',
        age: '',
      },
      mockerrors,
      true,
    );

    expect(container).toMatchSnapshot();
  });
});
