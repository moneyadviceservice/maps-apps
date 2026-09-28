/* eslint-disable no-restricted-imports */
// Rule is disabled, as this is the only case required.

/**
 *  imports BOTH the standard Playwright test and LambdaTest setup.
 * It uses an environment variable (E2E_TARGET) to decide which one to export.
 */
import { ENV } from '@env';
import { test as standardTest } from '@playwright/test';

import lambdaTest from '../../lambda-test/lambdatest.setup';

import BarChart from '../pages/components/BarChart';
import BasePage from '../pages/BasePage';
import BSL from '../pages/components/BSL';
import CommonHelpers from '../utils/commonHelpers';
import CommonSessions from '../utils/testSessionStorage';
import ContactProviderCard from '../pages/components/ContactProviderCard';
import ContactUsPage from '../pages/ContactUsPage';
import ContactUsWidget from '../pages/components/ContactUsWidget';
import CookieConsent from '../utils/cookieConsent';
import CookiesPreferencesSideBanner from '../pages/components/CookiesPreferencesSideBanner';
import DidYouUnderstand from '../pages/components/DidYouUnderstandThisPage';
import DonutChart from '../pages/components/DonutChart';
import Footer from '../pages/components/Footer';
import HomePage from '../pages/HomePage';
import Interpreter from '../pages/components/Interpreter';
import IncomeAndValuesAccordions from '../pages/components/IncomeAndValuesAccordions';
import LoadingPage from '../pages/LoadingPage';
import McCloudIncomeAndValuesTab from '../pages/components/MccloudIncomeAndValuesTab';
import NetlifyPasswordPage from '../pages/NetlifyPasswordPage';
import OnlineForm from '../pages/components/OnlineForm';
import PageNotFoundPage from '../pages/PageNotFoundPage';
import PendingPensionsPage from '../pages/PendingPensionsPage';
import PensionDetailsPage from '../pages/PensionDetailsPage';
import PensionBreakdownPage from '../pages/PensionsBreakdownPage';
import PensionsFoundPage from '../pages/PensionsFoundPage';
import PensionsNotShowingPage from '../pages/PensionsNotShowingPage';
import PensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import Phone from '../pages/components/Phone';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import RelayUK from '../pages/components/RelayUK';
import ScenarioSelectionPage from '../pages/ScenarioSelectionPage';
import Timeline from '../pages/components/Timeline';
import StatePensionsDetailsPage from '../pages/StatePensionsDetailsPage';
import SupportPages from '../pages/SupportPages';
import Webchat from '../pages/components/Webchat';
import WelcomePage from '../pages/WelcomePage';
import WhatsApp from '../pages/components/WhatsApp';
import YouHaveExitedTheDashboardPage from '../pages/YouHaveExitedTheDashboardPage';
import YourPensionsTimelinePage from '../pages/YourPensionsTimelinePage';

type PageObjectFixtures = {
  barChart: BarChart;
  basePage: BasePage;
  bsl: BSL;
  commonHelpers: CommonHelpers;
  commonSessions: CommonSessions;
  contactProviderCard: ContactProviderCard;
  contactUsPage: ContactUsPage;
  contactUsWidget: ContactUsWidget;
  cookieConsent: CookieConsent;
  cookiesPreferencesSideBanner: CookiesPreferencesSideBanner;
  didYouUnderstand: DidYouUnderstand;
  donutChart: DonutChart;
  footer: Footer;
  homePage: HomePage;
  incomeAndValuesAccordions: IncomeAndValuesAccordions;
  interpreter: Interpreter;
  loadingPage: LoadingPage;
  mcCloudIncomeAndValuesTab: McCloudIncomeAndValuesTab;
  netlifyPasswordPage: NetlifyPasswordPage;
  onlineForm: OnlineForm;
  pageNotFoundPage: PageNotFoundPage;
  pendingPensionsPage: PendingPensionsPage;
  pensionDetailsPage: PensionDetailsPage;
  pensionBreakdownPage: PensionBreakdownPage;
  pensionsFoundPage: PensionsFoundPage;
  pensionsNotShowingPage: PensionsNotShowingPage;
  pensionsThatNeedActionPage: PensionsThatNeedActionPage;
  phone: Phone;
  privacyPolicyPage: PrivacyPolicyPage;
  relayUK: RelayUK;
  scenarioSelectionPage: ScenarioSelectionPage;
  statePensionsDetailsPage: StatePensionsDetailsPage;
  supportPages: SupportPages;
  timeline: Timeline;
  webchat: Webchat;
  welcomePage: WelcomePage;
  whatsApp: WhatsApp;
  youHaveExitedTheDashboardPage: YouHaveExitedTheDashboardPage;
  yourPensionsTimelinePage: YourPensionsTimelinePage;
};

const test = (
  ENV.E2E_TARGET === 'lambdatest' ? lambdaTest : standardTest
).extend<PageObjectFixtures>({
  barChart: async ({ page }, use) => {
    await use(new BarChart(page));
  },

  basePage: async ({ page, cookieConsent }, use) => {
    await use(new BasePage(page, cookieConsent));
  },

  bsl: async ({ page }, use) => {
    await use(new BSL(page));
  },

  commonHelpers: async ({ page, cookieConsent }, use) => {
    await use(new CommonHelpers(page, cookieConsent));
  },

  commonSessions: async ({ page, cookieConsent }, use) => {
    await use(new CommonSessions(page, cookieConsent));
  },

  contactProviderCard: async ({ page }, use) => {
    await use(new ContactProviderCard(page));
  },

  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },

  contactUsWidget: async ({ page }, use) => {
    await use(new ContactUsWidget(page));
  },

  cookieConsent: async ({ page }, use) => {
    await use(new CookieConsent(page));
  },

  cookiesPreferencesSideBanner: async ({ page }, use) => {
    await use(new CookiesPreferencesSideBanner(page));
  },

  didYouUnderstand: async ({ page }, use) => {
    await use(new DidYouUnderstand(page));
  },

  donutChart: async ({ page }, use) => {
    await use(new DonutChart(page));
  },

  footer: async ({ page }, use) => {
    await use(new Footer(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  incomeAndValuesAccordions: async ({ page }, use) => {
    await use(new IncomeAndValuesAccordions(page));
  },

  interpreter: async ({ page }, use) => {
    await use(new Interpreter(page));
  },

  loadingPage: async ({ page, cookieConsent }, use) => {
    await use(new LoadingPage(page, cookieConsent));
  },

  mcCloudIncomeAndValuesTab: async ({ page }, use) => {
    await use(new McCloudIncomeAndValuesTab(page));
  },

  netlifyPasswordPage: async ({ page }, use) => {
    await use(new NetlifyPasswordPage(page));
  },

  onlineForm: async ({ page }, use) => {
    await use(new OnlineForm(page));
  },

  pageNotFoundPage: async ({ page }, use) => {
    await use(new PageNotFoundPage(page));
  },

  pendingPensionsPage: async ({ page }, use) => {
    await use(new PendingPensionsPage(page));
  },

  pensionBreakdownPage: async ({ page }, use) => {
    await use(new PensionBreakdownPage(page));
  },

  pensionDetailsPage: async ({ page }, use) => {
    await use(new PensionDetailsPage(page));
  },

  pensionsFoundPage: async ({ page }, use) => {
    await use(new PensionsFoundPage(page));
  },

  pensionsNotShowingPage: async ({ page }, use) => {
    await use(new PensionsNotShowingPage(page));
  },

  pensionsThatNeedActionPage: async ({ page }, use) => {
    await use(new PensionsThatNeedActionPage(page));
  },

  phone: async ({ page }, use) => {
    await use(new Phone(page));
  },

  privacyPolicyPage: async ({ page }, use) => {
    await use(new PrivacyPolicyPage(page));
  },

  scenarioSelectionPage: async ({ page }, use) => {
    await use(new ScenarioSelectionPage(page));
  },

  statePensionsDetailsPage: async ({ page }, use) => {
    await use(new StatePensionsDetailsPage(page));
  },

  relayUK: async ({ page }, use) => {
    await use(new RelayUK(page));
  },

  supportPages: async ({ page }, use) => {
    await use(new SupportPages(page));
  },

  timeline: async ({ page }, use) => {
    await use(new Timeline(page));
  },

  webchat: async ({ page }, use) => {
    await use(new Webchat(page));
  },

  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },

  whatsApp: async ({ page, cookieConsent }, use) => {
    await use(new WhatsApp(page, cookieConsent));
  },

  youHaveExitedTheDashboardPage: async ({ page, cookieConsent }, use) => {
    await use(new YouHaveExitedTheDashboardPage(page, cookieConsent));
  },

  yourPensionsTimelinePage: async ({ page }, use) => {
    await use(new YourPensionsTimelinePage(page));
  },
});

// Re-export everything so we dont have to mix imports.
export * from '@playwright/test';
export { test };
