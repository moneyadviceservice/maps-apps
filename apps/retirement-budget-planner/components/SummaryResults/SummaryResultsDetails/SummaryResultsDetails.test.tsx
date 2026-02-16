import { createEvent, fireEvent, render, screen } from '@testing-library/react';

import { SummaryResultsDetails } from './SummaryResultsDetails';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mapping: Record<string, string | string[]> = {
    // Title
    'summaryPage.heading':
      'From your State Pension Age of **67**, your retirement income could be **£40,092** a year after tax.',

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
      'Your retirement income might need to last for over X years',
    'summaryPage.retirementCallout.lifeExpectancy.content':
      'Based on average life expectancies, you’ll likely need to budget to make sure your retirement income lasts until you’re at least xx (84 for men, 87 for women).\n\nThis means you should be careful not to run out of money too soon.  \nYou can use the Office for National Statistics [life expectancy calculator](https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandlifeexpectancies/articles/lifeexpectancycalculator/2019-06-07) to find out the average life expectancy for someone of your age and sex.',
    'summaryPage.retirementCallout.statePensionAge.title':
      'You plan to retire before you can claim the State Pension',
    'summaryPage.retirementCallout.statePensionAge.content':
      'You’ll reach your State Pension age after your planned retirement date.  \nThis means you:',
    'summaryPage.retirementCallout.statePensionAge.listItems': [
      'Will not be able to claim the State Pension when you first plan to retire',
      'Need to make sure you can afford to live off income from other sources until you can claim the State Pension.',
    ],

    // Next steps
    'summaryPage.nextStepsCallout.genderGap.title':
      'Check if you’re affected by the gender pensions gaps',
    'summaryPage.nextStepsCallout.genderGap.content':
      'Many women retire with up to half as much retirement savings as men, often due to caring responsibilities and working lower paid jobs.\n\nFor help, see our guide about [ways to close the gender pensions gap.](https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot)',

    // Buttons
    'summaryPage.cta.save': 'Save results',
    'summaryPage.cta.restart': 'Start again',
  };
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mapping[key] ?? key,
      z: (obj: { en: string }) => obj.en,
      tList: (key: string) => mapping[key] ?? key,
      locale: 'en',
    }),
  };
});

describe('test SummaryResultsDetails component', () => {
  it('should render the component', async () => {
    render(<SummaryResultsDetails />);

    const links = screen.getAllByRole('link');

    // Title
    expect(
      screen.getByRole('heading', {
        name: /your retirement income might need to last for over x years/i,
      }),
    ).toBeInTheDocument();

    // Tax rates disclaimer
    expect(
      screen.getByText(
        /this is based the current income tax rates for england, wales and northern ireland/i,
      ),
    ).toBeInTheDocument();
    const taxRatesLink = links.find((link) =>
      /scottish income tax rates/i.test(link.textContent ?? ''),
    );
    expect(taxRatesLink).toBeInTheDocument();
    expect(taxRatesLink).toHaveAttribute(
      'href',
      'https://www.gov.uk/scottish-income-tax',
    );

    // Already retired disclaimer
    expect(screen.getByText(/already retired/i)).toBeInTheDocument();
    const alreadyRetiredLink = links.find((link) =>
      /budget planner/i.test(link.textContent ?? ''),
    );
    expect(alreadyRetiredLink).toBeInTheDocument();
    expect(alreadyRetiredLink).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
    );

    // Income vs costs callouts
    expect(
      screen.getByRole('heading', {
        name: /you should have money left over/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /your costs are lower than your estimated retirement income/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /your estimated retirement income is unlikely to cover your costs/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/your costs are higher than the retirement income/i),
    ).toBeInTheDocument();

    // Chart and total estimate
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

    // Extra callouts
    expect(
      screen.getByRole('heading', {
        name: /your retirement income might need to last for over x years/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/based on average life expectancies/i),
    ).toBeInTheDocument();
    const lifeExpectancyLink = links.find((link) =>
      /life expectancy calculator/i.test(link.textContent ?? ''),
    );
    expect(lifeExpectancyLink).toBeInTheDocument();
    expect(lifeExpectancyLink).toHaveAttribute(
      'href',
      'https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandlifeexpectancies/articles/lifeexpectancycalculator/2019-06-07',
    );

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
      screen.getByText(
        /will not be able to claim the state pension when you first plan to retire/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /need to make sure you can afford to live off income from other sources/i,
      ),
    ).toBeInTheDocument();

    // Next steps
    expect(
      screen.getByRole('heading', {
        name: /check if you’re affected by the gender pensions gaps/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /many women retire with up to half as much retirement savings as men/i,
      ),
    ).toBeInTheDocument();
    const genderGapLink = links.find((link) =>
      /ways to close the gender pensions gap/i.test(link.textContent ?? ''),
    );
    expect(genderGapLink).toBeInTheDocument();
    expect(genderGapLink).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot',
    );

    // Buttons
    const saveButton = screen.getByRole('button', { name: /save results/i });
    expect(saveButton).toBeInTheDocument();
    const saveButtonClickEvent = createEvent.click(saveButton);
    fireEvent(saveButton, saveButtonClickEvent);
    expect(saveButtonClickEvent.defaultPrevented).toBe(true);

    const restartButton = screen.getByRole('button', { name: /start again/i });
    expect(restartButton).toBeInTheDocument();
    const restartButtonClickEvent = createEvent.click(restartButton);
    fireEvent(restartButton, restartButtonClickEvent);
    expect(restartButtonClickEvent.defaultPrevented).toBe(true);
  });
});
