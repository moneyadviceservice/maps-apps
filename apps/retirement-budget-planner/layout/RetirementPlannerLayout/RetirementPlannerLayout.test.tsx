import * as router from 'next/router';
import '@testing-library/jest-dom';

import { RetirementPlannerLayout } from './RetirementPlannerLayout';
import { PAGES_NAMES, getPageEnum } from 'lib/constants/pageConstants';

import { savePartnersInfo } from 'lib/util/about-you';
import { findNextStepName, findTabIndex } from 'lib/util/tabs';
import { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { saveIncomeExpensesApi } from 'lib/util/saveToRedisCalls';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mockUseTranslation = () => ({
    z: (obj: { en: string; cy: string }, _vars?: Record<string, unknown>) =>
      obj.en,
    t: () => '',
    tList: () => [],
    locale: 'en',
  });
  return {
    __esModule: true,
    default: mockUseTranslation,
    useTranslation: mockUseTranslation,
  };
});

jest.mock('lib/util/tabs', () => ({
  findNextStepName: jest.fn().mockReturnValue('income'),
  findPreviousStep: jest.fn().mockReturnValue('about-us'),
  findTabIndex: jest.fn().mockReturnValue(2),
}));

jest.mock('lib/util/contentFilter', () => ({
  validateFormInputNames: jest.fn().mockReturnValue(true),
}));

jest.mock('lib/util/saveToRedisCalls', () => ({
  saveIncomeExpensesApi: jest.fn(),
}));

jest.mock('lib/util/about-you', () => ({
  savePartnersInfo: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('lib/constants/pageConstants', () => ({
  __esModule: true,
  getPageEnum: jest.fn().mockReturnValue('about-you'),
  PAGES_NAMES: {
    ABOUTYOU: 'about-you',
    INCOME: 'income',
    ESSENTIALS: 'essential-outgoings',
    SUMMARY: 'summary',
  },
}));

jest.mock('context/SessionContextProvider', () => ({
  useSessionId: jest.fn(() => 'test-session-id'),
  SessionContextProvider: ({ children }: { children: ReactNode }) => children,
}));

const defaultNavTabs = [
  { step: 1, tabName: 'about-us', title: 'About us' },
  { step: 2, tabName: 'income', title: 'Income' },
];

const renderLayout = (
  props: Partial<React.ComponentProps<typeof RetirementPlannerLayout>> = {},
  children?: React.ReactNode,
) =>
  render(
    <RetirementPlannerLayout
      title={'About us'}
      pageTitle={'RBP - About us'}
      tabName={PAGES_NAMES.ABOUTYOU}
      navTabsData={defaultNavTabs}
      initialActiveTabId={'about-you'}
      initialEnabledTabCount={1}
      {...props}
    >
      {children}
    </RetirementPlannerLayout>,
  );

describe('Retirement Budget Planner Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (router.useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: jest.fn(),
    });
  });

  it('should display About us page (snapshot)', () => {
    const { container } = renderLayout();
    expect(container).toMatchSnapshot();
  });

  it('should render embed version (snapshot)', () => {
    const { container } = renderLayout({ isEmbedded: true });
    expect(container).toMatchSnapshot();
  });

  it('should not have a title on the page', () => {
    renderLayout({ title: '' });
    expect(screen.getByTestId('title').textContent).toBe('');
  });

  it('renders hidden language and tabName inputs and children content', () => {
    const { container } = renderLayout(
      {},
      <div data-testid="child">Child Content</div>,
    );

    const langInput = container.querySelector(
      'input[name="language"]',
    ) as HTMLInputElement;
    const tabInput = container.querySelector(
      'input[name="tabName"]',
    ) as HTMLInputElement;

    expect(screen.getByTestId('child').textContent).toBe('Child Content');
    expect(langInput).toBeTruthy();
    expect(tabInput).toBeTruthy();
    expect(langInput.value).toBe('en');
    expect(tabInput.value).toBe('about-you');
  });

  it('Back link points to previous tab using locale', () => {
    renderLayout({
      tabName: PAGES_NAMES.INCOME,
      initialActiveTabId: 'income',
      initialEnabledTabCount: 2,
    });
    const backLink = screen.getByText('Back');
    const anchor = backLink.closest('a') as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
  });

  it('calls savePartnersInfo when current page is ABOUTYOU and navigates to next step', async () => {
    const pushMock = jest.fn();
    (router.useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: pushMock,
    });

    (getPageEnum as jest.Mock).mockReturnValue('about-you');
    (findNextStepName as jest.Mock).mockReturnValue('income');

    renderLayout(
      {
        title: 'About you',
        pageTitle: 'PWD - About you',
        tabName: PAGES_NAMES.ABOUTYOU,
        initialActiveTabId: 'about-you',
      },
      <input name="partner" defaultValue="yes" />,
    );

    const continueButton = screen.getByText('Continue');
    continueButton.click();

    await waitFor(() => {
      expect(savePartnersInfo).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith(
        '/en/income?sessionId=test-session-id&stepsEnabled=3',
      );
    });
  });

  it('does not call savePartnersInfo when page is not ABOUTYOU but still navigates', async () => {
    const pushMock = jest.fn();
    (router.useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: pushMock,
    });

    (getPageEnum as jest.Mock).mockReturnValue('OTHERPAGE');
    (findNextStepName as jest.Mock).mockReturnValue('summary');
    (findTabIndex as jest.Mock).mockReturnValue(3);

    renderLayout({
      title: 'Other',
      pageTitle: 'RBP - Other',
      tabName: PAGES_NAMES.ESSENTIALS,
      navTabsData: [
        { step: 1, tabName: 'other', title: 'Other' },
        { step: 2, tabName: 'summary', title: 'Summary' },
      ],
      initialActiveTabId: 'other',
    });

    const continueButton = screen.getByText('Continue');
    continueButton.click();

    await waitFor(() => {
      expect(savePartnersInfo).not.toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith(
        '/en/summary?sessionId=test-session-id&stepsEnabled=4',
      );
    });
  });
  it('BackLink includes provided sessionId in href when sessionId prop is provided', () => {
    const providedId = 'provided-session-id';
    renderLayout({
      sessionId: providedId,
      tabName: PAGES_NAMES.INCOME,
      initialActiveTabId: 'income',
      initialEnabledTabCount: 2,
    });

    const backLink = screen.getByText('Back');
    const anchor = backLink.closest('a') as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe(
      `/en/about-us?sessionId=${providedId}`,
    );
  });

  it('uses provided sessionId for the hidden sessionId input', () => {
    const providedId = 'provided-session-id';
    const { container } = renderLayout({ sessionId: providedId });

    const sessionInput = container.querySelector(
      'input[name="sessionId"]',
    ) as HTMLInputElement;
    expect(sessionInput).toBeTruthy();
    expect(sessionInput.value).toBe(providedId);
  });

  it('Continue button has formAction attribute set to /api/submit', () => {
    renderLayout();
    const continueButton = screen.getByText('Continue');
    expect(continueButton.getAttribute('formAction')).toBe('/api/submit');
  });
  it('calls onContinueClick and prevents navigation when onContinueClick returns an error (true)', async () => {
    const pushMock = jest.fn();
    (router.useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: pushMock,
    });

    (getPageEnum as jest.Mock).mockReturnValue('about-you');
    (findNextStepName as jest.Mock).mockReturnValue('income');

    (savePartnersInfo as jest.Mock).mockResolvedValue([{ name: 'Partner' }]);

    const onContinueClick = jest.fn().mockResolvedValue(true);

    renderLayout(
      {
        title: 'About you',
        pageTitle: 'PWD - About you',
        tabName: PAGES_NAMES.ABOUTYOU,
        initialActiveTabId: 'about-you',
        onContinueClick,
      },
      <input name="partner" defaultValue="yes" />,
    );

    const continueButton = screen.getByText('Continue');
    continueButton.click();

    await waitFor(() => {
      expect(savePartnersInfo).toHaveBeenCalled();
      expect(onContinueClick).toHaveBeenCalledWith([{ name: 'Partner' }]);
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it('calls onContinueClick and navigates when onContinueClick returns no error (false)', async () => {
    const pushMock = jest.fn();
    (router.useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: pushMock,
    });

    (getPageEnum as jest.Mock).mockReturnValue('about-you');
    (findNextStepName as jest.Mock).mockReturnValue('income');
    (findTabIndex as jest.Mock).mockReturnValue(2);
    (savePartnersInfo as jest.Mock).mockResolvedValue([{ name: 'Partner' }]);

    const onContinueClick = jest.fn().mockResolvedValue(false);

    renderLayout(
      {
        title: 'About you',
        pageTitle: 'PWD - About you',
        tabName: PAGES_NAMES.ABOUTYOU,
        initialActiveTabId: 'about-you',
        onContinueClick,
      },
      <input name="partner" defaultValue="yes" />,
    );

    const continueButton = screen.getByText('Continue');
    continueButton.click();

    await waitFor(() => {
      expect(savePartnersInfo).toHaveBeenCalled();
      expect(onContinueClick).toHaveBeenCalledWith([{ name: 'Partner' }]);
      expect(pushMock).toHaveBeenCalledWith(
        '/en/income?sessionId=test-session-id&stepsEnabled=3',
      );
    });
  });
  it('calls savePartnersInfo and navigates to the save page including isEmbedded, sessionId and tabName in query', async () => {
    const pushMock = jest.fn();
    (router.useRouter as jest.Mock).mockReturnValue({
      query: { isEmbedded: true },
      push: pushMock,
    });

    (getPageEnum as jest.Mock).mockReturnValue('about-you');
    (savePartnersInfo as jest.Mock).mockResolvedValue([{ name: 'Partner' }]);

    renderLayout(
      {
        title: 'About you',
        pageTitle: 'PWD - About you',
        tabName: PAGES_NAMES.ABOUTYOU,
        initialActiveTabId: 'about-you',
      },
      <input name="partner" defaultValue="yes" />,
    );

    const saveButton = screen.getByText(/Save and come back later/i);
    saveButton.click();

    await waitFor(() => {
      expect(savePartnersInfo).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith({
        pathname: '/en/save',
        query: {
          isEmbedded: true,
          sessionId: 'test-session-id',
          tabName: 'about-you',
        },
      });
    });
  });

  it('uses false for isEmbedded in query when router.query.isEmbedded is not present', async () => {
    const pushMock = jest.fn();
    (router.useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: pushMock,
    });

    (getPageEnum as jest.Mock).mockReturnValue('about-you');
    (savePartnersInfo as jest.Mock).mockResolvedValue(undefined);

    renderLayout(
      {
        title: 'About you',
        pageTitle: 'PWD - About you',
        tabName: PAGES_NAMES.ABOUTYOU,
        initialActiveTabId: 'about-you',
      },
      <input name="partner" defaultValue="yes" />,
    );

    const saveButton = screen.getByText(/Save and come back later/i);
    saveButton.click();

    await waitFor(() => {
      expect(savePartnersInfo).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith({
        pathname: '/en/save',
        query: {
          isEmbedded: false,
          sessionId: 'test-session-id',
          tabName: 'about-you',
        },
      });
    });
  });

  it('should display income page ', () => {
    const container = renderLayout(
      { tabName: PAGES_NAMES.INCOME },
      <>Income tab details</>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should display essential-outgoings page', () => {
    const container = renderLayout(
      { tabName: PAGES_NAMES.ESSENTIALS },
      <>Essential outgoings tab details</>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should call router.push when at least one field is entered in income tab', async () => {
    const mockRouter = { query: { language: 'en' }, push: jest.fn() };
    (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mockApiCall = jest.fn();
    (saveIncomeExpensesApi as jest.Mock).mockImplementation(mockApiCall);
    (getPageEnum as jest.Mock).mockReturnValue('income');
    (findNextStepName as jest.Mock).mockReturnValue('essential-outgoings');
    (findTabIndex as jest.Mock).mockReturnValue(2);

    renderLayout(
      {
        tabName: PAGES_NAMES.INCOME,
        title: 'Income',
        pageTitle: 'RBP - Income',
      },
      <>Income</>,
    );

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });
  });

  it('should call router.push when at least one field is entered in essential outgoings tab', async () => {
    const mockRouter = { query: { language: 'en' }, push: jest.fn() };
    (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mockApiCall = jest.fn();
    (saveIncomeExpensesApi as jest.Mock).mockImplementation(mockApiCall);
    (getPageEnum as jest.Mock).mockReturnValue('essential-outgoings');
    (findNextStepName as jest.Mock).mockReturnValue('summary');
    (findTabIndex as jest.Mock).mockReturnValue(3);

    renderLayout(
      {
        tabName: PAGES_NAMES.ESSENTIALS,
        title: 'Essential outgoings',
        pageTitle: 'RBP - Essential outgoings',
      },
      <>Essential outgoings</>,
    );

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });
  });

  it('should not navigate to next tab if income tab has no values entered', async () => {
    const mockRouter = { query: { language: 'en' }, push: jest.fn() };
    (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

    jest.mock('lib/util/saveToRedisCalls', () => ({
      saveDataToRedis: jest.fn().mockReturnValue(true),
    }));

    (getPageEnum as jest.Mock).mockReturnValue('income');
    (findNextStepName as jest.Mock).mockReturnValue('essential-outgoings');
    (findTabIndex as jest.Mock).mockReturnValue(2);

    renderLayout(
      {
        tabName: PAGES_NAMES.INCOME,
        title: 'Income',
        pageTitle: 'RBP - Income',
      },
      <>Income</>,
    );

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('should not navigate to summary tab if essential-outgoings tab has no values entered', async () => {
    const mockRouter = { query: { language: 'en' }, push: jest.fn() };
    (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

    jest.mock('lib/util/saveToRedisCalls', () => ({
      saveDataToRedis: jest.fn().mockReturnValue(true),
    }));

    (getPageEnum as jest.Mock).mockReturnValue('essential-outgoings');
    (findNextStepName as jest.Mock).mockReturnValue('summary');
    (findTabIndex as jest.Mock).mockReturnValue(3);

    renderLayout(
      {
        tabName: PAGES_NAMES.ESSENTIALS,
        title: 'Essential outgloings',
        pageTitle: 'RBP - Essential outgoings',
      },
      <>Essential outgoing content</>,
    );

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('should navigate to previous step via tabs', async () => {
    const mockRouter = { query: { language: 'en' }, push: jest.fn() };
    (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mockApiCall = jest.fn();
    (saveIncomeExpensesApi as jest.Mock).mockImplementation(mockApiCall);
    (getPageEnum as jest.Mock).mockReturnValue('essential-outgoings');
    renderLayout(
      {
        initialEnabledTabCount: 3,
        tabName: PAGES_NAMES.ESSENTIALS,
        title: 'Essential outgloings',
        pageTitle: 'RBP - Essential outgoings',
      },
      <>Essential outgoings</>,
    );

    fireEvent.click(screen.getByTestId('income'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });
  });
});
