import { expect, test } from '@playwright/test';

import { selfServeCreds } from '../../data/selfServeCredentials.data';
import { ConfirmDetailsPage } from '../../pages/ConfirmDetailsPage';
import { RegionsCoveredPage } from '../../pages/RegionsCoveredPage';
import { SelfServePage } from '../../pages/SelfServePage';
import { ServiceDetailsPage } from '../../pages/ServiceDetailsPage';
import { SetAgePage } from '../../pages/SetAgePage';

let selfServePage: SelfServePage;
let regionsCoveredPage: RegionsCoveredPage;
let setAgePage: SetAgePage;
let serviceDetailsPage: ServiceDetailsPage;
let confirmDetailsPage: ConfirmDetailsPage;

const authFile =
  'apps/e2e/travel-insurance-directory-e2e/.auth/isolated-user.json';

const serviceDetailsFile =
  'apps/e2e/travel-insurance-directory-e2e/.auth/confirm-details.json';

//Save logged in session state
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new SelfServePage(page);
  await loginPage.goto();
  await loginPage.acceptCookiesIfVisible();

  await loginPage.fillEmailField(selfServeCreds.ACCOUNT_LOGIN_EMAIL);
  await loginPage.clickLoginButton();
  await loginPage.fillOtpField('123456');
  await loginPage.clickLoginButton();
  await expect(loginPage.headingLocator('Main authorised firm')).toBeVisible();

  await context.storageState({ path: authFile });
  await context.close();
});

test.describe('Cover and service', () => {
  test.beforeEach(async ({ browser }) => {
    // Create a browser context using the new storage state file
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    selfServePage = new SelfServePage(page);
    regionsCoveredPage = new RegionsCoveredPage(page);
    setAgePage = new SetAgePage(page);
    serviceDetailsPage = new ServiceDetailsPage(page);
    confirmDetailsPage = new ConfirmDetailsPage(page);
    await selfServePage.resetTestDataAndReturnToAccountPage();
    await selfServePage.clickCoverAndServiceLink();
  });

  test('Add cover and service details', async () => {
    /**
     * @tests 52407 - regions covered
     * @tests 52432 - multi selection
     */
    await test.step('Regions covered', async () => {
      await expect(
        regionsCoveredPage.headingLocator('Regions covered'),
      ).toBeVisible();
      await regionsCoveredPage.checkEuropeCheckbox();
      await regionsCoveredPage.checkWorldwideExUsaCheckbox();
      await regionsCoveredPage.checkWorldwideCheckbox();
      await regionsCoveredPage.clickContinue();
      await regionsCoveredPage.expectNavigationTo(
        /\/uk_and_europe\/single_trip/,
      );
    });

    const pageData = [
      {
        title: 'Europe - single trip',
        expectedNextUrl: /\/uk_and_europe\/annual_multi_trip/,
        expectedNextHeading: 'Set age for Europe annual multi-trip',
      },
      {
        title: 'Europe - multi trip',
        expectedNextUrl: /\/worldwide_excluding_us_canada\/single_trip/,
        expectedNextHeading: 'Set age for Worldwide excluding USA single trip',
      },
      {
        title: 'Worldwide Exc USA - single trip',
        expectedNextUrl: /\/worldwide_excluding_us_canada\/annual_multi_trip/,
        expectedNextHeading:
          'Set age for Worldwide excluding USA annual multi-trip',
      },
      {
        title: 'Worldwide Exc USA - multi trip',
        expectedNextUrl: /\/worldwide_including_us_canada\/single_trip/,
        expectedNextHeading: 'Set age for Worldwide single trip',
      },
      {
        title: 'Worldwide - single trip',
        expectedNextUrl: /\/worldwide_including_us_canada\/annual_multi_trip/,
        expectedNextHeading: 'Set age for Worldwide annual multi-trip',
      },
      {
        title: 'Worldwide - multi trip',
        expectedNextUrl: /\/service-details\//,
        expectedNextHeading: 'Service details',
      },
    ];

    /**
     * @tests 52431 - age limits single
     * @tests 52432 - age limit multi
     */
    for (const step of pageData) {
      await test.step(step.title, async () => {
        await expect(setAgePage.selectInput().first()).toBeVisible();
        await setAgePage.setAgeSelectAll('1000');
        await setAgePage.clickContinue();
        await expect(
          setAgePage.headingLocator(step.expectedNextHeading),
        ).toBeVisible();
      });
    }

    /**
     * @tests 52343 - service details
     */
    await test.step('Service details', async () => {
      await expect(
        serviceDetailsPage.headingLocator('Service details'),
      ).toBeVisible();
      await serviceDetailsPage.checkTelQuoteServiceYes();
      await serviceDetailsPage.checkSpecialistMedicalEquipmentYes();
      await serviceDetailsPage.medicalScreeningProvider('verisk');
      await serviceDetailsPage.howFarInAdvance('up-to-18-months');
      await serviceDetailsPage.clickContinue();
      await serviceDetailsPage.expectNavigationTo(/\/confirm/);
    });

    /**
     * @tests 53019 - confirm details
     */
    await test.step('Confirm details', async () => {
      await expect(
        confirmDetailsPage.headingLocator('Confirm details'),
      ).toBeVisible();

      const targetMethods = [
        'summarySectionAgeLimits',
        'summarySectionSetAgeEuropeSingle',
        'summarySectionSetAgeEuropeMulti',
        'summarySectionSetAgeWorldewideExUsaSingle',
        'summarySectionSetAgeWorldewideExUsaMulti',
        'summarySectionSetAgeWorldwideSingle',
        'summarySectionSetAgeWorldwideMulti',
        'summarySectionServiceDetails',
      ] as const;

      for (const methodName of targetMethods) {
        const locator = confirmDetailsPage[methodName]();
        await expect(locator).toBeVisible();
      }

      await expect(confirmDetailsPage.summaryRowRegion()).toHaveCount(3);
      await expect(confirmDetailsPage.summaryRowEurope()).toHaveCount(6);
      await expect(confirmDetailsPage.summaryRowWorldwideExcUsa()).toHaveCount(
        6,
      );
      await expect(confirmDetailsPage.summaryRowWorldwide()).toHaveCount(6);
      await expect(confirmDetailsPage.summaryRowServiceDetails()).toHaveCount(
        4,
      );
      await expect(confirmDetailsPage.summaryRowChangeButton()).toHaveCount(25);

      await confirmDetailsPage.clickConfirm();
    });
  });

  /**
   * @tests 52408 - Regions covered validation
   */
  test('Regions covered validation', async () => {
    await regionsCoveredPage.gotoRegionsCovered();
    await expect(
      regionsCoveredPage.headingLocator('Regions covered'),
    ).toBeVisible();

    await expect(regionsCoveredPage.errorSummary()).toBeHidden();
    await expect(regionsCoveredPage.errorInline()).toBeHidden();

    await regionsCoveredPage.clickContinue();

    await expect(regionsCoveredPage.errorSummary()).toBeVisible();
    await expect(regionsCoveredPage.errorInline()).toBeVisible();
  });

  /**
   * @tests 52409 - regions covered back nav
   */
  test('Regions covered back nav', async () => {
    await expect(
      regionsCoveredPage.headingLocator('Regions covered'),
    ).toBeVisible();
    await regionsCoveredPage.clickBackButton();
    await selfServePage.expectNavigationTo('/account');
  });
});

test.describe('Trip cover validation', () => {
  test.beforeEach(async ({ browser }) => {
    // Create a browser context using the new storage state file and answer the first question to allow nav to individual age limit pages
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    selfServePage = new SelfServePage(page);
    regionsCoveredPage = new RegionsCoveredPage(page);
    setAgePage = new SetAgePage(page);
    await selfServePage.goto();
    await selfServePage.resetTestDataAndReturnToAccountPage();
    await selfServePage.clickCoverAndServiceLink();

    await expect(
      regionsCoveredPage.headingLocator('Regions covered'),
    ).toBeVisible();
    await regionsCoveredPage.checkEuropeCheckbox();
    await regionsCoveredPage.checkWorldwideExUsaCheckbox();
    await regionsCoveredPage.checkWorldwideCheckbox();
    await regionsCoveredPage.clickContinue();
    await regionsCoveredPage.expectNavigationTo(/\/uk_and_europe\/single_trip/);
  });

  type ValidationTestCase = {
    region: 'Europe' | 'WorldwideExcUSA' | 'Worldwide';
    tripType: 'Single' | 'Multi';
    expectedUrl: RegExp;
    expectedPrevUrl: RegExp;
    /** Heading on the previous step after clicking Back */
    expectedPrevHeading: string;
  };

  const validationTests: ValidationTestCase[] = [
    {
      region: 'Europe',
      tripType: 'Single',
      expectedUrl: /\/uk_and_europe\/annual_multi_trip/,
      expectedPrevUrl: /\/trip-cover\/regions\//,
      expectedPrevHeading: 'Regions covered',
    },
    {
      region: 'Europe',
      tripType: 'Multi',
      expectedUrl: /\/worldwide_excluding_us_canada\/single_trip/,
      expectedPrevUrl: /\/uk_and_europe\/single_trip(?:\/|$|\?)/,
      expectedPrevHeading: 'Set age for Europe single trip',
    },
    {
      region: 'WorldwideExcUSA',
      tripType: 'Single',
      expectedUrl: /\/worldwide_excluding_us_canada\/annual_multi_trip/,
      expectedPrevUrl: /\/uk_and_europe\/annual_multi_trip(?:\/|$|\?)/,
      expectedPrevHeading: 'Set age for Europe annual multi-trip',
    },
    {
      region: 'WorldwideExcUSA',
      tripType: 'Multi',
      expectedUrl: /\/worldwide_including_us_canada\/single_trip/,
      expectedPrevUrl:
        /\/worldwide_excluding_us_canada\/single_trip(?:\/|$|\?)/,
      expectedPrevHeading: 'Set age for Worldwide excluding USA single trip',
    },
    {
      region: 'Worldwide',
      tripType: 'Single',
      expectedUrl: /\/worldwide_including_us_canada\/annual_multi_trip/,
      expectedPrevUrl:
        /\/worldwide_excluding_us_canada\/annual_multi_trip(?:\/|$|\?)/,
      expectedPrevHeading:
        'Set age for Worldwide excluding USA annual multi-trip',
    },
    {
      region: 'Worldwide',
      tripType: 'Multi',
      // Other regions are still incomplete in this describe, so after the last
      // age step the flow redirects to the first incomplete page (Europe single).
      expectedUrl: /\/uk_and_europe\/single_trip(?:\/|$|\?)/,
      expectedPrevUrl:
        /\/worldwide_including_us_canada\/single_trip(?:\/|$|\?)/,
      expectedPrevHeading: 'Set age for Worldwide single trip',
    },
  ];

  /**
   * @tests 52442 - validation single trip
   * @tests 52443 - validation mutli trip
   */

  //create a subset of cases just for europe
  const validationSubset = validationTests.filter(
    (testCase) => testCase.region === 'Europe',
  );

  // runs against the subset of validation tests for Europe single and multi trip
  // testing across all regions and trip types would be redundant as the validation is the same for all pages
  for (const { region, tripType, expectedUrl } of validationSubset) {
    test(`Trip Cover validation - ${region} ${tripType}`, async () => {
      await setAgePage.gotoTripCover(region, tripType);

      await setAgePage.selectInput().first().waitFor({ state: 'visible' });
      const numOfSelects = setAgePage.selectInput();
      await expect(numOfSelects).toHaveCount(6);

      await setAgePage.clickContinue();
      await expect(setAgePage.errorSummaryListElement()).toHaveCount(6);

      await setAgePage.setAgeSelectAll('1000');
      await setAgePage.clickContinue();
      await setAgePage.expectNavigationTo(expectedUrl);
    });
  }

  for (const {
    region,
    tripType,
    expectedPrevUrl,
    expectedPrevHeading,
  } of validationTests) {
    test(`Trip Cover back nav - ${region} ${tripType}`, async () => {
      await setAgePage.gotoTripCover(region, tripType);
      await setAgePage.clickBackButton();
      await setAgePage.expectNavigationTo(expectedPrevUrl);
      await expect(
        setAgePage.headingLocator(expectedPrevHeading),
      ).toBeVisible();
    });
  }
});

test.describe('Service & confirm details', () => {
  test.beforeAll(async ({ browser }) => {
    // Create a browser context using the new storage state file and answer the first question to allow nav to individual age limit pages
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    selfServePage = new SelfServePage(page);
    regionsCoveredPage = new RegionsCoveredPage(page);
    setAgePage = new SetAgePage(page);
    serviceDetailsPage = new ServiceDetailsPage(page);
    await selfServePage.resetTestDataAndReturnToAccountPage();
    await selfServePage.clickCoverAndServiceLink();

    await expect(
      regionsCoveredPage.headingLocator('Regions covered'),
    ).toBeVisible();
    await regionsCoveredPage.checkEuropeCheckbox();
    await regionsCoveredPage.clickContinue();
    await expect(
      setAgePage.headingLocator('Set age for Europe single trip'),
    ).toBeVisible();

    //single
    await expect(setAgePage.selectInput().first()).toBeVisible();
    await setAgePage.setAgeSelectAll('1000');
    await setAgePage.clickContinue();
    await expect(
      setAgePage.headingLocator('Set age for Europe annual multi-trip'),
    ).toBeVisible();

    //multi
    await expect(setAgePage.selectInput().first()).toBeVisible();
    await setAgePage.setAgeSelectAll('1000');
    await setAgePage.clickContinue();
    await expect(setAgePage.headingLocator('Service details')).toBeVisible();

    await context.storageState({ path: serviceDetailsFile });
  });

  test.describe('Service details', () => {
    test.beforeEach(async ({ browser }) => {
      const context = await browser.newContext({
        storageState: serviceDetailsFile,
      });
      const page = await context.newPage();
      selfServePage = new SelfServePage(page);
      serviceDetailsPage = new ServiceDetailsPage(page);
      setAgePage = new SetAgePage(page);
      serviceDetailsPage = new ServiceDetailsPage(page);
      await serviceDetailsPage.gotoServiceDetails();
      await expect(
        serviceDetailsPage.headingLocator('Service details'),
      ).toBeVisible();
    });

    test('Service details validation', async () => {
      serviceDetailsPage.clickContinue();
      await expect(serviceDetailsPage.errorSummaryListElement()).toHaveCount(4);

      await serviceDetailsPage.fillServiceDetails();
      await serviceDetailsPage.clickContinue();
      await serviceDetailsPage.expectNavigationTo(/\/confirm/);
    });

    /**
     * @tests 52355 - back nav
     */
    test('Back navigation', async () => {
      await serviceDetailsPage.clickBackButton();
      await serviceDetailsPage.expectNavigationTo(
        /\/uk_and_europe\/annual_multi_trip/,
      );
      await expect(
        setAgePage.headingLocator('Set age for Europe annual multi-trip'),
      ).toBeVisible();
    });
  });

  test.describe('Confirm details', () => {
    test.beforeEach(async ({ browser }) => {
      const context = await browser.newContext({
        storageState: serviceDetailsFile,
      });
      const page = await context.newPage();
      selfServePage = new SelfServePage(page);
      regionsCoveredPage = new RegionsCoveredPage(page);
      setAgePage = new SetAgePage(page);
      serviceDetailsPage = new ServiceDetailsPage(page);
      confirmDetailsPage = new ConfirmDetailsPage(page);

      await serviceDetailsPage.gotoServiceDetails();
      await serviceDetailsPage.fillServiceDetails();
      await serviceDetailsPage.clickContinue();
      await expect(
        serviceDetailsPage.headingLocator('Confirm details'),
      ).toBeVisible();
    });

    /**
     * @tests 53025 - change value
     * @tests 52431 - includes single selection
     */
    test('Change value', async () => {
      confirmDetailsPage.clickSummaryRowEu30ChangeButton();
      await expect(
        setAgePage.headingLocator('Set age for Europe single trip'),
      ).toBeVisible();
      await setAgePage.setAgeSelect(setAgePage.upto30DaysLandSelect(), '65');
      await setAgePage.setAgeSelect(setAgePage.upto30DaysCruiseSelect(), '65');
      await setAgePage.clickSaveChanges();
      await expect(
        confirmDetailsPage.headingLocator('Confirm details'),
      ).toBeVisible();
      await expect(confirmDetailsPage.summaryRowEu30ValueText()).toHaveText(
        '65',
      );
    });

    /**
     * @tests 53026 - conditional visibility
     */
    test('Conditional visibility', async () => {
      await confirmDetailsPage.clickSummaryRowEuRegionChangeButton();
      await expect(
        regionsCoveredPage.headingLocator('Regions covered'),
      ).toBeVisible();
      await regionsCoveredPage.uncheckEuropeCheckbox();
      await regionsCoveredPage.checkWorldwideExUsaCheckbox();
      await regionsCoveredPage.clickSaveChanges();

      //single
      await expect(setAgePage.selectInput().first()).toBeVisible();
      await setAgePage.setAgeSelectAll('1000');
      await setAgePage.clickContinue();

      //multi
      await expect(
        setAgePage.headingLocator(
          'Set age for Worldwide excluding USA annual multi-trip',
        ),
      ).toBeVisible();
      await expect(setAgePage.selectInput().first()).toBeVisible();
      await setAgePage.setAgeSelectAll('1000');
      await setAgePage.clickContinue();

      //service details
      await expect(
        serviceDetailsPage.headingLocator('Service details'),
      ).toBeVisible();
      await serviceDetailsPage.clickContinue();
      await expect(
        confirmDetailsPage.headingLocator('Confirm details'),
      ).toBeVisible();

      //confirm
      await expect(
        await confirmDetailsPage.summaryRowLocatorCS('Europe'),
      ).toHaveText('Not selected');

      await expect(confirmDetailsPage.summaryRowEurope()).toHaveCount(0);
      await expect(confirmDetailsPage.summaryRowWorldwideExcUsa()).toHaveCount(
        6,
      );
    });

    /**
     * @tests 53028 - back nav
     */
    test('Back navigation', async () => {
      await confirmDetailsPage.clickBackButton();
      await confirmDetailsPage.expectNavigationTo(/\/service-details\//);
      await expect(
        serviceDetailsPage.headingLocator('Service details'),
      ).toBeVisible();
    });
  });
});

test.describe('Edit completed journey', () => {
  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    selfServePage = new SelfServePage(page);
    serviceDetailsPage = new ServiceDetailsPage(page);
    confirmDetailsPage = new ConfirmDetailsPage(page);
    await selfServePage.resetTestDataAndReturnToAccountPage(
      'setCompletedActiveSelfServeState',
    );
  });

  test('Changed value is saved to profile', async () => {
    /**
     * @tests 55856 - Entry point for Cover & Service edit
     */
    await test.step('Entry point', async () => {
      await selfServePage.clickCoverAndServiceLink();
      await expect(
        confirmDetailsPage.headingLocator('Confirm details'),
      ).toBeVisible();
    });

    await test.step('Go to service details page', async () => {
      await expect(
        await confirmDetailsPage.summaryRowLocatorCS(
          'Do you offer a telephone quote service?',
        ),
      ).toHaveText('Yes');

      await confirmDetailsPage.clickChangeButtonCS(
        'Do you offer a telephone quote service?',
      );
      await expect(
        serviceDetailsPage.headingLocator('Service details'),
      ).toBeVisible();
    });

    /**
     * @tests 55858 - Editing a value
     */
    await test.step('Change value', async () => {
      await serviceDetailsPage.checkTelQuoteServiceNo();
      await serviceDetailsPage.clickSaveChanges();
      await expect(
        confirmDetailsPage.headingLocator('Confirm details'),
      ).toBeVisible();
    });

    /**
     * @tests 55863 - Edits are saved on completion
     */
    await test.step('Verify change', async () => {
      await expect(
        await confirmDetailsPage.summaryRowLocatorCS(
          'Do you offer a telephone quote service?',
        ),
      ).toHaveText('No');
      await confirmDetailsPage.clickConfirm();
      await selfServePage.headingLocator('Main authorised firm');
      await selfServePage.clickCoverAndServiceLink();
      await expect(
        confirmDetailsPage.headingLocator('Confirm details'),
      ).toBeVisible();
      await expect(
        await confirmDetailsPage.summaryRowLocatorCS(
          'Do you offer a telephone quote service?',
        ),
      ).toHaveText('No');
    });
  });
});
