import '@testing-library/jest-dom';
import { fireEvent, screen, render } from '@testing-library/react';
import { SavingsCalculator, SavingsCalculatorType } from './SavingsCalculator';
import { DataPath } from 'types/types';

let scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

jest.mock('hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: jest.fn(),
  }),
}));

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

describe('SavingsCalculator component', () => {
  it('renders correctly how much form with errors', () => {
    render(
      <SavingsCalculator
        isEmbed={false}
        errors={[
          {
            field: 'savingGoal',
            type: 'required',
          },
        ]}
        queryData={{
          savingGoal: '',
          amount: '',
          amountDuration: '52',
          saved: '',
          interest: '',
        }}
        dataPath={DataPath.SavingsCalculator}
        calculatorType={SavingsCalculatorType.HOW_LONG}
      />,
    );

    fireEvent.change(screen.getByLabelText(/What is your savings goal?/i), {
      target: { value: '5000' },
    });

    fireEvent.change(screen.getByLabelText(/How much can you save?/i), {
      target: { value: '100' },
    });

    fireEvent.change(
      screen.getByLabelText(/How much have you saved already?/i, {
        exact: false,
      }),
      {
        target: { value: '20' },
      },
    );

    fireEvent.change(
      screen.getByLabelText(/Gross annual interest rate on your savings/i, {
        exact: false,
      }),
      {
        target: { value: '3' },
      },
    );
  });

  it('renders correctly how long form results', () => {
    render(
      <SavingsCalculator
        isEmbed={false}
        errors={[]}
        queryData={{
          savingGoal: '100000',
          amount: '100',
          amountDuration: '12',
          saved: '200',
          interest: '2',
        }}
        dataPath={DataPath.SavingsCalculator}
        calculatorType={SavingsCalculatorType.HOW_LONG}
      />,
    );
  });

  it('renders correctly how much form results', () => {
    render(
      <SavingsCalculator
        isEmbed={false}
        lang="en"
        errors={[]}
        queryData={{
          savingGoal: '3000',
          amount: '100',
          durationMonth: '2',
          durationYear: '2025',
          saved: '100',
          interest: '3',
        }}
        dataPath={DataPath.SavingsCalculator}
        calculatorType={SavingsCalculatorType.HOW_MUCH}
      />,
    );
  });
});
