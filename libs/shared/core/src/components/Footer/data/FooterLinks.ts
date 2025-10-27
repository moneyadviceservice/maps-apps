import { useTranslation } from '@maps-react/hooks/useTranslation';

export const FooterLinks = (
  altPrivacyLink?: string,
  altCookieLink?: string,
) => {
  const { z } = useTranslation();

  const primaryLinkData = [
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/about-us',
        cy: 'https://www.moneyhelper.org.uk/cy/about-us',
      }),
      label: z({ en: 'About us', cy: 'Amdanom ni' }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/getting-help-and-advice',
        cy: 'https://www.moneyhelper.org.uk/cy/getting-help-and-advice',
      }),
      label: z({ en: 'Getting help and advice', cy: 'Cael help a chyngor' }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/contact-us',
        cy: 'https://www.moneyhelper.org.uk/cy/contact-us',
      }),
      label: z({ en: 'Contact us', cy: 'Cysylltu â ni' }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/about-us/partnerships',
        cy: 'https://www.moneyhelper.org.uk/cy/about-us/partnerships',
      }),
      label: z({ en: 'Partners', cy: 'Partneriaethau' }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/tools-and-calculators',
        cy: 'https://www.moneyhelper.org.uk/cy/tools-and-calculators',
      }),
      label: z({ en: 'Tools and calculators', cy: 'Offer a chyfrifianellau' }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/contact-us/feedback',
        cy: 'https://www.moneyhelper.org.uk/cy/contact-us/feedback',
      }),
      label: z({ en: 'Give feedback', cy: 'Rhoi adborth' }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/about-us/welsh-language-scheme',
        cy: 'https://www.moneyhelper.org.uk/cy/about-us/welsh-language-scheme',
      }),
      label: z({ en: 'Welsh language scheme', cy: 'Cynllun Iaith Gymraeg' }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/blog',
        cy: 'https://www.moneyhelper.org.uk/cy/blog',
      }),
      label: z({ en: 'Blog', cy: 'Blog' }),
    },
  ];

  const secondaryLinkData = [
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/about-us/terms-and-conditions',
        cy: 'https://www.moneyhelper.org.uk/cy/about-us/terms-and-conditions',
      }),
      label: z({
        en: 'Terms & conditions',
        cy: 'Telerau ac amodau',
      }),
    },
    {
      link: z({
        en:
          altPrivacyLink ??
          'https://www.moneyhelper.org.uk/en/about-us/privacy-notice',
        cy:
          altPrivacyLink ??
          'https://www.moneyhelper.org.uk/cy/about-us/privacy-notice',
      }),
      label: z({
        en: 'Privacy notice',
        cy: 'Hysbysiad preifatrwydd',
      }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/about-us/accessibility',
        cy: 'https://www.moneyhelper.org.uk/cy/about-us/accessibility',
      }),
      label: z({ en: 'Accessibility statement', cy: 'Datganiad hygyrchedd' }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/sitemap',
        cy: 'https://www.moneyhelper.org.uk/cy/sitemap',
      }),
      label: z({ en: 'Sitemap', cy: 'Map safle' }),
    },
    {
      link: z({
        en:
          altCookieLink ??
          'https://www.moneyhelper.org.uk/en/about-us/cookie-policy',
        cy:
          altCookieLink ??
          'https://www.moneyhelper.org.uk/cy/about-us/cookie-policy',
      }),
      label: z({
        en: 'Cookies',
        cy: 'Sut rydym yn defnyddio cwcis',
      }),
    },
  ];

  return { primaryLinkData, secondaryLinkData };
};
