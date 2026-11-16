import { render, screen, within } from '@testing-library/react';

import { convertToAnnualSalary } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';

import { hasSalaryCallouts, SalaryCallouts } from './SalaryCallouts';

jest.mock('hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: () => 'en',
  useLanguage: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string }) => en,
    locale: 'en',
  }),
}));

const props = {
  salary: {
    grossIncome: '12',
    grossIncomeFrequency: 'hourly' as const,
    hoursPerWeek: '51',
    taxCode: '1234X',
    pensionValue: 0,
    employerPensionValue: 0,
    country: 'England/NI/Wales' as const,
  },
  yearlyGrossIncome: 31824,
  uncappedIncomeTax: 1000,
  taxYear: '2025/26' as const,
  className: 'lg:hidden',
};

const scenarios = [
  {
    number: 1,
    grossIncome: 200,
    grossIncomeFrequency: 'hourly' as const,
    hoursPerWeek: '59',
    taxCode: '1257L',
    pensionValue: 200,
    uncappedTaxRatio: 0.2,
    expected: ['working-hours-notification', 'high-earnings-notification'],
  },
  {
    number: 2,
    grossIncome: 200,
    grossIncomeFrequency: 'hourly' as const,
    hoursPerWeek: '49',
    taxCode: '1234X',
    pensionValue: 2,
    uncappedTaxRatio: 0.2,
    expected: ['working-hours-notification', 'emergency-tax-code-notification'],
  },
  {
    number: 3,
    grossIncome: 12,
    grossIncomeFrequency: 'hourly' as const,
    hoursPerWeek: '47',
    taxCode: '1234X',
    pensionValue: 0,
    uncappedTaxRatio: 0.2,
    expected: ['minimum-wage-notification', 'emergency-tax-code-notification'],
  },
  {
    number: 4,
    grossIncome: 12,
    grossIncomeFrequency: 'hourly' as const,
    hoursPerWeek: '51',
    taxCode: '1234X',
    pensionValue: 0,
    uncappedTaxRatio: 0.2,
    expected: ['minimum-wage-notification', 'working-hours-notification'],
  },
  {
    number: 5,
    grossIncome: 13,
    grossIncomeFrequency: 'hourly' as const,
    hoursPerWeek: '35',
    taxCode: 'K1234X',
    pensionValue: 12.5,
    uncappedTaxRatio: 0.2,
    expected: ['emergency-tax-code-notification'],
  },
  {
    number: 6,
    grossIncome: 13,
    grossIncomeFrequency: 'hourly' as const,
    hoursPerWeek: '35',
    taxCode: 'K9999X',
    pensionValue: 0,
    uncappedTaxRatio: 0.6,
    expected: ['emergency-tax-code-notification', 'tax-cap-notification'],
  },
  {
    number: 7,
    grossIncome: 102000,
    grossIncomeFrequency: 'annual' as const,
    hoursPerWeek: '40',
    taxCode: '1000X',
    pensionValue: 5,
    uncappedTaxRatio: 0.2,
    expected: ['emergency-tax-code-notification', 'tax-relief-notification'],
  },
  {
    number: 8,
    grossIncome: 102000,
    grossIncomeFrequency: 'annual' as const,
    hoursPerWeek: '40',
    taxCode: '1257L',
    pensionValue: 5,
    uncappedTaxRatio: 0.2,
    expected: ['high-earnings-notification', 'tax-relief-notification'],
  },
];

describe('SalaryCallouts', () => {
  it.each(scenarios)(
    'matches the visible callouts for ticket scenario $number',
    (scenario) => {
      const yearlyGrossIncome = convertToAnnualSalary({
        grossIncome: scenario.grossIncome,
        frequency: scenario.grossIncomeFrequency,
        hoursPerWeek: Number(scenario.hoursPerWeek),
      });

      render(
        <SalaryCallouts
          {...props}
          salary={{
            ...props.salary,
            grossIncome: String(scenario.grossIncome),
            grossIncomeFrequency: scenario.grossIncomeFrequency,
            hoursPerWeek: scenario.hoursPerWeek,
            taxCode: scenario.taxCode,
            pensionValue: scenario.pensionValue,
          }}
          yearlyGrossIncome={yearlyGrossIncome}
          uncappedIncomeTax={yearlyGrossIncome * scenario.uncappedTaxRatio}
        />,
      );

      const notificationIds = [
        'minimum-wage-notification',
        'working-hours-notification',
        'emergency-tax-code-notification',
        'tax-cap-notification',
        'high-earnings-notification',
        'tax-relief-notification',
      ];
      const visibleCallouts = notificationIds.filter((id) =>
        screen.queryByTestId(id),
      );

      expect(visibleCallouts).toEqual(scenario.expected);
      expect(visibleCallouts).toHaveLength(
        Math.min(scenario.expected.length, 2),
      );
    },
  );

  it('renders only the first two eligible callouts and puts the skip link on the second', () => {
    render(<SalaryCallouts {...props} showSkipToResults />);

    const minimumWage = screen.getByTestId('minimum-wage-notification');
    const workingHours = screen.getByTestId('working-hours-notification');

    expect(minimumWage).toBeInTheDocument();
    expect(workingHours).toBeInTheDocument();
    expect(
      screen.queryByTestId('emergency-tax-code-notification'),
    ).not.toBeInTheDocument();
    expect(
      within(minimumWage).queryByRole('link', { name: 'Skip to results' }),
    ).not.toBeInTheDocument();
    expect(
      within(workingHours).getByRole('link', { name: 'Skip to results' }),
    ).toBeInTheDocument();
  });

  it('uses the existing high earnings rule and priority after the tax cap', () => {
    render(
      <SalaryCallouts
        {...props}
        salary={{
          ...props.salary,
          grossIncome: '102000',
          grossIncomeFrequency: 'annual',
          hoursPerWeek: '40',
          taxCode: '1257L',
          pensionValue: 0,
        }}
        yearlyGrossIncome={102000}
        uncappedIncomeTax={60000}
      />,
    );

    expect(screen.getByTestId('tax-cap-notification')).toBeInTheDocument();
    expect(
      screen.getByTestId('high-earnings-notification'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('reports whether any callout is eligible', () => {
    expect(hasSalaryCallouts(props)).toBe(true);
    expect(
      hasSalaryCallouts({
        ...props,
        salary: {
          ...props.salary,
          grossIncome: '50000',
          grossIncomeFrequency: 'annual',
          hoursPerWeek: '40',
          taxCode: '1257L',
        },
        yearlyGrossIncome: 50000,
        uncappedIncomeTax: 10000,
      }),
    ).toBe(false);
  });
});
