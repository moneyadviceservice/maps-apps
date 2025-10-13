import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  BudgetPlannerDataProvider,
  useBudgetPlannerProvider,
} from './BudgetPlannerDataProvider';

describe('BudgetPlannerDataProvider', () => {
  it('provides default context values', () => {
    const TestComponent = () => {
      const { dataInContext, setDataInContext } = useBudgetPlannerProvider();
      expect(dataInContext).toEqual({});
      expect(typeof setDataInContext).toBe('function');
      return null;
    };

    render(
      <BudgetPlannerDataProvider>
        <TestComponent />
      </BudgetPlannerDataProvider>,
    );
  });

  it('updates context values', () => {
    const TestComponent = () => {
      const { dataInContext, setDataInContext } = useBudgetPlannerProvider();
      React.useEffect(() => {
        setDataInContext({ testKey: { nestedKey: 'nestedValue' } });
      }, [setDataInContext]);

      return (
        <div data-testid="nestedValue">{dataInContext.testKey?.nestedKey}</div>
      );
    };

    render(
      <BudgetPlannerDataProvider>
        <TestComponent />
      </BudgetPlannerDataProvider>,
    );

    const element = screen.getByTestId('nestedValue');
    expect(element).not.toBeNull();
    expect(element.textContent).toBe('nestedValue');
  });
});
