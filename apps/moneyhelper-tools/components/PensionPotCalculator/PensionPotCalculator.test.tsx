import '@testing-library/jest-dom';
import { fireEvent, getByText, render, screen } from '@testing-library/react';
import { PensionPotCalculator } from './PensionPotCalculator';
import { useRouter } from 'next/router';
import { DataPath } from 'types';
import { DataFromQuery } from 'utils/pageFilter';

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

let scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

jest.mock('hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: jest.fn(),
  }),
}));

const analayticsProps = {
  pageName: 'pageName',
  pageTitle: 'pageTitle',
  toolName: 'toolName',
  stepNames: 'Calculate',
  categoryLevels: ['Pensions & retirement', 'Taking your pension'],
};

const renderPensionPotCalculator = (
  dataPath: DataPath,
  query: DataFromQuery = {},
) => {
  const { container } = render(
    <PensionPotCalculator
      action={''}
      dataPath={dataPath}
      isEmbed={true}
      errors={{}}
      queryData={query}
      analyticsData={analayticsProps}
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
  it('renders correctly with errors', () => {
    const { container } = render(
      <PensionPotCalculator
        action={''}
        dataPath={DataPath.CashInChunksCalculator}
        isEmbed={false}
        errors={{
          income: { field: 'chunk', type: 'required' },
          chunk: { field: 'chunk', type: 'required' },
          pot: { field: 'pot', type: 'required' },
        }}
        queryData={{}}
        analyticsData={analayticsProps}
      />,
    );

    fireEvent(
      getByText(container, 'Calculate'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(screen.queryAllByText('Enter a figure').length).toBe(3);
  });

  it('renders correctly cash in chunks', () => {
    const push = jest.fn();
    MockRouter(push);

    const container = renderPensionPotCalculator(
      DataPath.CashInChunksCalculator,
    );

    fireEvent.change(screen.getByLabelText(/What is your yearly income?/i), {
      target: { value: '10000' },
    });

    fireEvent.change(screen.getByLabelText(/How much is in your pot?/i), {
      target: { value: '10000' },
    });

    fireEvent.change(
      screen.getByLabelText(
        /How much do you want to take as your first cash chunk?/i,
      ),
      {
        target: { value: '1000' },
      },
    );

    fireEvent(
      getByText(container, 'Calculate'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    const expectedParams = {
      hash: 'results',
      pathname: undefined,
      query: {
        chunk: '1,000',
        income: '10,000',
        pot: '10,000',
        language: 'en',
      },
    };

    expect(push).toHaveBeenCalledWith(expectedParams, undefined, {
      scroll: false,
    });

    expect(container).toMatchSnapshot();
  });

  it('renders results correctly cash in chunks', () => {
    const push = jest.fn();
    MockRouter(push);

    const container = renderPensionPotCalculator(
      DataPath.CashInChunksCalculator,
      {
        income: '10000',
        pot: '10000',
        chunk: '1000',
        updateChunk: '1000',
      },
    );

    fireEvent.change(screen.getByLabelText(/or try a different cash chunk:/i), {
      target: { value: '100' },
    });

    expect(push).toHaveBeenCalled();

    expect(container).toMatchSnapshot();
  });

  it('renders results correctly take whole pot', () => {
    const container = renderPensionPotCalculator(DataPath.TakeWholePot, {
      income: '10000',
      pot: '10000',
    });

    expect(container).toMatchSnapshot();
  });

  it('renders results correctly guaranteed income', () => {
    const container = renderPensionPotCalculator(
      DataPath.GuaranteedIncomeEstimator,
      {
        pot: '100000',
        age: '57',
      },
    );

    expect(container).toMatchSnapshot();
  });

  it('renders results correctly leave pot untouched', () => {
    const push = jest.fn();
    MockRouter(push);
    const container = renderPensionPotCalculator(DataPath.LeavePotUntouched, {
      pot: '100000',
      month: '100',
    });

    fireEvent.change(
      screen.getByLabelText(/or try paying in a different amount each month:/i),
      {
        target: { value: '200' },
      },
    );

    expect(push).toHaveBeenCalled();

    expect(container).toMatchSnapshot();
  });

  it('renders results correctly adjustable income', () => {
    const push = jest.fn();
    MockRouter(push);

    const container = renderPensionPotCalculator(
      DataPath.AjustableIncomeEstimator,
      {
        pot: '100000',
        age: '',
      },
    );

    fireEvent.change(
      screen.getByLabelText(/or try a different monthly income:/i),
      {
        target: { value: '400' },
      },
    );

    expect(push).toHaveBeenCalled();

    fireEvent.change(
      screen.getByLabelText(/or try a different monthly income:/i),
      {
        target: { value: '' },
      },
    );

    expect(push).toHaveBeenCalled();

    expect(container).toMatchSnapshot();
  });
});
