export const mockSiteSettings = {
  navigation: [
    {
      linkTo: 'https://maps.org.uk/en/about-us',
      text: 'About us',
      children: [
        {
          linkTo: 'https://maps.org.uk/en/about-us/who-we-are',
          text: 'Who we are',
          children: [],
        },
      ],
    },
    {
      linkTo: 'https://maps.org.uk/en/our-work',
      text: 'Our work',
      children: [
        {
          linkTo:
            'https://maps.org.uk/en/our-work/uk-strategy-for-financial-wellbeing',
          text: 'UK Strategy for Financial Wellbeing',
          children: [
            {
              linkTo:
                'https://maps.org.uk/en/our-work/uk-strategy-for-financial-wellbeing',
              text: 'UK Strategy for Financial Wellbeing',
            },
          ],
        },
      ],
    },
  ],
  footerLinks: [
    {
      title: 'Legal',
      childLinks: [
        {
          text: 'Terms and conditions',
          linkTo: 'https://maps.org.uk/en/about-us/terms-and-conditions',
        },
        {
          text: 'Privacy notice',
          linkTo: 'https://maps.org.uk/en/about-us/privacy-notice',
        },
        {
          text: 'Cookie policy',
          linkTo: 'https://maps.org.uk/en/about-us/cookie-policy',
        },
        {
          text: 'Money and Pensions Service standards',
          linkTo:
            'https://maps.org.uk/en/about-us/money-and-pensions-service-standards',
        },
      ],
    },
  ],
};
