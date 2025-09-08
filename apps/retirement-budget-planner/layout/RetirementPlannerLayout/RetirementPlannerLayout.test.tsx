import { render, screen } from '@testing-library/react';

import { RetirementPlannerLayout } from './RetirementPlannerLayout';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Retirement Budget Planner Layout ', () => {
  it('should display About us page', () => {
    const { container } = render(
      <RetirementPlannerLayout
        title={'About us'}
        pageTitle={'PWD - About us'}
        tabName={'about-us'}
        navTabsData={[
          {
            step: 1,
            tabName: 'about-us',
            title: 'About us',
          },
          { step: 2, tabName: 'income', title: 'Income' },
        ]}
        initialActiveTabId={'about-us'}
        initialEnabledTabCount={1}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render embed version ', () => {
    const { container } = render(
      <RetirementPlannerLayout
        title={'About us'}
        pageTitle={'PWD - About us'}
        tabName={'about-us'}
        navTabsData={[
          {
            step: 1,
            tabName: 'about-us',
            title: 'About us',
          },
          { step: 2, tabName: 'income', title: 'Income' },
        ]}
        initialActiveTabId={'about-us'}
        initialEnabledTabCount={1}
        isEmbedded={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should not have a title on the page', () => {
    render(
      <RetirementPlannerLayout
        title={''}
        pageTitle={'PWD - About us'}
        tabName={'about-us'}
        navTabsData={[
          {
            step: 1,
            tabName: 'about-us',
            title: 'About us',
          },
          { step: 2, tabName: 'income', title: 'Income' },
        ]}
        initialActiveTabId={'about-us'}
        initialEnabledTabCount={1}
      />,
    );

    expect(screen.getByTestId('title').innerText).toBe(undefined);
  });
});
