import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { expandableContentMap } from './expandableContentMap';

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
});
