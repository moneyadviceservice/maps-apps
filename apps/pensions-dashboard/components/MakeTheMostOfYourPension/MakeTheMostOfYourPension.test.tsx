import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { MakeTheMostOfYourPension } from './MakeTheMostOfYourPension';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

describe('MakeTheMostOfYourPension', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) =>
        ({
          'timeout.make-the-most.heading': 'Make the most of your pension',
          'timeout.make-the-most.description':
            'Our guides can help [make the most of your pension](https://www.moneyhelper.org.uk/en/pensions-and-retirement/make-the-most-of-your-pension).',
          'timeout.make-the-most.tools-intro':
            'You can also use our free tools:',
        }[key] ?? key),
      tList: () => [
        '[Budget planner](https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner) to work out all your essential costs in retirement.',
        '[Pension calculator](https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator) to see how your estimated retirement income would change if you save more.',
      ],
    });
  });

  it('renders guidance copy and external tool links', () => {
    render(<MakeTheMostOfYourPension />);

    expect(
      screen.getByRole('heading', {
        name: 'Make the most of your pension',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('You can also use our free tools:'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /make the most of your pension/i }),
    ).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/make-the-most-of-your-pension',
    );
    expect(
      screen.getByRole('link', { name: /budget planner/i }),
    ).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
    );
    expect(
      screen.getByRole('link', { name: /pension calculator/i }),
    ).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
    );
  });
});
