import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { Cookie, Page } from '@maps/playwright';

import CommonHelpers from './commonHelpers';
import HomePage from '../pages/HomePage';
import LoadingPage from '../pages/LoadingPage';
import PensionsFoundPage from '../pages/PensionsFoundPage';
import ScenarioSelectionPage from '../pages/ScenarioSelectionPage';
import WelcomePage from '../pages/WelcomePage';
import NetlifyPasswordPage from '../pages/NetlifyPasswordPage';
import CookieConsent from './cookieConsent';

export interface ApplySessionParams {
  /**
   * To reduce flakyness, every session should be explicit in where it starts.
   */
  sessionStartUrl: string;
}

const sessionsDir = resolve(__dirname, '../sessions');
const getSessionPath = (fileName: string) =>
  join(sessionsDir, `${fileName}.session.json`);

class CommonSessions {
  private readonly commonHelpers: CommonHelpers;
  private readonly homePage: HomePage;
  private readonly loadingPage: LoadingPage;
  private readonly netlifyPasswordPage: NetlifyPasswordPage;
  private readonly pensionsFoundPage: PensionsFoundPage;
  private readonly scenarioSelectionPage: ScenarioSelectionPage;
  private readonly welcomePage: WelcomePage;

  constructor(private readonly page: Page, cookieConsent: CookieConsent) {
    this.commonHelpers = new CommonHelpers(page, cookieConsent);
    this.homePage = new HomePage(page);
    this.loadingPage = new LoadingPage(page);
    this.netlifyPasswordPage = new NetlifyPasswordPage(page);
    this.pensionsFoundPage = new PensionsFoundPage(page);
    this.scenarioSelectionPage = new ScenarioSelectionPage(page);
    this.welcomePage = new WelcomePage(page);
  }

  /**
   * Save's the current session (cookies) as a file.
   */
  async saveCurrentSession(sessionName: string) {
    const sessionPath = getSessionPath(sessionName);

    // Create sessions folder if it doesn't already exist.
    mkdirSync(sessionsDir, { recursive: true });

    // Delete an existing session if it exists.
    if (existsSync(sessionPath)) {
      rmSync(sessionPath);
    }

    // Store cookies in a file for later.
    const allCookies: Cookie[] = await this.page.context().cookies();

    console.log(`Creating session "${sessionName}"`);
    writeFileSync(sessionPath, JSON.stringify(allCookies, null, 2));
  }

  /**
   * Returns a session object, containing if there is a session and a function to re-apply them.
   */
  getSavedSession(sessionName: string) {
    const context = this.page.context();
    const sessionPath = getSessionPath(sessionName);
    const noSession = {
      sessionExists: false,
      applySession: async () => {
        throw new Error(
          `Session did not exist for "${sessionName}", check "sessionExists" property first.`,
        );
      },
    };

    if (existsSync(sessionPath)) {
      console.log(`Found session "${sessionName}"`);

      const sessionFileContents = readFileSync(sessionPath, 'utf-8');
      const sessionFileCookies: Cookie[] = JSON.parse(sessionFileContents);

      // Check if it's still valid.
      const mhpdSessionConfig: any = sessionFileCookies.find(
        (c) => c.name === 'mhpdSessionConfig',
      );
      const mhpdSessionJson = JSON.parse(mhpdSessionConfig.value);
      const sessionStart = mhpdSessionJson.sessionStart;
      const now = Date.now();
      const diffSec = (now - sessionStart) / 1000;
      const diffMin = diffSec / 60;

      // Delete the session if it's not valid anymore.
      if (diffMin > 30) {
        console.log(`Expired session was found for: "${sessionName}"`);
        rmSync(sessionPath);
        return noSession;
      }

      return {
        sessionExists: true,
        applySession: async (params: ApplySessionParams) => {
          await context.addCookies(sessionFileCookies);
          await this.page.goto(params.sessionStartUrl);
        },
      };
    }

    console.log(`Could not find session "${sessionName}"`);
    return noSession;
  }

  // Common steps

  private async goToPensionsFound(
    scenarioName: string,
    commonHelpers: CommonHelpers,
  ) {
    await this.commonHelpers.setCookieConsentAccepted();
    await this.commonHelpers.navigateToEmulator('en');
    await this.scenarioSelectionPage.selectScenarioComposerDev(scenarioName);
    await this.welcomePage.welcomePageLoads();
    await this.welcomePage.clickWelcomeButton();
    await this.loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await this.pensionsFoundPage.waitForPensionsFound();
  }

  /**
   * Generic navigation function that handles session reuse or fresh login flow.
   */
  private async navigateWithSession(
    scenarioName: string,
    expectedEndUrl: string,
    postFoundAction?: () => Promise<void>,
  ) {
    await this.page.goto('/');
    await this.commonHelpers.setCookieConsentAccepted();
    await this.page.reload(); // Reload to apply cookie

    const activeSession = this.getSavedSession(scenarioName);

    if (activeSession.sessionExists) {
      await activeSession.applySession({ sessionStartUrl: expectedEndUrl });
      return;
    }

    await this.goToPensionsFound(scenarioName, this.commonHelpers);

    if (postFoundAction) {
      await postFoundAction();
    }

    await this.page.waitForURL(expectedEndUrl);
    await this.saveCurrentSession(scenarioName);
  }

  /**
   * Navigates to the Pensions Found page.
   */
  async navigateToPensionsFoundPage(scenarioName: string) {
    await this.navigateWithSession(
      scenarioName,
      '/en/your-pension-search-results',
    );
  }

  /**
   * Navigates to the Pension Breakdown page.
   */
  async navigateToPensionBreakdown(scenarioName: string) {
    await this.navigateWithSession(
      scenarioName,
      '/en/your-pension-breakdown',
      () => this.pensionsFoundPage.clickSeeYourPensions(),
    );
  }

  /**
   * Navigates to the Pending Pensions page.
   */
  async navigateToPendingPensions(scenarioName: string) {
    await this.navigateWithSession(scenarioName, '/en/pending-pensions', () =>
      this.pensionsFoundPage.clickSeePendingPensions(),
    );
  }
}

export default CommonSessions;
