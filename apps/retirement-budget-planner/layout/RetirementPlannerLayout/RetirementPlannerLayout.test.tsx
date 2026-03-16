import * as router from 'next/router';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { RetirementPlannerLayout } from './RetirementPlannerLayout';
import { PAGES_NAMES, getPageEnum } from 'lib/constants/pageConstants';

import { savePartnersInfo } from 'lib/util/about-you';
import { findNextStepName, findTabIndex } from 'lib/util/tabs';
import { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { saveIncomeExpensesApi } from 'lib/util/saveToRedisCalls';
import { mockTabTranslation } from 'lib/mocks/mockTabs';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mockUseTranslation = () => mockTabTranslation;
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

const mockValidateFormInputNames = jest.fn();
jest.mock('lib/util/contentFilter', () => ({
  validateFormInputNames: () => mockValidateFormInputNames(),
}));

jest.mock('lib/util/saveToRedisCalls', () => ({
  saveIncomeExpensesApi: jest.fn(),
}));

jest.mock('lib/util/about-you', () => ({
  savePartnersInfo: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('data/essentialOutgoingsData', () => ({
  costDefaultFrequencies: jest.fn(),
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

jest.mock('@maps-react/vendor/components/InformizelyScript', () => ({
  InformizelyGetToolName: () => <div data-testid="informizely-get-tool-name" />,
  InformizelyDevScript: ({ siteId }: { siteId: string }) => (
    <div data-testid="informizely-dev-script">{siteId}</div>
  ),
}));

const defaultNavTabs = [
  { step: 1, tabName: 'about-us' },
  { step: 2, tabName: 'income' },
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
    mockValidateFormInputNames.mockReturnValue(true);
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

  it('should have a description on the page', () => {
    const description = 'This is the description of income tab';
    renderLayout({
      title: 'Income page',
      description: description,
    });

    expect(screen.getByText(description)).toBeTruthy();
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
      <input name="partner" defaultValue="yes" aria-label="about you" />,
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
        { step: 1, tabName: 'other' },
        { step: 2, tabName: 'summary' },
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
      `/en/about-us?sessionId=${providedId}&stepsEnabled=2`,
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
      <input name="partner" defaultValue="yes" aria-label="about you" />,
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
      <input name="partner" defaultValue="yes" aria-label="About you" />,
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

  it('should set errors when clicking continue button when there is an error on the income page', async () => {
    const mockRouter = { query: { language: 'en' }, push: jest.fn() };
    (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mockApiError = new Error('API Error');
    (saveIncomeExpensesApi as jest.Mock).mockRejectedValue(mockApiError);
    (getPageEnum as jest.Mock).mockReturnValue('income');
    (findNextStepName as jest.Mock).mockReturnValue('essential-outgoings');

    renderLayout(
      {
        tabName: PAGES_NAMES.INCOME,
        title: 'Income',
        pageTitle: 'RBP - Income',
      },
      <>Income</>,
    );

    const continueButton = screen.getByRole('button', {
      name: /continue/i,
    });
    expect(continueButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(continueButton);

    await waitFor(() => {
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('should not navigate to next tab if form validation fails', async () => {
    const mockRouter = { query: { language: 'en' }, push: jest.fn() };
    (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

    mockValidateFormInputNames.mockReturnValue(false);
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

    const continueButton = screen.getByRole('button', {
      name: /continue/i,
    });
    expect(continueButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(continueButton);

    await waitFor(() => {
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(saveIncomeExpensesApi).not.toHaveBeenCalled();
    });
  });

  it('should set errors when clicking save button when there is an error on the income page', async () => {
    const mockRouter = { query: { language: 'en' }, push: jest.fn() };
    (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

    (saveIncomeExpensesApi as jest.Mock).mockRejectedValue(
      new Error('API Error'),
    );

    renderLayout(
      {
        tabName: PAGES_NAMES.INCOME,
        title: 'Income',
        pageTitle: 'RBP - Income',
      },
      <>Income</>,
    );

    const saveAndComeBackLaterButton = screen.getByRole('button', {
      name: /save and come back later/i,
    });
    expect(saveAndComeBackLaterButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(saveAndComeBackLaterButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/en/save',
        query: {
          isEmbedded: false,
          sessionId: 'test-session-id',
          tabName: 'income',
          stepsEnabled: undefined,
        },
      });
    });
  });

  it('should not render continue/save buttons on summary page', async () => {
    renderLayout(
      {
        tabName: PAGES_NAMES.SUMMARY,
        title: 'Summary',
        pageTitle: 'RBP - Summary',
        initialActiveTabId: PAGES_NAMES.SUMMARY,
      },
      <>Summary</>,
    );

    const continueButton = screen.queryByText(/continue/i);
    expect(continueButton).not.toBeInTheDocument();

    const saveAndComeBackLaterButton = screen.queryByText(
      /save and come back later/i,
    );
    expect(saveAndComeBackLaterButton).not.toBeInTheDocument();
  });

  it('should get correct tab/page name from string, with fallback to about you', () => {
    // Unmock getPageEnum to test actual implementation
    const { getPageEnum } = jest.requireActual<
      typeof import('lib/constants/pageConstants')
    >('lib/constants/pageConstants');

    // existing tab/page names
    expect(getPageEnum('about-you')).toBe(PAGES_NAMES.ABOUTYOU);
    expect(getPageEnum('income')).toBe(PAGES_NAMES.INCOME);
    expect(getPageEnum('essential-outgoings')).toBe(PAGES_NAMES.ESSENTIALS);
    expect(getPageEnum('summary')).toBe(PAGES_NAMES.SUMMARY);

    // non-existent tab/page
    expect(getPageEnum('non-existent-page')).toBe(PAGES_NAMES.ABOUTYOU);
  });
});

describe('Retirement Budget Planner Layout – Informizely scripts', () => {
  beforeEach(() => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID: 'mock-env-feedback-site-id',
    };
  });

  it('should add Informizely scripts when useInformizely is true', async () => {
    renderLayout({
      tabName: PAGES_NAMES.SUMMARY,
      title: 'Summary',
      pageTitle: 'RBP - Summary',
      initialActiveTabId: PAGES_NAMES.SUMMARY,
      useInformizely: true,
    });

    const informizelyGetToolNameScript = screen.getByTestId(
      'informizely-get-tool-name',
    );
    expect(informizelyGetToolNameScript).toBeInTheDocument();

    const informizelyDevScript = screen.getByTestId('informizely-dev-script');
    expect(informizelyDevScript).toBeInTheDocument();
  });

  it('should not add Informizely scripts when useInformizely is false', async () => {
    renderLayout({
      tabName: PAGES_NAMES.SUMMARY,
      title: 'Summary',
      pageTitle: 'RBP - Summary',
      initialActiveTabId: PAGES_NAMES.SUMMARY,
      useInformizely: false,
    });

    const informizelyGetToolNameScript = screen.queryByTestId(
      'informizely-get-tool-name',
    );
    expect(informizelyGetToolNameScript).not.toBeInTheDocument();

    const informizelyDevScript = screen.queryByTestId('informizely-dev-script');
    expect(informizelyDevScript).not.toBeInTheDocument();
  });

  it('should use correct feedback site ID environment variable', async () => {
    renderLayout({
      tabName: PAGES_NAMES.SUMMARY,
      title: 'Summary',
      pageTitle: 'RBP - Summary',
      initialActiveTabId: PAGES_NAMES.SUMMARY,
      useInformizely: true,
    });

    expect(screen.getByTestId('informizely-dev-script').textContent).toBe(
      'mock-env-feedback-site-id',
    );
  });

  it('should use correct feedback site ID fallback if environment variable is not set', async () => {
    process.env.NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID = undefined;

    renderLayout({
      tabName: PAGES_NAMES.SUMMARY,
      title: 'Summary',
      pageTitle: 'RBP - Summary',
      initialActiveTabId: PAGES_NAMES.SUMMARY,
      useInformizely: true,
    });

    expect(screen.getByTestId('informizely-dev-script').textContent).toBe('');
  });
});
