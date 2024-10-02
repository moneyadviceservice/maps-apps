import { useTranslation } from '@maps-react/hooks/useTranslation';

export const FooterLinks = () => {
  const { z } = useTranslation();

  const linkData = [
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/about-us',
        cy: 'https://www.moneyhelper.org.uk/cy/about-us',
      }),
      label: z({ en: 'About us', cy: 'Amdanom ni' }),
    },
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
        en: 'https://www.moneyhelper.org.uk/en/about-us/privacy-notice',
        cy: 'https://www.moneyhelper.org.uk/cy/about-us/privacy-notice',
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
      label: z({ en: 'Accessibility', cy: 'Datganiad hygyrchedd' }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/about-us/cookie-policy',
        cy: 'https://www.moneyhelper.org.uk/cy/about-us/cookie-policy',
      }),
      label: z({
        en: 'Cookies',
        cy: 'Sut rydym yn defnyddio cwcis',
      }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/contact-us/report-a-problem',
        cy: 'https://www.moneyhelper.org.uk/cy/contact-us/report-a-problem',
      }),
      label: z({
        en: 'Report a problem',
        cy: 'Rhoi gwybod am broblem',
      }),
    },
    {
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/contact-us',
        cy: 'https://www.moneyhelper.org.uk/cy/contact-us',
      }),
      label: z({ en: 'Contact us', cy: 'Cysylltu â ni' }),
    },
  ];

  return { linkData };
};
