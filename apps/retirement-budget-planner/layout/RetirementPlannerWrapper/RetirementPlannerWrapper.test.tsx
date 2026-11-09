import { render } from '@testing-library/react';

import RetirementPlannerWrapper from './RetirementPlannerWrapper';
import { PAGES_NAMES } from 'lib/constants/pageConstants';

const mockUseTranslation = jest.fn();

const buildMockTranslation = (locale: 'en' | 'cy') => ({
  locale,
  t: (key: string, _params?: unknown, fallback?: string) => fallback ?? key,
  z: (copy: { en: string; cy: string }) => copy[locale],
});

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock('next/dist/client/resolve-href', () => ({
  resolveHref: () => [null, '/cy'],
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => mockUseTranslation(),
  useTranslation: () => mockUseTranslation(),
}));

describe('Retirement Planner Wrapper ', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue(buildMockTranslation('en'));
  });

  it('should display the beta feedback link for English when not embedded', () => {
    const { container } = render(
      <RetirementPlannerWrapper
        isEmbedded={false}
        pageTitle={'Retirement Budget Planner'}
        title={'About you'}
        tabName={PAGES_NAMES.ABOUTYOU}
      >
        Retirement budget planner tool
      </RetirementPlannerWrapper>,
    );

    const feedbackLink = container.querySelector(
      'a[href="https://moneyhelper.qualtrics.com/jfe/form/SV_bdQvos0HysGUUuy"]',
    );
    expect(feedbackLink).toBeInTheDocument();
  });

  it('should display the embed tool', () => {
    const { container } = render(
      <RetirementPlannerWrapper
        isEmbedded={true}
        pageTitle={'Retirement Budget Planner'}
        title={'About you'}
        tabName={PAGES_NAMES.ABOUTYOU}
      >
        Retirement budget planner tool
      </RetirementPlannerWrapper>,
    );
    expect(container).not.toBeEmptyDOMElement();
  });

  it('should display the beta feedback link for Welsh when not embedded', () => {
    mockUseTranslation.mockReturnValue(buildMockTranslation('cy'));

    const { container } = render(
      <RetirementPlannerWrapper
        isEmbedded={false}
        pageTitle={'Retirement Budget Planner'}
        title={'Amdanoch chi'}
        tabName={PAGES_NAMES.ABOUTYOU}
      >
        Retirement budget planner tool
      </RetirementPlannerWrapper>,
    );

    const feedbackLink = container.querySelector(
      'a[href="https://moneyhelper.qualtrics.com/jfe/form/SV_bdQvos0HysGUUuy?Q_Language=CY"]',
    );
    expect(feedbackLink).toBeInTheDocument();
  });
});
