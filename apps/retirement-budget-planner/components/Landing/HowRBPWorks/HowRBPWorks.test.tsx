import { render, screen } from '@testing-library/react';

import { HowRBPWorks } from '../HowRBPWorks/HowRBPWorks';
import { mockTranslationDataEn } from 'lib/mocks/mockUseTranslations';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mockTranslationDataEn[key] ?? key,
      tList: (key: string) => mockTranslationDataEn[key] ?? key,
      locale: 'en',
    }),
  };
});

describe('test HowRBPWorks component', () => {
  it('should render the component', () => {
    const { container } = render(<HowRBPWorks lang={'en'} />);
    expect(container).toMatchSnapshot();

    expect(
      screen.getByRole('heading', { name: 'What you’ll get' }),
    ).toBeInTheDocument();
    expect(screen.getByText('This tool will show you:')).toBeInTheDocument();
    expect(
      screen.getByText('a simple summary of your likely costs in retirement'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "how much retirement income you're estimated to get from your State Pension age",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('what to do if your costs are higher than your income.'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'How it works' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'We’ll ask you for details of your finances and future plans, including:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('when you’d like to retire')).toBeInTheDocument();
    expect(
      screen.getByText('your estimated retirement income'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'your likely costs after you retire, such as bills, rent and travel.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'What you’ll need' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('To get the most accurate results, it’s best to:'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'check your State Pension forecast (opens in a new window)',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('when you’d like to retire')).toBeInTheDocument();
    expect(
      screen.getByText('on GOV.UK to find out how much you’re on track to get'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'know how much any private pensions are estimated to pay you – you can usually log in to your provider’s online account or use the last annual statement you received',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'use a bank statement to check all the costs you currently have.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Start my retirement budget',
      }),
    ).toBeInTheDocument();
  });
});
