import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { expandableContentMap } from './expandableContentMap';
import type { SalaryBreakdownOutput } from '../../../utils/calculations/getSalaryBreakdown/getSalaryBreakdown';

// Only the pension figures are read by the pension summary
const pensionBreakdown = (
  employee: { yearly: number; monthly: number },
  employer: { yearly: number; monthly: number },
) =>
  ({
    employeePensionContributions: { ...employee, weekly: 0, daily: 0 },
    employerPensionContributions: { ...employer, weekly: 0, daily: 0 },
  } as unknown as SalaryBreakdownOutput);

describe('expandableContentMap', () => {
  const z = (obj: { en: React.ReactNode; cy: React.ReactNode }) => obj.en;

  it('renders grossIncome English content', () => {
    const Content = expandableContentMap.grossIncome(z);
    render(<>{Content}</>);
    expect(
      screen.getByText(
        /Gross income is your salary before anything else is taken out/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders grossIncome Welsh content', () => {
    const zWelsh = (obj: { en: React.ReactNode; cy: React.ReactNode }) =>
      obj.cy;
    const Content = expandableContentMap.grossIncome(zWelsh);
    render(<>{Content}</>);
    expect(
      screen.getByText(
        /Incwm gros yw eich cyflog cyn i unrhyw beth arall gael ei gymryd allan. Nid yw'n eich cyflog mynd adref./i,
      ),
    ).toBeInTheDocument();
  });

  it('renders personalAllowance English content with both paragraphs and links', () => {
    const Content = expandableContentMap.personalAllowance(z);
    render(<>{Content}</>);
    expect(
      screen.getByText(
        /Personal allowance is the amount you can earn before tax/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Moneyhelper/i })).toHaveAttribute(
      'href',
      expect.stringContaining(
        'moneyhelper.org.uk/en/work/employment/how-income-tax-and-personal-allowance-works',
      ),
    );
    expect(
      screen.getByRole('link', { name: /Marriage Allowance/i }),
    ).toHaveAttribute(
      'href',
      expect.stringContaining('marriage-and-married-couples-allowance'),
    );
  });

  it('renders personalAllowance Welsh content with both paragraphs and links', () => {
    const zWelsh = (obj: { en: React.ReactNode; cy: React.ReactNode }) =>
      obj.cy;
    const Content = expandableContentMap.personalAllowance(zWelsh);
    render(<>{Content}</>);
    expect(
      screen.getByText(
        /Lwfans personol yw'r swm y gallwch ei ennill cyn i dreth gael ei chymryd o'ch incwm gros, darganfyddwch fwy am sut mae hyn yn gweithio yn/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /HelpwrArian/i })).toHaveAttribute(
      'href',
      expect.stringContaining(
        'moneyhelper.org.uk/cy/work/employment/how-income-tax-and-personal-allowance-works',
      ),
    );
    expect(
      screen.getByRole('link', { name: /Lwfans Priodas/i }),
    ).toHaveAttribute(
      'href',
      expect.stringContaining('marriage-and-married-couples-allowance'),
    );
  });

  it('renders incomeTax English content with link', () => {
    const Content = expandableContentMap.incomeTax(z);
    render(<>{Content}</>);
    expect(
      screen.getByText(
        /Usually, HMRC will update your tax code when your income changes/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /what to do if you’re on an emergency tax code/i,
      }),
    ).toHaveAttribute('href', expect.stringContaining('emergency-tax-codes'));
  });

  it('renders incomeTax Welsh content with link', () => {
    const zWelsh = (obj: { en: React.ReactNode; cy: React.ReactNode }) =>
      obj.cy;
    const Content = expandableContentMap.incomeTax(zWelsh);
    render(<>{Content}</>);
    expect(
      screen.getByText(
        /Fel arfer, bydd CThEF yn diweddaru eich cod treth pan fydd eich incwm yn newid/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /beth i'w wneud os ydych chi ar god treth brys/i,
      }),
    ).toHaveAttribute('href', expect.stringContaining('emergency-tax-codes'));
  });

  describe('pensionSummary', () => {
    const zWelsh = (obj: { en: React.ReactNode; cy: React.ReactNode }) =>
      obj.cy;

    const breakdown = pensionBreakdown(
      { yearly: 1500, monthly: 125 },
      { yearly: 3000, monthly: 250 },
    );

    it('renders nothing without a breakdown', () => {
      expect(expandableContentMap.pensionSummary(z)).toBeNull();
      expect(
        expandableContentMap.pensionSummary(z, {
          frequency: 'monthly',
          breakdowns: [],
        }),
      ).toBeNull();
    });

    it('renders the employee, employer and total amounts for the frequency', () => {
      const { container } = render(
        <>
          {expandableContentMap.pensionSummary(z, {
            frequency: 'monthly',
            breakdowns: [breakdown],
          })}
        </>,
      );

      expect(container).toHaveTextContent(
        'You pay £125 and your employer pays £250 directly into your pension, making £375 in total.',
      );
      expect(container).not.toHaveTextContent('For Salary 1');
    });

    it('follows the selected frequency', () => {
      const { container } = render(
        <>
          {expandableContentMap.pensionSummary(z, {
            frequency: 'yearly',
            breakdowns: [breakdown],
          })}
        </>,
      );

      expect(container).toHaveTextContent(
        'You pay £1,500 and your employer pays £3,000 directly into your pension, making £4,500 in total.',
      );
    });

    it('keeps pence and sums the displayed figures', () => {
      const { container } = render(
        <>
          {expandableContentMap.pensionSummary(z, {
            frequency: 'monthly',
            breakdowns: [
              pensionBreakdown(
                { yearly: 1750, monthly: 145.83 },
                { yearly: 1050, monthly: 87.5 },
              ),
            ],
          })}
        </>,
      );

      expect(container).toHaveTextContent(
        'You pay £145.83 and your employer pays £87.50 directly into your pension, making £233.33 in total.',
      );
    });

    it('prefixes each salary in comparison mode', () => {
      const { container } = render(
        <>
          {expandableContentMap.pensionSummary(z, {
            frequency: 'monthly',
            breakdowns: [
              breakdown,
              pensionBreakdown(
                { yearly: 1200, monthly: 100 },
                { yearly: 1800, monthly: 150 },
              ),
            ],
          })}
        </>,
      );

      expect(container).toHaveTextContent(
        'For Salary 1: You pay £125 and your employer pays £250 directly into your pension, making £375 in total.',
      );
      expect(container).toHaveTextContent(
        'For Salary 2: You pay £100 and your employer pays £150 directly into your pension, making £250 in total.',
      );
    });

    it('renders Welsh content', () => {
      const { container } = render(
        <>
          {expandableContentMap.pensionSummary(zWelsh, {
            frequency: 'monthly',
            breakdowns: [breakdown, breakdown],
          })}
        </>,
      );

      expect(container).toHaveTextContent(
        "Ar gyfer Cyflog 1: Rydych chi'n talu £125 ac mae eich cyflogwr yn talu £250 yn uniongyrchol i'ch pensiwn, sy'n gwneud cyfanswm o £375.",
      );
      expect(container).toHaveTextContent('Ar gyfer Cyflog 2:');
    });
  });
});
