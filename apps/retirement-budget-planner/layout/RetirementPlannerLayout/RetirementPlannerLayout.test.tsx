import * as router from 'next/router';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { RetirementPlannerLayout } from './RetirementPlannerLayout';
import {
  NAV_TYPES,
  PAGES_NAMES,
  getPageEnum,
} from 'lib/constants/pageConstants';

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

jest.mock('next/dist/client/resolve-href', () => ({
  resolveHref: () => [null, '/cy'],
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
  findPreviousStep: jest.fn().mockReturnValue('about-you'),
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
  isStringPageName: jest.fn().mockReturnValue(true),
  TAB_KEYS: {
    PREVIOUS_TAB_KEY: 'rbp-previous-tab',
    NAV_TYPE_KEY: 'rbp-nav-type',
  },
  NAV_TYPES: {
    TAB_CLICK: 'tab-click',
    CONTINUE: 'continue',
    BACK: 'back',
  },
  PAGES_NAMES: {
    ABOUTYOU: 'about-you',
    INCOME: 'income',
    ESSENTIALS: 'essential-outgoings',
    SUMMARY: 'summary',
  },
  PAGES_NAMES_EXTRA: {
    LANDING: 'landing',
    SAVE: 'save',
    SAVED: 'progress-saved',
    ERROR: 'error-page',
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
  { step: 1, tabName: 'about-you' },
  { step: 2, tabName: 'income' },
];

const testAboutYouPageSubmission = async (options?: {
  submitTrigger?: 'button' | 'form';
  onContinueClickMockResponse?: boolean;
}) => {
  const {
    submitTrigger: submitAction = 'button',
    onContinueClickMockResponse = false,
  } = {
    ...options,
  };

  const pushMock = jest.fn();
  (router.useRouter as jest.Mock).mockReturnValue({
    query: {},
    push: pushMock,
  });

  (getPageEnum as jest.Mock).mockReturnValue('about-you');
  (findNextStepName as jest.Mock).mockReturnValue('income');
  (findTabIndex as jest.Mock).mockReturnValue(2);
  (savePartnersInfo as jest.Mock).mockResolvedValue([{ name: 'Partner' }]);

  const onContinueClick = jest
    .fn()
    .mockResolvedValue(onContinueClickMockResponse);

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

  if (submitAction === 'form') {
    const form = screen.getByTestId('retirement-planner-form');
    fireEvent.submit(form);
  } else {
    const continueButton = screen.getByText('Continue');
    continueButton.click();
  }

  await waitFor(() => {
    expect(savePartnersInfo).toHaveBeenCalled();
    expect(onContinueClick).toHaveBeenCalledWith([{ name: 'Partner' }]);

    // Success response (continues to next step)
    if (onContinueClickMockResponse === false) {
      expect(pushMock).toHaveBeenCalledWith({
        pathname: '/en/income',
        query: {
          sessionId: 'test-session-id',
          stepsEnabled: 3,
        },
      });
    }
  });

  // Error response (does not continue to next step)
  if (onContinueClickMockResponse === true) {
    expect(pushMock).not.toHaveBeenCalled();
  }
};

const renderLayout = (
  props: Partial<React.ComponentProps<typeof RetirementPlannerLayout>> = {},
  children?: React.ReactNode,
) =>
  render(
    <RetirementPlannerLayout
      title={'About you'}
      pageTitle={'RBP - About you'}
      tabName={PAGES_NAMES.ABOUTYOU}
      navTabsData={defaultNavTabs}
      initialActiveTabId={'about-you'}
      initialEnabledTabCount={1}
      {...props}
    >
      {children}
    </RetirementPlannerLayout>,
  );

// Shared helper to reduce duplicated test setup for continue navigation checks
const runContinueNavigationTest = async ({
  pageEnum,
  nextStep,
  tabIndex,
  tabName,
  title,
  pageTitle,
  child,
}: {
  pageEnum: string;
  nextStep: string;
  tabIndex: number;
  tabName: string;
  title: string;
  pageTitle: string;
  child: React.ReactNode;
}) => {
  const mockRouter = { query: { language: 'en' }, push: jest.fn() };
  (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

  const mockApiCall = jest.fn();
  (saveIncomeExpensesApi as jest.Mock).mockImplementation(mockApiCall);
  (getPageEnum as jest.Mock).mockReturnValue(pageEnum);
  (findNextStepName as jest.Mock).mockReturnValue(nextStep);
  (findTabIndex as jest.Mock).mockReturnValue(tabIndex);

  renderLayout(
    {
      tabName: tabName as any,
      title,
      pageTitle,
    },
    child,
  );

  fireEvent.click(screen.getByText('Continue'));

  await waitFor(() => {
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockApiCall).toHaveBeenCalledTimes(1);
  });
};

const runNoNavigationWhenNoValuesTest = async ({
  pageEnum,
  nextStep,
  tabIndex,
  tabName,
  title,
  pageTitle,
  child,
}: {
  pageEnum: string;
  nextStep: string;
  tabIndex: number;
  tabName: string;
  title: string;
  pageTitle: string;
  child: React.ReactNode;
}) => {
  const mockRouter = { query: { language: 'en' }, push: jest.fn() };
  (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

  (getPageEnum as jest.Mock).mockReturnValue(pageEnum);
  (findNextStepName as jest.Mock).mockReturnValue(nextStep);
  (findTabIndex as jest.Mock).mockReturnValue(tabIndex);

  renderLayout(
    {
      tabName: tabName as any,
      title,
      pageTitle,
    },
    child,
  );

  fireEvent.click(screen.getByText('Continue'));

  await waitFor(() => {
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
};

const renderEssentialOutgoingsAndClickIncomeTab = () => {
  const mockRouter = { query: { language: 'en' }, push: jest.fn() };
  (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

  const mockApiCall = jest.fn();
  (saveIncomeExpensesApi as jest.Mock).mockImplementation(mockApiCall);
  (getPageEnum as jest.Mock).mockReturnValue('essential-outgoings');

  renderLayout(
    {
      initialEnabledTabCount: 3,
      tabName: PAGES_NAMES.ESSENTIALS,
      title: 'Essential outgoings',
      pageTitle: 'RBP - Essential outgoings',
    },
    <>Essential outgoings</>,
  );

  fireEvent.click(screen.getByTestId('income'));

  return { mockApiCall, mockRouter };
};

describe('Retirement Budget Planner Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateFormInputNames.mockReturnValue(true);
    (router.useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: jest.fn(),
    });
  });

  it('should display About you page (snapshot)', () => {
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

  it('renders back link to previous tab using locale', () => {
    renderLayout({
      tabName: PAGES_NAMES.INCOME,
      initialActiveTabId: 'income',
      initialEnabledTabCount: 2,
    });
    const backLink = screen.getByText('Back');
    const anchor = backLink.closest('a') as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
  });

  it('renders back link to AEM landing page on page About You when not embedded', () => {
    renderLayout({
      tabName: PAGES_NAMES.ABOUTYOU,
      initialActiveTabId: PAGES_NAMES.ABOUTYOU,
      isEmbedded: false,
    });

    const backLink = screen.getByRole('link', { name: 'Back' });

    expect(backLink.getAttribute('href')).toBe(
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/retirement-budget-planner',
    );
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
      expect(pushMock).toHaveBeenCalledWith({
        pathname: '/en/summary',
        query: {
          sessionId: 'test-session-id',
          stepsEnabled: 4,
        },
      });
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
      `/en/about-you?sessionId=${providedId}&stepsEnabled=2&navType=back`,
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

  it('Continue button has type attribute set to submit', () => {
    renderLayout();
    const continueButton = screen.getByText('Continue');
    expect(continueButton.getAttribute('type')).toBe('submit');
  });

  it('Save and come back later button has correct formaction and type attributes', () => {
    renderLayout({
      tabName: PAGES_NAMES.INCOME,
      title: 'Income',
      pageTitle: 'RBP - Income',
    });

    const saveAndComeBackLaterButton = screen.getByRole('button', {
      name: /save and come back later/i,
    });

    expect(saveAndComeBackLaterButton.getAttribute('formaction')).toBe(
      '/api/submit?save=true',
    );
  });

  it('calls savePartnersInfo, calls onContinueClick, navigates to next step, when current page is ABOUTYOU and onContinueClick returns no error (false)', async () => {
    await testAboutYouPageSubmission({
      submitTrigger: 'button',
      onContinueClickMockResponse: false,
    });
  });

  it('calls savePartnersInfo, calls onContinueClick, prevents navigation, when current page is ABOUTYOU and onContinueClick returns an error (true)', async () => {
    await testAboutYouPageSubmission({
      submitTrigger: 'button',
      onContinueClickMockResponse: true,
    });
  });

  it('verifies form submission with default action (e.g. via enter/return key)', async () => {
    await testAboutYouPageSubmission({
      submitTrigger: 'form',
      onContinueClickMockResponse: false,
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
    await runContinueNavigationTest({
      pageEnum: 'income',
      nextStep: 'essential-outgoings',
      tabIndex: 2,
      tabName: PAGES_NAMES.INCOME,
      title: 'Income',
      pageTitle: 'RBP - Income',
      child: <>Income</>,
    });
  });

  it('should call router.push when at least one field is entered in essential outgoings tab', async () => {
    await runContinueNavigationTest({
      pageEnum: 'essential-outgoings',
      nextStep: 'summary',
      tabIndex: 3,
      tabName: PAGES_NAMES.ESSENTIALS,
      title: 'Essential outgoings',
      pageTitle: 'RBP - Essential outgoings',
      child: <>Essential outgoings</>,
    });
  });

  it('should not navigate to next tab if income tab has no values entered', async () => {
    await runNoNavigationWhenNoValuesTest({
      pageEnum: 'income',
      nextStep: 'essential-outgoings',
      tabIndex: 2,
      tabName: PAGES_NAMES.INCOME,
      title: 'Income',
      pageTitle: 'RBP - Income',
      child: <>Income</>,
    });
  });

  it('should not navigate to summary tab if essential-outgoings tab has no values entered', async () => {
    await runNoNavigationWhenNoValuesTest({
      pageEnum: 'essential-outgoings',
      nextStep: 'summary',
      tabIndex: 3,
      tabName: PAGES_NAMES.ESSENTIALS,
      title: 'Essential outgloings',
      pageTitle: 'RBP - Essential outgoings',
      child: <>Essential outgoing content</>,
    });
  });

  it('should navigate to previous step via tabs and set sessionStorage', async () => {
    const { mockApiCall, mockRouter } =
      renderEssentialOutgoingsAndClickIncomeTab();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });

    // Verify sessionStorage was set for tab-click navigation
    expect(mockRouter.push).toHaveBeenCalled();
  });

  it('sets sessionStorage for continue navigation', async () => {
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

    // Verify router.push was called without focus query parameter
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.not.objectContaining({
          focus: expect.anything(),
        }),
      }),
    );
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

  it('should navigate to save page without showing validation summary when save is clicked with empty income fields', async () => {
    const mockRouter = { query: { language: 'en' }, push: jest.fn() };
    (router.useRouter as jest.Mock).mockReturnValue(mockRouter);

    mockValidateFormInputNames.mockReturnValue(false);

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
      expect(saveIncomeExpensesApi).not.toHaveBeenCalled();
      expect(
        screen.queryByText(
          /we need more information to calculate your retirement budget/i,
        ),
      ).not.toBeInTheDocument();
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

describe('Retirement Budget Planner Layout - Focus Management and sessionStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateFormInputNames.mockReturnValue(true);
    (router.useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: jest.fn(),
    });
  });

  it('should handle sessionStorage errors when reading navigation type on mount', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('SessionStorage not available');
      });

    renderLayout({
      tabName: PAGES_NAMES.INCOME,
      initialActiveTabId: 'income',
      initialEnabledTabCount: 2,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'SessionStorage not available:',
      expect.any(Error),
    );

    getItemSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should handle sessionStorage errors when setting navigation type during tab click', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const setItemSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('SessionStorage not available');
      });

    renderEssentialOutgoingsAndClickIncomeTab();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'SessionStorage not available:',
        expect.any(Error),
      );
    });

    setItemSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('focuses tab button and updates storage keys when nav type is tab-click', async () => {
    const requestAnimationFrameSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(NAV_TYPES.TAB_CLICK);

    renderLayout({
      tabName: PAGES_NAMES.INCOME,
      initialActiveTabId: 'income',
      initialEnabledTabCount: 2,
      title: 'Income',
      pageTitle: 'RBP - Income',
    });

    await waitFor(() => {
      expect(requestAnimationFrameSpy).toHaveBeenCalled();
      expect(screen.getByTestId('income')).toHaveFocus();
      expect(removeItemSpy).toHaveBeenCalledWith('rbp-nav-type');
      expect(setItemSpy).toHaveBeenCalledWith('rbp-previous-tab', 'income');
    });

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
    removeItemSpy.mockRestore();
    requestAnimationFrameSpy.mockRestore();
  });

  it('focuses content section when nav type is continue', async () => {
    const requestAnimationFrameSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(NAV_TYPES.CONTINUE);
    const getElementByIdSpy = jest.spyOn(document, 'getElementById');

    renderLayout({
      tabName: PAGES_NAMES.ABOUTYOU,
      initialActiveTabId: 'about-you',
      initialEnabledTabCount: 1,
      title: 'About you',
      pageTitle: 'RBP - About you',
    });

    await waitFor(() => {
      expect(requestAnimationFrameSpy).toHaveBeenCalled();
      expect(getElementByIdSpy).toHaveBeenCalledWith('tab-content');
    });

    getElementByIdSpy.mockRestore();
    getItemSpy.mockRestore();
    requestAnimationFrameSpy.mockRestore();
  });

  it('sets navigation type to back when back link is clicked', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(null);

    renderLayout({
      tabName: PAGES_NAMES.INCOME,
      initialActiveTabId: 'income',
      initialEnabledTabCount: 2,
      title: 'Income',
      pageTitle: 'RBP - Income',
    });

    fireEvent.click(screen.getByText('Back'));

    expect(setItemSpy).toHaveBeenCalledWith('rbp-nav-type', 'back');

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });
});
