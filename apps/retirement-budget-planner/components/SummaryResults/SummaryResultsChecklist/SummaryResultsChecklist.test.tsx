import { render, screen } from '@testing-library/react';

import { SummaryResultsChecklist } from './SummaryResultsChecklist';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mapping: Record<string, string | string[]> = {
    // Title
    'summaryPage.checklist.title': 'Retirement planning checklist',

    // Pension section
    'summaryPage.checklist.pension.title':
      'Plan how and when to take your pension',
    'summaryPage.checklist.pension.content':
      'When and how to take your pension can affect how comfortable your retirement is. It’s a good idea to understand your options and start planning at least ten years before you plan to retire, so you have time to save more if you need to.\n\nFor step-by-step help, including how to get free guidance, see our guide [How to take your pension](https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/how-to-take-your-pension).',

    // Income section
    'summaryPage.checklist.income.title':
      'Check for ways to boost your retirement income',
    'summaryPage.checklist.income.listItems': [
      'Paying more into your pension – your employer might also match your contributions',
      'Checking you’re getting all the tax relief you’re eligible for',
      'Making sure you’re on track for the maximum State Pension',
      'Delaying your retirement date.',
    ],
    'summaryPage.checklist.income.content':
      'For more information, see our guide [Ways to boost your pension](https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/how-to-increase-your-pension-savings).',

    // Scams section
    'summaryPage.checklist.scams.title':
      'Watch out for pension scams designed to steal your money',
    'summaryPage.checklist.scams.content':
      'Never access your pension or transfer any money to a pension provider because of a cold call, visit, email or text. It’s likely a scam designed to steal your money.\n\nYou might lose all your retirement savings and have to pay an expensive tax bill. For more information, see our guide [How to spot a pension scam](https://www.moneyhelper.org.uk/en/money-troubles/scams/how-to-spot-a-pension-scam).',
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

describe('test SummaryResultsChecklist component', () => {
  it('should render the component', () => {
    render(<SummaryResultsChecklist />);

    // Title
    expect(
      screen.getByRole('heading', { name: /retirement planning checklist/i }),
    ).toBeInTheDocument();

    // Section title
    expect(
      screen.getByText(/plan how and when to take your pension/i),
    ).toBeInTheDocument();

    // Markdown content
    expect(
      screen.getByText(
        /when and how to take your pension can affect how comfortable your retirement is/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /how to take your pension/i }),
    ).toBeInTheDocument();

    // List content
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
    expect(
      listItems.find((listItem) =>
        /paying more into your pension/i.test(listItem.textContent ?? ''),
      ),
    ).toBeInTheDocument();
  });
});
