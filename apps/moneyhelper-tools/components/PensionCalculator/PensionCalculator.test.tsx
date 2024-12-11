import { useRouter } from 'next/router';

import { StepName } from 'data/workplace-pension-calculator/pension-data';
import { DataPath } from 'types/types';
import { ContributionCalculatorResults } from 'utils/PensionCalculator/contributionCalculator';
import {
  fireEvent,
  getByLabelText,
  getByTestId,
  getByText,
  render,
  screen,
} from '@testing-library/react';

import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { PensionCalculator } from './PensionCalculator';

import '@testing-library/jest-dom';

const query = {
  currentStep: 'results',
  age: '29',
  contributionType: 'part',
  frequency: '1',
  salary: '20,000',
  employerContribution: '5.0',
  employeeContribution: '10.0',
} as DataFromQuery;

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {},
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

jest.mock('hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: jest.fn(),
  }),
}));

const scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

describe('PensionCalculator component', () => {
  it('renders correctly step details', () => {
    const { container } = render(
      <PensionCalculator
        queryData={{}}
        lang="en"
        errors={{}}
        currentStep={StepName.DETAILS}
        results={{} as ContributionCalculatorResults}
      />,
    );
    const contact = screen.getByTestId('pension-calculator');
    const pensionDetails = screen.getByTestId('pension-details');
    fireEvent(
      getByText(container, 'Next'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    const errorAge = screen.getByText(/Please enter your age/i);
    const errorSalary = screen.getByText(/Please enter your salary/i);
    expect(errorAge).toBeInTheDocument();
    expect(errorSalary).toBeInTheDocument();
    expect(pensionDetails).toBeInTheDocument();
    expect(contact).toMatchSnapshot();

    fireEvent.change(screen.getByLabelText(/Your age/i), {
      target: { value: '25' },
    });
    fireEvent.change(screen.getByLabelText(/Your salary/i), {
      target: { value: '30000' },
    });

    fireEvent(
      getByText(container, 'Next'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(errorAge).not.toBeInTheDocument();
    expect(errorSalary).not.toBeInTheDocument();
    expect(contact).toMatchSnapshot();
  });

  it('renders correctly step details with age error and warnings', () => {
    const { container } = render(
      <PensionCalculator
        queryData={{}}
        lang="en"
        errors={{ age: { field: 'age', type: 'required' } }}
        currentStep={StepName.DETAILS}
        results={{} as ContributionCalculatorResults}
      />,
    );
    expect(screen.getByText(/Please enter your age/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Your age/i), {
      target: { value: '12' },
    });

    expect(getByText(container, 'Next')).toBeDisabled();

    expect(
      screen.getByText(/You are too young to join a workplace pension/i),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Your age/i), {
      target: { value: '76' },
    });

    expect(
      screen.getByText(
        /You are not entitled to be automatically enrolled into a workplace pension. Many of the tax benefits of saving into a pension stop at age 75./i,
      ),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Your age/i), {
      target: { value: '18' },
    });

    expect(
      screen.getByText(
        /Your employer will not automatically enrol you into a pension but you can choose to join. /i,
      ),
    ).toBeInTheDocument();

    expect(getByText(container, 'Next')).toBeEnabled();
  });

  it('renders correctly step details with reset param', () => {
    const { container } = render(
      <PensionCalculator
        queryData={{
          reset: 'true',
        }}
        lang="en"
        errors={{}}
        currentStep={StepName.DETAILS}
        results={{} as ContributionCalculatorResults}
      />,
    );

    const radioPart = getByLabelText(
      container,
      /My employer makes contributions on part of my salary/i,
      {},
    );

    expect((radioPart as HTMLInputElement).checked).toBe(true);
  });

  it('renders correctly step details with salary warnings', () => {
    const { container } = render(
      <PensionCalculator
        queryData={{}}
        lang="en"
        errors={{}}
        currentStep={StepName.DETAILS}
        results={{} as ContributionCalculatorResults}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Your salary/i), {
      target: { value: '5000' },
    });

    expect(
      screen.getByText(
        /Your employer will not automatically enrol you into a pension but you can choose to join/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /At your earnings level, you will have to make contributions based on your full salary./i,
      ),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Your salary/i), {
      target: { value: '6240' },
    });

    expect(
      screen.getByText(
        /Please note: Your earnings are very close to the threshold/i,
      ),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Your salary/i), {
      target: { value: '700' },
    });

    fireEvent.change(getByTestId(container, 'frequency'), {
      target: { value: '13' },
    });

    expect(
      screen.getByText(
        /Your employer will not automatically enrol you into a workplace pension scheme/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders correctly step contributions part salary', () => {
    const { container } = render(
      <PensionCalculator
        lang="en"
        queryData={{
          age: '25',
          contributionType: 'part',
          frequency: '1',
          salary: '5,000',
        }}
        errors={{}}
        currentStep={StepName.CONTRIBUTIONS}
        results={{} as ContributionCalculatorResults}
      />,
    );

    const contact = screen.getByTestId('pension-calculator');
    const pensionContributions = screen.getByTestId('pension-contributions');

    fireEvent.change(screen.getByLabelText(/Enter your contribution/i), {
      target: { value: '5.0' },
    });
    fireEvent.change(
      screen.getByLabelText(/Enter your employer/i, {
        exact: false,
      }),
      {
        target: { value: '2.0' },
      },
    );

    fireEvent(
      getByText(container, 'Calculate your contributions'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(
      screen.queryAllByText(/Employer contribution must be between 3 and 100%/i)
        .length,
    ).toBe(1);
    expect(
      screen.queryAllByText(/Total contribution must be at least 8%/i).length,
    ).toBe(1);

    fireEvent.change(screen.getByLabelText(/Enter your contribution/i), {
      target: { value: '' },
    });

    expect(
      screen.queryAllByText(/Total contribution must be at least 8%/i).length,
    ).toBe(1);

    fireEvent.change(screen.getByLabelText(/Enter your contribution/i), {
      target: { value: '5.0' },
    });

    fireEvent.change(
      screen.getByLabelText(/Enter your employer/i, {
        exact: false,
      }),
      {
        target: { value: '3.0' },
      },
    );

    expect(
      screen.queryAllByText(/Total contribution must be at least 8%/i).length,
    ).toBe(0);
    expect(
      screen.queryAllByText(/Total contribution must be at least 8%/i).length,
    ).toBe(0);

    expect(
      screen.queryAllByText(
        /At your salary level there is no legal minimum contribution/i,
      ).length,
    ).toBe(1);

    expect(pensionContributions).toBeInTheDocument();
    expect(contact).toMatchSnapshot();
  });

  it('renders correctly step contributions full salary and shows max tax releif message', () => {
    const push = jest.fn();
    const query = {
      currentStep: 'contributions',
      age: '28',
      contributionType: 'full',
      frequency: '1',
      salary: '100,000',
    } as DataFromQuery;

    (useRouter as jest.Mock).mockImplementation(() => ({
      push,
      route: DataPath.WorkplacePensionCalculator,
      query: query,
      replace: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    }));

    const { container } = render(
      <PensionCalculator
        queryData={query}
        errors={{}}
        lang="en"
        currentStep={StepName.CONTRIBUTIONS}
        results={{} as ContributionCalculatorResults}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Your contribution/i), {
      target: { value: '40' },
    });

    expect(screen.queryByTestId('tax-relief-message')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Your contribution/i), {
      target: { value: '41' },
    });

    expect(
      screen.getByText(
        /Tax relief is only applied to contributions of up to £40,000/i,
      ),
    ).toBeInTheDocument();

    const cta = getByText(container, 'Calculate your contributions');

    expect(cta).toBeEnabled();

    fireEvent(
      cta,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(push).toHaveBeenCalledWith(
      {
        hash: 'top',
        pathname: DataPath.WorkplacePensionCalculator,
        query: {
          ...query,
          currentStep: StepName.RESULTS,
          employeeContribution: '41',
          employerContribution: '3',
        },
      },
      undefined,
      { scroll: false },
    );
  });

  it('renders correctly step result and shows max tax releif message on contribution step', () => {
    render(
      <PensionCalculator
        queryData={{
          ...query,
          currentStep: StepName.RESULTS,
          salary: '100,000',
          contributionType: 'full',
          employeeContribution: '45',
        }}
        errors={{}}
        lang="en"
        currentStep={StepName.RESULTS}
        results={{} as ContributionCalculatorResults}
      />,
    );

    expect(
      screen.queryAllByText(
        /Tax relief is only applied to contributions of up to £40,000 per year or 100% of your earnings, whichever is lower./i,
      ).length,
    ).toBe(1);
  });

  it('renders correctly step results', () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push,
      route: DataPath.WorkplacePensionCalculator,
      query: query,
      replace: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    }));

    const { container } = render(
      <PensionCalculator
        lang="en"
        isEmbed={true}
        queryData={{
          age: '25',
          contributionType: 'part',
          frequency: '1',
          salary: '30,000',
        }}
        dataPath={DataPath.WorkplacePensionCalculator}
        errors={{}}
        currentStep={StepName.RESULTS}
        results={
          {
            employerContribution: '59.40',
            taxRelief: '19.80',
            totalContribution: '158.40',
            yourContribution: '99.00',
          } as ContributionCalculatorResults
        }
      />,
    );

    fireEvent.change(getByTestId(container, 'results'), {
      target: { value: '1' },
    });

    expect(push).toHaveBeenCalledWith(
      {
        pathname: DataPath.WorkplacePensionCalculator,
        query: { ...query, results: '1' },
      },
      undefined,
      { scroll: false },
    );

    jest.spyOn(window, 'print').mockImplementation(() => {});

    fireEvent(
      getByText(container, 'print', { exact: false }),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    const contact = screen.getByTestId('pension-calculator');
    const pensionResults = screen.getByTestId('pension-results');
    expect(pensionResults).toBeInTheDocument();
    expect(contact).toMatchSnapshot();
  });
  it('renders correctly step results with belowManualOptIn salary', () => {
    resultTaxContributionMessage('6,000');
  });

  it('renders correctly step results with manualOptInRequired salary', () => {
    resultTaxContributionMessage('9,990');
  });

  it('renders correctly step results with overriding query param for result filter 1 year', () => {
    render(
      <PensionCalculator
        lang="cy"
        queryData={{
          age: '25',
          contributionType: 'part',
          frequency: '1',
          salary: '30,000',
          results: '1',
        }}
        dataPath={DataPath.WorkplacePensionCalculator}
        errors={{}}
        currentStep={StepName.RESULTS}
        results={
          {
            employerContribution: '59.40',
            taxRelief: '19.80',
            totalContribution: '158.40',
            yourContribution: '99.00',
          } as ContributionCalculatorResults
        }
      />,
    );
    const contact = screen.getByTestId('pension-calculator');

    expect(
      screen.getByText(/Your yearly contribution/i, { exact: false }),
    ).toBeInTheDocument();
    expect(contact).toMatchSnapshot();
  });

  it('renders correctly step when edit contributions is selected', () => {
    onEdit('edit-contributions', StepName.CONTRIBUTIONS);
  });

  it('renders correctly step when edit details is selected', () => {
    onEdit('edit-details', StepName.DETAILS);
  });

  it('details - renders aria-label correctly with relevent unit', () => {
    render(
      <PensionCalculator
        queryData={{}}
        lang="en"
        errors={{}}
        currentStep={StepName.DETAILS}
        results={{} as ContributionCalculatorResults}
      />,
    );

    const { getByLabelText } = screen;
    const ageField = getByLabelText(/Your age/i);
    const salaryField = getByLabelText(/Your salary/i);

    expect(ageField).toHaveAttribute('aria-label', 'Your age, in years');
    expect(salaryField).toHaveAttribute('aria-label', 'Your salary, in pounds');
  });

  it('contributions - renders aria-label correctly with relevent unit', () => {
    render(
      <PensionCalculator
        lang="en"
        queryData={{
          age: '25',
          contributionType: 'part',
          frequency: '1',
          salary: '5,000',
        }}
        errors={{}}
        currentStep={StepName.CONTRIBUTIONS}
        results={{} as ContributionCalculatorResults}
      />,
    );

    const { getByLabelText } = screen;
    const contributionField = getByLabelText(/Enter your contribution/i);
    const employerContributionField = getByLabelText(/Enter your employer/i);

    expect(contributionField).toHaveAttribute(
      'aria-label',
      'Enter your contribution, in percent',
    );
    expect(employerContributionField).toHaveAttribute(
      'aria-label',
      'Enter your employer’s contribution, in percent',
    );
  });
});

function resultTaxContributionMessage(salary: string) {
  render(
    <PensionCalculator
      lang="en"
      queryData={{
        age: '25',
        contributionType: 'part',
        frequency: '1',
        salary: salary,
      }}
      dataPath={DataPath.WorkplacePensionCalculator}
      errors={{}}
      currentStep={StepName.RESULTS}
      results={{} as ContributionCalculatorResults}
    />,
  );

  expect(
    screen.queryAllByText(
      /If you don’t pay income tax on your earnings, you will only receive tax relief on your pension contributions if your pension scheme/i,
    ).length,
  ).toBe(1);
}

function onEdit(element: string, stepName: StepName) {
  const push = jest.fn();
  (useRouter as jest.Mock).mockImplementation(() => ({
    push,
    route: DataPath.WorkplacePensionCalculator,
    query: query,
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }));

  render(
    <PensionCalculator
      lang="en"
      queryData={{
        age: '25',
        contributionType: 'part',
        frequency: '1',
        salary: '30,000',
        results: '1',
      }}
      dataPath={DataPath.WorkplacePensionCalculator}
      errors={{}}
      currentStep={StepName.RESULTS}
      results={
        {
          employerContribution: '59.40',
          taxRelief: '19.80',
          totalContribution: '158.40',
          yourContribution: '99.00',
        } as ContributionCalculatorResults
      }
    />,
  );

  const el = screen.getByTestId(element);

  fireEvent(
    el,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );

  expect(push).toHaveBeenCalledWith(
    {
      hash: 'top',
      pathname: DataPath.WorkplacePensionCalculator,
      query: { ...query, currentStep: stepName },
    },
    undefined,
    { scroll: false },
  );
}
