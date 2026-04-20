import { type ReactNode } from 'react';
import { useRouter } from 'next/router';

import { type FormContextType } from 'context/FormContextProvider';
import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SummaryResultsDetails } from './SummaryResultsDetails';

import '@testing-library/jest-dom';

const mockHandleSaveAndComeBack = jest.fn(() => Promise.resolve());

const mockFormContextProviderProps: FormContextType = {
  handleSaveAndComeBack: mockHandleSaveAndComeBack,
  enabledTabCount: 1,
};

const mockLocale = 'en';

const mockFetch = (
  response: unknown,
  options?: { delay?: number; reject?: boolean },
) => {
  const { delay = 0, reject: shouldReject = false } = { ...options };

  globalThis.fetch = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        const responseFn = shouldReject ? reject : resolve;

        if (delay > 0) {
          setTimeout(() => responseFn(response), delay);
        } else {
          responseFn(response);
        }
      }),
  ) as jest.Mock;
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

jest.mock('../SummaryBreakdownTotal', () => ({
  SummaryBreakdownTotal: () => (
    <section>
      <h3>Your retirement income and costs</h3>
      <p>
        Based on the information you gave us, here’s how your estimated
        retirement income compares to your costs.
      </p>
      <div>[CHART PLACEHOLDER]</div>
    </section>
  ),
}));

jest.mock('context/FormContextProvider', () => ({
  useFormContext: jest.fn(() => mockFormContextProviderProps),
  FormContextProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('context/SessionContextProvider', () => ({
  useSessionId: jest.fn(() => 'mock-session-id-from-context'),
  SessionIdProvider: ({ children }: { children: ReactNode }) => children,
}));
jest.mock('lib/util/summary/income-tax', () => ({
  calculateIncomeTax: jest.fn(() => 20000),
}));

jest.mock('lib/util/summary/next-steps', () => {
  return {
    __esModule: true,
    findDisplayBoostStatePension: jest.fn(),
    getAllCostRelatedNextStepsFlags: jest.fn(),
    getAnnualIncome: jest.fn(() => 40000),
    getlifeExpectancyDetails: jest.fn(),
    hasentitelementsToAdditionalBenefits: jest.fn(),
    shouldDisplayAgeHeading: jest.fn(() => true),
  };
});

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mapping: Record<string, string | string[]> = {
    // Title
    'summaryPage.heading':
      'From your State Pension Age of **{age}**, your retirement income could be **{annualIncome}** a year after tax.',

    // Disclaimers
    'summaryPage.disclaimer.taxRates':
      'This is based the current Income Tax rates for England, Wales and Northern Ireland. You can see the [Scottish Income Tax rates](https://www.gov.uk/scottish-income-tax) on GOV.UK.<br/>Find out more in our guides [tax and pensions](https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/a-guide-to-tax-in-retirement).',
    'summaryPage.disclaimer.alreadyRetired':
      'If you’ve already retired, our full [Budget planner](https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner) will give you a more detailed breakdown of your finances.',

    // Income vs costs callouts
    'summaryPage.incomeCallout.costsLowerThanIncome.title':
      'You should have money left over',
    'summaryPage.incomeCallout.costsLowerThanIncome.content':
      'Your costs are lower than your estimated retirement income, so you should have money left over.\n\nThe [Retirement Living Standards](https://retirementlivingstandards.org.uk/) can give you an idea of the lifestyle you might be able to afford.',
    'summaryPage.incomeCallout.costsHigherThanIncome.title':
      'Your estimated retirement income is unlikely to cover your costs',
    'summaryPage.incomeCallout.costsHigherThanIncome.content':
      'Your costs are higher than the retirement income you’re estimated to receive.\n\nFor help, see our guides about [benefits in retirement](https://www.moneyhelper.org.uk/en/benefits/benefits-in-later-life/benefits-in-retirement) and [ways to boost your pension](https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/how-to-increase-your-pension-savings).',

    // Chart and total estimate
    'summaryPage.chart.title': 'Your retirement income and costs',
    'summaryPage.chart.description':
      'Based on the information you gave us, here’s how your estimated retirement income compares to your costs.',

    // Extra callouts
    'summaryPage.retirementCallout.lifeExpectancy.title':
      'Your retirement income might need to last for over {years} years',
    'summaryPage.retirementCallout.lifeExpectancy.content':
      'Based on average life expectancies, you’ll likely need to budget to make sure your retirement income lasts until you’re at least {age} (84 for men, 87 for women).\n\nThis means you should be careful not to run out of money too soon.\nYou can use the Office for National Statistics [life expectancy calculator](https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandlifeexpectancies/articles/lifeexpectancycalculator/2019-06-07) to find out the average life expectancy for someone of your age and sex.',

    'summaryPage.retirementCallout.statePensionAge.title':
      'You plan to retire before you can claim the State Pension',
    'summaryPage.retirementCallout.statePensionAge.content':
      'You’ll reach your State Pension age after your planned retirement date.\nThis means you:',
    'summaryPage.retirementCallout.statePensionAge.listItems': [
      'Will not be able to claim the State Pension when you first plan to retire',
      'Need to make sure you can afford to live off income from other sources until you can claim the State Pension.',
    ],

    // Next steps (all extra callouts)
    'summaryPage.nextStepsCallout.genderGap.title':
      'Check if you’re affected by the gender pensions gaps',
    'summaryPage.nextStepsCallout.genderGap.content':
      'Many women retire with up to half as much retirement savings as men, often due to caring responsibilities and working lower paid jobs.\n\nFor help, see our guide about [ways to close the gender pensions gap.](https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot)',

    'summaryPage.nextStepsCallout.statePension.title':
      'Check your State Pension forecast',
    'summaryPage.nextStepsCallout.statePension.content':
      'You might be able to boost your State Pension by paying voluntary NI contributions.',

    'summaryPage.nextStepsCallout.benefits.title':
      'Check if you can get extra money',
    'summaryPage.nextStepsCallout.benefits.content':
      'You could be entitled to additional benefits in retirement.',

    'summaryPage.nextStepsCallout.borrowing.title': 'Review your borrowing',
    'summaryPage.nextStepsCallout.borrowing.content':
      'Consider options to manage or reduce your unsecured borrowing.',

    'summaryPage.nextStepsCallout.mortgage.title':
      'Plan for your mortgage in retirement',
    'summaryPage.nextStepsCallout.mortgage.content':
      'Think about how you’ll pay your mortgage when you retire.',

    'summaryPage.nextStepsCallout.socialHousing.title':
      'If you rent or live in a care home',
    'summaryPage.nextStepsCallout.socialHousing.content':
      'Learn about support and options available if you rent or live in a care home.',

    // Buttons
    'summaryPage.cta.save': 'Save results',
    'summaryPage.cta.restart': 'Start again',
    'summaryPage.cta.loading': 'Loading',
  };

  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mapping[key] ?? key,
      z: (obj: { en: string }) => obj.en,
      tList: (key: string) => mapping[key] ?? key,
      locale: mockLocale,
    }),
  };
});

const {
  findDisplayBoostStatePension,
  getAllCostRelatedNextStepsFlags,
  getlifeExpectancyDetails,
  hasentitelementsToAdditionalBenefits,
} = jest.requireMock('lib/util/summary/next-steps');

const baseProps: React.ComponentProps<typeof SummaryResultsDetails> = {
  income: { privatePension: '2000', privatePensionFrequency: 'month' },
  costs: { water: '20' },
  divisor: 'month',
  tabName: 'summary',
  partner: {
    id: 1,
    dob: { day: '01', month: '01', year: '1960' },
    gender: 'male',
    retireAge: '67',
  },
};

const beforeEachDefault = () => {
  jest.clearAllMocks();

  getlifeExpectancyDetails.mockReturnValue({
    remainingLifeExpectancy: 25,
    lifeExpectancyTitle:
      'Your retirement income might need to last for over 25 years',
    lifeExpectancyContent:
      'Based on average life expectancies, you’ll likely need to budget to make sure your retirement income lasts until you’re at least xx (84 for men, 87 for women).\n\nThis means you should be careful not to run out of money too soon.\nYou can use the Office for National Statistics [life expectancy calculator](https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandlifeexpectancies/articles/lifeexpectancycalculator/2019-06-07) to find out the average life expectancy for someone of your age and sex.',
  });
  findDisplayBoostStatePension.mockReturnValue(false);
  hasentitelementsToAdditionalBenefits.mockReturnValue(false);
  getAllCostRelatedNextStepsFlags.mockReturnValue([false, false, false]);
};

const renderComponent = (
  overrides?: Partial<React.ComponentProps<typeof SummaryResultsDetails>>,
) => render(<SummaryResultsDetails {...baseProps} {...overrides} />);

const clickStartAgainButton = async () => {
  const restartButton = screen.getByRole('button', { name: /start again/i });
  const user = userEvent.setup();
  await user.click(restartButton);
  return restartButton;
};

const expectFetchCalledWithSessionId = (sessionId: string) => {
  expect(globalThis.fetch).toHaveBeenCalledWith('/api/start-again', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      language: 'en',
    }),
  });
};

describe('SummaryResultsDetails', () => {
  beforeEach(() => {
    beforeEachDefault();
  });

  it('renders the surplus path (male): shows “left over” callout; hides deficit, gender gap, and retire-before-SPA', async () => {
    renderComponent();
    const user = userEvent.setup();

    expect(
      screen.getByText(/your retirement income might need to last for over/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /this is based the current income tax rates for england, wales and northern ireland/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /scottish income tax rates/i }),
    ).toHaveAttribute('href', 'https://www.gov.uk/scottish-income-tax');

    expect(screen.getByText(/already retired/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /budget planner/i }),
    ).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
    );

    expect(
      screen.getByRole('heading', { name: /you should have money left over/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: /your estimated retirement income is unlikely to cover your costs/i,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /your retirement income and costs/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /based on the information you gave us, here’s how your estimated retirement income compares to your costs/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('[CHART PLACEHOLDER]')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /your retirement income might need to last for over 25 years/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /life expectancy calculator/i }),
    ).toHaveAttribute(
      'href',
      'https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandlifeexpectancies/articles/lifeexpectancycalculator/2019-06-07',
    );

    expect(
      screen.queryByRole('heading', {
        name: /you plan to retire before you can claim the state pension/i,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: /check if you’re affected by the gender pensions gaps/i,
      }),
    ).not.toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: /save results/i });
    await user.click(saveButton);
    await waitFor(() =>
      expect(mockHandleSaveAndComeBack).toHaveBeenCalledTimes(1),
    );
  });

  it('hides life expectancy section when remainingLifeExpectancy is 0', () => {
    getlifeExpectancyDetails.mockReturnValue({
      remainingLifeExpectancy: 0,
      lifeExpectancyTitle:
        'Your retirement income might need to last for over 0 years',
      lifeExpectancyContent: '…',
    });

    renderComponent();

    expect(
      screen.queryByRole('heading', {
        name: /your retirement income might need to last for over/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('renders all “next steps” callouts when corresponding flags are true', () => {
    findDisplayBoostStatePension.mockReturnValue(true);
    hasentitelementsToAdditionalBenefits.mockReturnValue(true);
    getAllCostRelatedNextStepsFlags.mockReturnValue([
      true, // mortgage
      true, // rent/care home (social housing)
      true, // unsecured loans (borrowing)
    ]);

    renderComponent({
      partner: {
        ...baseProps.partner,
        gender: 'female', // to also show gender gap
      },
    });

    // Gender gap
    expect(
      screen.getByRole('heading', {
        name: /check if you’re affected by the gender pensions gaps/i,
      }),
    ).toBeInTheDocument();

    // State Pension forecast
    expect(
      screen.getByRole('heading', {
        name: /check your state pension forecast/i,
      }),
    ).toBeInTheDocument();

    // Benefits
    expect(
      screen.getByRole('heading', {
        name: /check if you can get extra money/i,
      }),
    ).toBeInTheDocument();

    // Borrowing (unsecured loans)
    expect(
      screen.getByRole('heading', { name: /review your borrowing/i }),
    ).toBeInTheDocument();

    // Mortgage
    expect(
      screen.getByRole('heading', {
        name: /plan for your mortgage in retirement/i,
      }),
    ).toBeInTheDocument();

    // Social housing / rent or care home
    expect(
      screen.getByRole('heading', {
        name: /if you rent or live in a care home/i,
      }),
    ).toBeInTheDocument();
  });

  it('renders the deficit + retire-before-SPA path (female): shows deficit callout, state pension timing, and gender gap', () => {
    renderComponent({
      income: { privatePension: '100', privatePensionFrequency: 'month' },
      costs: { water: '3000' },
      partner: {
        id: 2,
        dob: { day: '01', month: '01', year: '1965' },
        gender: 'female',
        retireAge: '60',
      },
    });

    expect(
      screen.getByRole('heading', {
        name: /your estimated retirement income is unlikely to cover your costs/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: /you should have money left over/i,
      }),
    ).not.toBeInTheDocument();

    // Retire-before-State-Pension callout
    expect(
      screen.getByRole('heading', {
        name: /you plan to retire before you can claim the state pension/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /you’ll reach your state pension age after your planned retirement date/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /check if you’re affected by the gender pensions gaps/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: /ways to close the gender pensions gap/i,
      }),
    ).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot',
    );
  });

  it('handles invalid frequency factor by defaulting to 1', () => {
    renderComponent({
      divisor: 'mock-invalid-frequency-factor',
      income: { privatePension: '2000' },
      costs: { water: '1000' },
    });

    expect(
      screen.getByRole('heading', {
        name: /you should have money left over/i,
      }),
    ).toBeInTheDocument();
  });
});

describe('test SummaryResultsDetails "Start again" button', () => {
  beforeEach(() => {
    beforeEachDefault();
  });

  it('renders "Start again" button', async () => {
    renderComponent();

    const restartButton = screen.getByRole('button', { name: /start again/i });
    expect(restartButton).toBeInTheDocument();
  });

  it('calls handleClickStartAgain when "Start again" button is clicked', async () => {
    mockFetch({
      ok: true,
      redirected: false,
      url: '',
    });

    renderComponent();

    await clickStartAgainButton();

    await waitFor(() => {
      expectFetchCalledWithSessionId('mock-session-id-from-context');
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/en/${PAGES_NAMES.ABOUTYOU}`);
    });
  });

  it('uses sessionId prop when provided instead of context sessionId', async () => {
    mockFetch({
      ok: true,
      redirected: false,
      url: '',
    });

    renderComponent({
      sessionId: 'mock-session-id-from-prop',
    });

    await clickStartAgainButton();

    await waitFor(() => {
      expectFetchCalledWithSessionId('mock-session-id-from-prop');
    });
  });

  it('uses empty sessionId when neither prop nor context provides a value', async () => {
    const { useSessionId } = jest.requireMock('context/SessionContextProvider');
    useSessionId.mockReturnValueOnce(null);

    mockFetch({
      ok: true,
      redirected: false,
      url: '',
    });

    renderComponent();

    await clickStartAgainButton();

    await waitFor(() => {
      expectFetchCalledWithSessionId('');
    });
  });

  it('handles redirected response from start-again API', async () => {
    mockFetch({
      ok: true,
      redirected: true,
      url: '/en/mock-redirect',
    });

    renderComponent();

    await clickStartAgainButton();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en/mock-redirect');
    });
  });

  it('handles error when start-again API call fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockError = new Error('API Error');
    mockFetch(mockError, { reject: true });

    renderComponent();

    await clickStartAgainButton();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith({ error: mockError });
    });

    consoleErrorSpy.mockRestore();
  });

  it('shows loading state when "Start again" button is clicked', async () => {
    mockFetch(
      {
        ok: true,
        redirected: false,
        url: '',
      },
      { delay: 100 },
    );

    renderComponent();

    await clickStartAgainButton();

    expect(
      screen.getByRole('button', { name: /loading/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
      expect(
        screen.getByRole('button', { name: /start again/i }),
      ).toBeInTheDocument();
    });
  });

  it('prevents multiple clicks on "Start again" button while loading', async () => {
    mockFetch(
      {
        ok: true,
        redirected: false,
        url: '',
      },
      { delay: 100 },
    );

    renderComponent();

    const restartButton = screen.getByRole('button', { name: /start again/i });
    const user = userEvent.setup();
    await user.click(restartButton);
    await user.click(restartButton);
    await user.click(restartButton);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
