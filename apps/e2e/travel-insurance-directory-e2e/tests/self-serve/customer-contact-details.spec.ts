import { expect, test } from '../../fixtures/selfServeTest';
import { resetSelfServe } from '../../helpers/loginAndResetSelfServe';
import { ConfirmDetailsPage } from '../../pages/ConfirmDetailsPage';
import { CustomerContactDetailsPage } from '../../pages/CustomerContactDetailsPage';
import { OpeningHoursPage } from '../../pages/OpeningHoursPage';
import { PrinciplePlaceOfBusinessPage } from '../../pages/PrinciplePlaceOfBusinessPage';
import { SelfServePage } from '../../pages/SelfServePage';

const contactDetails = {
  website: 'https://example.com',
  telephone: '+44 20 7946 0958',
  email: 'contact@example.com',
};

const address = {
  line1: '123 Test Street',
  line2: '',
  town: 'London',
  country: 'England',
  postcode: 'SW1A 1AA',
};

const openingHours = {
  openingTime: '09:00',
  closingTime: '17:30',
  saturdayOpening: 'no',
  sundayOpening: 'no',
};

const contactApiPath = '/api/account/firm-details/customer-contact-details';
const openingHoursApiPath = '/api/account/firm-details/opening-hours';
const ppbApiPath = '/api/account/firm-details/principle-place-of-business';

let confirmPage: ConfirmDetailsPage;
let ppbPage: PrinciplePlaceOfBusinessPage;
let contactPage: CustomerContactDetailsPage;
let openingPage: OpeningHoursPage;

async function navigateAndVerifyBedford(selfServePage: SelfServePage) {
  await selfServePage.clickCustomerContactDetailsLink();
  await expect(confirmPage.headingLocator('Confirm details')).toBeVisible();
  expect(await confirmPage.summaryRowValue('Town')).toEqual('Bedford');
}

async function changeTownToLondon() {
  await confirmPage.clickChangeButtonCCD('Town');
  await expect(
    ppbPage.headingLocator('Principle place of business'),
  ).toBeVisible();
  await ppbPage.town.clear();
  await ppbPage.fillTown('London');
  await ppbPage.fillCountry('United Kingdom');
  await ppbPage.fillPostcode('W1K 3JP');
  await ppbPage.clickContinue();
  await expect(confirmPage.headingLocator('Confirm details')).toBeVisible();
}

test.beforeEach(({ page }) => {
  confirmPage = new ConfirmDetailsPage(page);
  ppbPage = new PrinciplePlaceOfBusinessPage(page);
  contactPage = new CustomerContactDetailsPage(page);
  openingPage = new OpeningHoursPage(page);
});

test.describe('Firm details', () => {
  /**
   * @tests 50288 - Customer contact details
   * @tests 50289 - Principle place of business
   * @tests 50295 - Opening hours
   */
  test('firm details routes', async ({ page }) => {
    const selfServePage = await resetSelfServe(page);

    await test.step('Customer contact details', async () => {
      await contactPage.clickCustomerContactDetails();

      // AC1 — Default page load
      await contactPage.assertPageHeading();
      await contactPage.assertGuidanceText();

      // AC2 — Data input fields
      await contactPage.assertFieldsVisible();
      await contactPage.assertFieldsEmpty();

      // AC3 — Field validation rules
      await contactPage.fillWebsiteAddress('invalid-url');
      await contactPage.fillCustomerTelephone('abc123');
      await contactPage.fillCustomerEmail('not-an-email');
      await contactPage.clickContinue();
      await contactPage.assertWebsiteErrorVisible();
      await contactPage.assertTelephoneErrorVisible();
      await contactPage.assertEmailErrorVisible();

      // AC4 — Mandatory requirements
      await contactPage.fillWebsiteAddress('');
      await contactPage.fillCustomerTelephone('');
      await contactPage.fillCustomerEmail('');
      await contactPage.clickContinue();
      await contactPage.assertTelephoneErrorVisible();
      await contactPage.assertEmailErrorVisible();
      await contactPage.assertStillOnCustomerContactDetailsPage();

      // AC6 — Back navigation
      await contactPage.clickBack();
      await contactPage.theAccountHeading();

      // AC5 — Persistence and navigation
      await contactPage.clickCustomerContactDetails();
      await contactPage.fillWebsiteAddress(contactDetails.website);
      await contactPage.fillCustomerTelephone(contactDetails.telephone);
      await contactPage.fillCustomerEmail(contactDetails.email);
      await contactPage.clickContinueAndWaitForApi(
        contactApiPath,
        ppbPage.heading,
      );
    });

    await test.step('Principle place of business', async () => {
      // AC1 — Page layout and heading
      await ppbPage.assertPageHeading();
      await ppbPage.assertGuidanceText();

      // AC2 — Address input fields
      await ppbPage.assertFieldsVisible();
      await ppbPage.assertFieldsEmpty();

      // AC3 — Mandatory field validation
      await ppbPage.clickContinue();
      await ppbPage.assertAddressLineOneErrorVisible();
      await ppbPage.assertTownErrorVisible();
      await ppbPage.assertPostcodeErrorVisible();
      await ppbPage.assertCountryErrorVisible();
      await ppbPage.assertStillOnPrinciplePlaceOfBusinessPage();

      // AC4 — Postcode formatting
      await ppbPage.fillAddressLineOne('123 Test Street');
      await ppbPage.fillTown('London');
      await ppbPage.fillCountry('England');

      await ppbPage.assertPostcodeRejected('12345', ppbApiPath);
      await ppbPage.assertPostcodeRejected('ABCDE', ppbApiPath);
      await ppbPage.assertPostcodeAcceptedAndAdvances('SW1A1AA', ppbApiPath);
      await ppbPage.assertPostcodeAcceptedAndAdvances('SW1A 1AA', ppbApiPath);

      // AC5 — Navigation logic: save, continue, back with data preserved
      await ppbPage.fillAddressLineOne(address.line1);
      await ppbPage.fillAddressLineTwo(address.line2);
      await ppbPage.fillTown(address.town);
      await ppbPage.fillCountry(address.country);
      await ppbPage.fillPostcode(address.postcode);
      await ppbPage.clickContinueAndWaitForApi(
        ppbApiPath,
        ppbPage.openingHoursHeading,
      );

      await ppbPage.clickBackToPrinciplePlaceOfBusiness();
      await ppbPage.assertFieldValuesPersisted({
        line1: address.line1,
        line2: address.line2,
        town: address.town,
        country: address.country,
        postcode: address.postcode,
      });

      await ppbPage.clickBackToCustomerContactDetails();
      await ppbPage.assertCustomerContactDetailsPersisted();
      await contactPage.clickContinueAndWaitForApi(
        contactApiPath,
        ppbPage.heading,
      );
      await ppbPage.assertFieldValuesPersisted({
        line1: address.line1,
        line2: address.line2,
        town: address.town,
        country: address.country,
        postcode: address.postcode,
      });
      await ppbPage.clickContinueAndWaitForApi(ppbApiPath, openingPage.heading);
    });

    await test.step('Opening hours', async () => {
      // AC1 — Page layout and heading
      await openingPage.assertPageHeading();
      await openingPage.assertGuidanceText();

      // AC2 — Monday to Friday time entry (separate HH:MM inputs)
      await openingPage.assertWeekdayFieldsVisible();

      // AC4 — Validation and mandatory requirements (before weekend toggles)
      await openingPage.clickContinue();
      await openingPage.assertWeekdayOpeningErrorVisible();
      await openingPage.assertWeekdayClosingErrorVisible();

      // Set weekday opening to 10 PM
      await openingPage.selectWeekdayOpeningHour('10');
      await openingPage.selectWeekdayOpeningMinute('00');
      await openingPage.selectWeekdayOpeningPm();

      // Set weekday closing to 9 AM
      await openingPage.selectWeekdayClosingHour('9');
      await openingPage.selectWeekdayClosingMinute('00');
      await openingPage.selectWeekdayClosingAm();

      // Assert error dyu to opening time being after closing time
      await openingPage.clickContinue();
      await openingPage.assertWeekdayOpeningErrorVisible();

      // AC3 — Weekend availability selection
      await openingPage.assertWeekendRadioButtonsVisible();
      await openingPage.selectSaturdayYes();
      await openingPage.assertSaturdayFieldsVisible();

      await openingPage.selectSundayYes();
      await openingPage.assertSundayFieldsVisible();

      await openingPage.selectSaturdayNo();
      await openingPage.assertSaturdayFieldsHidden();

      await openingPage.selectSundayNo();
      await openingPage.assertSundayFieldsHidden();

      // AC5 — Persistence and final navigation (Continue saves and advances)
      await openingPage.selectValidWeekdayTimes();
      await openingPage.selectSaturdayNo();
      await openingPage.selectSundayNo();
      await openingPage.clickContinueAndWaitForApi(
        openingHoursApiPath,
        confirmPage.headingLocator('Confirm details'),
      );

      await openingPage.clickBack();
      await openingPage.assertPageHeading();
      await openingPage.assertWeekdayTimesPersisted(
        '9',
        '00',
        'am',
        '5',
        '30',
        'pm',
      );
      await openingPage.assertWeekendSelectionsPersisted('No', 'No');

      // AC6 — Back navigation to PPB with hours preserved when returning
      await openingPage.clickBackToPrinciplePlaceOfBusiness();
      await ppbPage.assertPageHeading();
      await ppbPage.clickContinueAndWaitForApi(ppbApiPath, openingPage.heading);
      await openingPage.assertWeekdayTimesPersisted(
        '9',
        '00',
        'am',
        '5',
        '30',
        'pm',
      );
      await openingPage.assertWeekendSelectionsPersisted('No', 'No');
    });

    await test.step('Confirm details and reset', async () => {
      await openingPage.clickContinueAndWaitForApi(
        openingHoursApiPath,
        confirmPage.headingLocator('Confirm details'),
      );

      await page.reload();
      await confirmPage.assertPageHeading();
      await confirmPage.assertContactDetailsSummary(contactDetails);
      await confirmPage.assertAddressSummary(address);
      await confirmPage.assertOpeningHoursSummary(openingHours);

      await confirmPage.clickBackToOpeningHours();
      await openingPage.assertWeekdayTimesPersisted(
        '9',
        '00',
        'am',
        '5',
        '30',
        'pm',
      );
      await openingPage.assertWeekendSelectionsPersisted('No', 'No');

      await openingPage.clickContinueAndWaitForApi(
        openingHoursApiPath,
        confirmPage.headingLocator('Opening hours'),
      );
      await confirmPage.clickConfirm();

      await selfServePage.assertCustomerContactDetailsCompleted();

      await selfServePage.resetTestDataAndReturnToAccountPage();
      await selfServePage.assertHeading('Register your firm');
      await contactPage.clickCustomerContactDetails();
      await contactPage.assertFieldsEmpty();
    });
  });

  test('Edit completed journey', async ({ page }) => {
    const selfServePage = await resetSelfServe(
      page,
      'setCompletedActiveSelfServeState',
    );

    await test.step('Verify existing value', async () => {
      await navigateAndVerifyBedford(selfServePage);
    });

    await test.step('Change value', async () => {
      await changeTownToLondon();
    });

    await test.step('Verify new value', async () => {
      expect(await confirmPage.summaryRowValue('Town')).toEqual('London');
      await confirmPage.clickConfirm();
      await expect(
        selfServePage.headingLocator('Main authorised firm'),
      ).toBeVisible();
      await selfServePage.clickCustomerContactDetails();
      await expect(confirmPage.headingLocator('Confirm details')).toBeVisible();
      expect(await confirmPage.summaryRowValue('Town')).toEqual('London');
    });
  });

  test('Abort edited completed journey', async ({ page }) => {
    const selfServePage = await resetSelfServe(
      page,
      'setCompletedActiveSelfServeState',
    );

    await test.step('Verify existing value', async () => {
      await navigateAndVerifyBedford(selfServePage);
    });

    await test.step('Change value', async () => {
      await changeTownToLondon();
    });

    await test.step('Verify value has not updated', async () => {
      expect(await confirmPage.summaryRowValue('Town')).toEqual('London');

      await selfServePage.goto();
      await expect(
        selfServePage.headingLocator('Main authorised firm'),
      ).toBeVisible();
      await selfServePage.clickCustomerContactDetails();
      await expect(confirmPage.headingLocator('Confirm details')).toBeVisible();
      expect(await confirmPage.summaryRowValue('Town')).toEqual('Bedford');
    });
  });
});
