import { render } from '@testing-library/react';

import RetirementPlannerWrapper from './RetirementPlannerWrapper';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Retirement Planner Wrapper ', () => {
  it('should display the tool content and tool page', () => {
    const { container } = render(
      <RetirementPlannerWrapper
        isEmbedded={false}
        pageTitle={'Retirement Budget Planner - Pension wise'}
        title={'About us'}
      >
        Retirement Bidget planner tool
      </RetirementPlannerWrapper>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should display the embed tool', () => {
    const { container } = render(
      <RetirementPlannerWrapper
        isEmbedded={true}
        pageTitle={'Retirement Budget Planner - Pension wise'}
        title={'About us'}
      >
        Retirement Bidget planner tool
      </RetirementPlannerWrapper>,
    );
    expect(container).toMatchSnapshot();
  });
});
