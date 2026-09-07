import { expect, test } from 'src/lib/test.lib';

import analytics from '../data/analytics.json';
import data from '../data/page-content.json';

type Country = 'England' | 'Scotland' | 'Wales' | 'Northern Ireland';
type ResultCountry = 'england' | 'scotland' | 'wales' | 'northernIreland';

const countries: Country[] = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
];

const resultCountries: Record<Country, ResultCountry> = {
  England: 'england',
  Scotland: 'scotland',
  Wales: 'wales',
  'Northern Ireland': 'northernIreland',
};

test.describe('Debt Advice Locator', () => {
  for (const country of countries) {
    test(`Debt advice - ${country}`, async ({
      debtAdviceLocatorPage,
      setCookieControl,
    }) => {
      await setCookieControl();
      await debtAdviceLocatorPage.goto();
      await expect(
        debtAdviceLocatorPage.browserPage,
      ).toHavePartialDataLayerEvent(analytics.pageLoads.livingCountry);
      await expect(
        debtAdviceLocatorPage.browserPage,
      ).toHavePartialDataLayerEvent(analytics.toolStarts.livingCountry);

      await expect(debtAdviceLocatorPage.title).toHaveText(
        data.livingCountry.title,
      );
      await expect(debtAdviceLocatorPage.heading).toHaveText(
        data.livingCountry.heading,
      );

      await debtAdviceLocatorPage.selectCountry(country);
      await debtAdviceLocatorPage.continue();
      await expect(
        debtAdviceLocatorPage.browserPage,
      ).toHavePartialDataLayerEvent(analytics.pageLoads.selfEmployed);
      await expect(debtAdviceLocatorPage.title).toHaveText(
        data.selfEmployedDetails.title,
      );
      await expect(debtAdviceLocatorPage.heading).toContainText(
        data.selfEmployedDetails.heading,
      );

      await debtAdviceLocatorPage.selectSelfEmployed(true);
      await debtAdviceLocatorPage.continue();
      const result = data.results[resultCountries[country]].selfEmployed;
      await expect(debtAdviceLocatorPage.heading).toHaveText(result.heading);
      await expect(debtAdviceLocatorPage.subHeading).toHaveText(
        result.subHeading,
      );
      await expect(debtAdviceLocatorPage.content).toContainText(result.content);
      await expect(
        debtAdviceLocatorPage.resultHeading(result.sections[0].heading),
      ).toBeVisible();
    });
  }

  test('England face-to-face search supports no results and changing location', async ({
    debtAdviceLocatorPage,
    setCookieControl,
  }) => {
    await setCookieControl();
    await debtAdviceLocatorPage.goto();
    await expect(debtAdviceLocatorPage.browserPage).toHavePartialDataLayerEvent(
      analytics.pageLoads.livingCountry,
    );
    await debtAdviceLocatorPage.selectCountry('England');
    await debtAdviceLocatorPage.continue();
    await debtAdviceLocatorPage.selectSelfEmployed(false);
    await debtAdviceLocatorPage.continue();
    await debtAdviceLocatorPage.selectAdvice('face-to-face');
    await debtAdviceLocatorPage.continue();

    await expect(debtAdviceLocatorPage.locationLabel).toHaveText(
      data.face2FaceLocation.fieldLabel,
    );
    await debtAdviceLocatorPage.continue();
    await expect(debtAdviceLocatorPage.errorSummary).toBeVisible();
    await expect(debtAdviceLocatorPage.browserPage).toHavePartialDataLayerEvent(
      analytics.errorMessages.location,
    );
    await expect(debtAdviceLocatorPage.errorRecords.first()).toHaveText(
      data.errorMessages.location,
    );

    await debtAdviceLocatorPage.location.fill('Vijgunt');
    await debtAdviceLocatorPage.continue();
    await expect(debtAdviceLocatorPage.heading).toHaveText(
      data.face2FaceNoResults.heading,
    );
    await expect(debtAdviceLocatorPage.subHeading).toHaveText(
      data.face2FaceNoResults.subHeading,
    );
    await debtAdviceLocatorPage.changeLocation();
    await expect(debtAdviceLocatorPage.location).toBeVisible();
  });
});
