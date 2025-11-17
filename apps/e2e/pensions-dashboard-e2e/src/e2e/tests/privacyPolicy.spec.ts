/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import privacyPolicyPage from '../pages/PrivacyPolicyPage';
import commonHelpers from '../utils/commonHelpers';

/**
 * @tests User Story 37457 Privacy Policy
 * @tests Test Case 38247: 37457 AC1 Verify privacy policy page content
 * @tests Test Case 38248: 37457 AC2 Verify Privacy policy page name and URL
 * @tests Test Case 38249: 37457 AC3 Privacy policy page : Verify start the service page link
 * @tests Test Case 38250: 37457 AC4 Privacy policy : Verify footer link
 */

const privacyPolicyLink = 'a[href="/en/dashboard-privacy-notice"]';
const expectedSections = [
  {
    heading: '1. Who we are',
    text: '1. Who we are We are the Money and Pensions Service (MaPS) - an arm’s-length body sponsored by the Department for Work and Pensions (DWP). Our contact details are: email: contact@maps.org.uk post: Money and Pensions Service, Bedford Borough Hall, 138 Cauldwell Street, Bedford, MK42 9AP More information about MaPS can be found on the MaPS website (opens in a new window) . MaPS’ Data Protection Officer contact details are: email: dpo@maps.org.uk telephone: 020 7943 0500 It will take you about 10-15 minutes to read this notice. Back to top',
  },
  {
    heading: '2. Privacy notice',
    text: '2. Privacy notice This notice covers our processing of your personal information as a user of the Find your pensions service (Find Service) and the MoneyHelper Pensions Dashboard (MHPD). It explains why, and how, we collect and use your personal information as part of operating the Find Service and the MHPD. The Find Service is the central service provided by MaPS that enables you to search for pensions, manage registrations for pensions that are matched to you, and authorise access to information about them via the MHPD. The MHPD is a digital service that allows you to view the information about all of your pensions in one secure place online and on a device of your choosing (mobile, tablet, laptop, desktop). This includes information on your State Pension, occupational pensions and personal pensions, including accrued values and the estimated income they could provide in retirement. Where you use other services MaPS provides, you should ensure you review the privacy notices which relate to those services. This includes the privacy notice provided on the Money Helper website. Where you are a test user, you should ensure you read the test user privacy notice issued to you. Not covered GOV.UK One Login (the identity service for pensions dashboards) will process your personal information to verify your identity for us. They have their own privacy notice: https://www.sign-in.service.gov.uk/privacy-policy (opens in a new window) . Back to top',
  },
  {
    heading: '3. What personal information do we collect?',
    text: '3. What personal information do we collect? “Personal information” means information relating to an identified or identifiable living individual. To deliver the Find Service and the MHPD, we collect and use these items of personal information: Personal information we receive from GOV.UK One Login once you have verified your identity: first name last name date of birth email address mobile phone number (if you have used a mobile phone for two-factor authentication) address identity account identifier. Any additional personal information you provide to us to increase the likelihood of being matched to your pensions. This could include: your National Insurance number alternate names, addresses, emails and phone numbers. Several pseudonymised identifiers and tokens we create or which are issued by GOV.UK One Login – these are codes which cannot directly identify you, but represent you and your authorisations. These allow us to link you to your requests to find pensions, pensions registered in response, and your authorisations to view information about these pensions, to enable the service to operate. Pseudonymised identifiers and tokens we receive from pension providers, schemes and DWP if they match you to a pension: where they match you to a pension, they provide a unique identifier, which is used by MHPD to request your pensions information for you from the pension provider, scheme or DWP. Pensions information from pension providers, schemes and DWP, where you wish to view this information in MHPD. This may include policy reference numbers, pension types and latest value or projected retirement income (depending on the type of pension). The exact details which will be provided will vary slightly depending on the provider or scheme. No sensitive or special category information, such as information relating to gender, sexuality or religion for example, is processed by us. We do not knowingly collect personal information relating to children. Back to top',
  },
  {
    heading: '4. Why we need your personal information',
    text: '4. Why we need your personal information We need to process your personal information: So that we can provide the Find Service and the MHPD - without this processing, you would not be able to search for, or view, your pensions. The legal basis for this processing is ‘public task’ – that is, we are undertaking it in the exercise of official authority. On occasion, if there is a re-organisation of MaPS, a transfer of its functions to another body or MaPS delegates provision of the Find Service or the MHPD to another body, and we need to transfer your information as part of that. If we needed to do this, the legal basis for the processing would also be a public task. On occasion, to comply with legal obligations we are subject to. If we needed to do this, the legal basis for this processing would be ‘legal obligations’. Back to top',
  },
  {
    heading: '5. Who do we share your personal information with?',
    text: '5. Who do we share your personal information with? We may share your personal information where necessary with the parties set out below for the purposes set out in the section entitled Why we need your personal information. Our IT and digital service providers including Capgemini UK. They process your personal information on our behalf. The Department for Work and Pensions, to allow them to check your details against the state pension records. Pension providers and schemes connected to the dashboards ecosystem. This is expected to be around 100 providers and schemes at the start of testing, and around 3,000 by the time the public dashboards service starts. Our IT and digital service providers process your personal information on our behalf, and as such the details relating to the processing of your personal information by them is set out in this notice. We do not allow our third-party service providers to use your personal information for their own purposes and only permit them to process your personal information for specified purposes and in accordance with our instructions. The other organisations listed are controllers, which means they do not process personal information on our behalf and are responsible for the processing they undertake. They will be able to provide their own privacy information to you. Other than the above, we will never share your personal information. We will never share your personal information with anyone for marketing purposes. Back to top',
  },
  {
    heading: '6. How long do we keep your personal information?',
    text: '6. How long do we keep your personal information? We distribute your identity or biographical information (the categories of personal information under section 1 and 2 of What personal information do we collect) to pension providers, schemes and DWP for matching, but, having done that, we don’t store that information ourselves. We only store the pseudonymised identifiers and tokens used to deliver the Find Service and link you to your pensions and authorisations. We retain them for the periods set out in section 14 of our data protection impact assessment. (opens in a new window) We will keep your Find Service user account active, with found pensions remaining registered, and consents (allowing dashboards to access your Find Service user account) remaining valid until you revoke them, for as long as you wish to use the Find Service. This involves retaining the pseudonymised identifiers and tokens representing these found pensions, and your authorisations, for as long as you are active. If you do not access your Find Service user account for 5 years, we will delete your account, removing all your personal information. When we receive pensions information from pension providers, schemes or DWP your information will only be retained within the MHPD during your search session. All personal information is deleted within 60 minutes of your session (or less if you close the session). Sessions are active for 60 minutes and are closed at this point, meaning all data will expire and be deleted 60 minutes after initiating the session. Back to top',
  },
  {
    heading: '7. Where do we store your information?',
    text: '7. Where do we store your information? We store all information in the UK only. Back to top',
  },
  {
    heading: '8. How do we keep your personal information secure?',
    text: '8. How do we keep your personal information secure? We are committed to doing all we can to ensure your information is kept secure. We have set up systems and processes to protect it from loss, misuse and unauthorised access or disclosure – for example, we protect your personal information using encryption. Our systems have been designed and developed based on National Cyber Security Centre best practice guidance. We have data processing agreements with our suppliers to make sure your personal information is secure and protected. Our employees and suppliers are all subject to a duty of confidentiality. We also run regular IT testing and scanning activities to ensure the security of our systems and hold a valid CyberEssentials Plus certification. Back to top',
  },
  {
    heading: '9. Cookie policy',
    text: '9. Cookie policy Read our cookie policy. (opens in a new window) Back to top',
  },
  {
    heading: '10. Your rights',
    text: '10. Your rights We respect your right to privacy and the protection of your personal information. We have a responsibility to protect this information and ensure its confidentiality, integrity and availability. We also want you to be in control of your personal information and respect your data protection rights. You have the right to: Be informed – we will always explain to you why, and how, personal information about you is being processed. Access your personal information – you can request access to the personal information we process about you on the details below. You can also access your Find Service user account at any time, which allows you to review and revoke your consents. Rectify any errors with your personal information- though we may need to verify the accuracy of the new personal information you provide to us. For the purpose of personal information we display from pension schemes, providers or DWP, rectification of any errors will be the responsibility of the personal information provider as the MHPD only displays the personal information it is provided with. Request restriction of processing of your personal information in certain circumstances. Object to us processing your personal information in certain circumstances. You can exercise your rights by contacting using the contact details set out in this notice. We do not use automated decision-making and we do not profile people. You will not have to pay a fee to access your personal information (or to exercise any of your other UK GDPR rights). However, we may charge a reasonable fee if we think your request is unfounded, repetitive or excessive. Alternatively, we could refuse to comply with your request in these circumstances. Back to top',
  },
  {
    heading: '11. Complaints',
    text: '11. Complaints If you have any queries about how we use your personal information that are not answered here, or if you wish to complain to our Data Protection Officer, please contact us on the details set out at the beginning of this notice. We hope that we can address any concerns you may have, but you can always contact the Information Commissioner’s Office (opens in a new window) (ICO). Back to top',
  },
];

test.describe('Privacy Notice policy', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToStartPage(page);
  });

  test('Navigate to privacy notice page from Start page, assert page heading, url and content', async ({
    page,
  }) => {
    //navigate to from start page link
    await page.getByTestId('more-about-your-data-accordion').click();
    await expect(page.locator(privacyPolicyLink).first()).toHaveText(
      'our privacy notice',
    );
    await privacyPolicyPage.clickStartPageLink(page, privacyPolicyLink);

    //assert heading, title and url
    expect(page.url()).toContain('/dashboard-privacy-notice');
    await expect(page).toHaveTitle(
      'Dashboard privacy notice - MoneyHelper Pensions Dashboard',
    );
    await expect(page.getByTestId('page-title')).toHaveText('Privacy notice');

    //assert content
    //What's in this guide subheading
    await expect(
      page.getByRole('heading', { name: 'What’s in this guide' }),
    ).toBeVisible();

    for (let i = 0; i < expectedSections.length; i++) {
      const sectionNumber = i + 1;
      const sectionContent = expectedSections[i];
      const headingLocator = privacyPolicyPage.getSectionHeading(
        page,
        sectionNumber,
      );
      const rawText = await privacyPolicyPage
        .getSectionBody(page, sectionNumber)
        .innerText();
      const normalizedText = rawText.replace(/\s+/g, ' ').trim();

      // Assert heading text for each section
      await expect(headingLocator).toHaveText(sectionContent.heading);
      //Assert inner text for each section
      expect(normalizedText).toEqual(sectionContent.text);
    }
  });

  test('Navigate to privacy notice page from Footer', async ({ page }) => {
    //navigate to from footer link
    await expect(page.locator(privacyPolicyLink).nth(1)).toHaveText(
      'Privacy notice',
    );
    await privacyPolicyPage.clickPrivacyFooterlink(page, privacyPolicyLink);
    //assert title and url
    expect(page.url()).toContain('/dashboard-privacy-notice');
    await expect(page.getByTestId('page-title')).toHaveText('Privacy notice');
  });
});
