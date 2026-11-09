import { COOKIE_PREFERENCE_HASH } from '../CookieBanner/cookieBannerConfig';

export const footerLinksMock = [
  {
    title: 'Legal',
    childLinks: [
      {
        text: 'Terms and conditions',
        linkTo: 'terms-and-conditions.com',
      },
      {
        text: 'Privacy notice',
        linkTo: 'privacy-notice.com',
      },
      {
        text: 'Cookie policy',
        linkTo: 'cookie-policy.com',
      },
      {
        text: 'Cookie preferences',
        linkTo: COOKIE_PREFERENCE_HASH,
      },
      {
        text: 'Money and Pensions Service standards',
        linkTo: 'standards.com',
      },
    ],
  },
  {
    title: 'Our Services',
    childLinks: [
      {
        text: 'MoneyHelper',
        linkTo: 'moneyHelper.com',
      },
      {
        text: 'Financial Capability Strategy for the UK',
        linkTo: 'financial-capability.com',
      },
    ],
  },
  {
    title: 'Stay In Touch',
    childLinks: [
      {
        text: 'Contact us',
        linkTo: 'contact-us.com',
      },
      {
        text: 'Sign up to newsletter',
        linkTo: 'newsletter.com',
      },
      {
        text: 'X',
        linkTo: 'twitter.com',
      },
      {
        text: 'LinkedIn',
        linkTo: 'linkedin',
      },
      {
        text: 'YouTube',
        linkTo: 'youTube.com',
      },
    ],
  },
];
