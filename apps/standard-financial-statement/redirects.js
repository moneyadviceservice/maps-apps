const redirects = [
  // HEADER
  {
    source: '/:lang(en|cy)/use-the-sfs/look-up-a-sfs-licence',
    destination: '/:lang/what-is-the-sfs/public-organisations',
    permanent: true,
  },
  // WHAT IS THE SFS
  {
    source: '/:lang(en|cy)/what-is-the-standard-financial-statement',
    destination: '/:lang/what-is-the-sfs',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/what-is-the-standard-financial-statement/who-created-the-sfs',
    destination: '/:lang/what-is-the-sfs',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/what-is-the-standard-financial-statement/find-free-debt-advice',
    destination: '/:lang/what-is-the-sfs/find-free-debt-advice',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/what-is-the-standard-financial-statement/public-organisations',
    destination: '/:lang/what-is-the-sfs/public-organisations',
    permanent: true,
  },
  // SPENDING GUIDELINES
  {
    source:
      '/:lang(en|cy)/use-the-sfs/spending-guidelines/spending-guidelines-methodology',
    destination: '/:lang/use-the-sfs/spending-guidelines-methodology',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/use-the-sfs/spending-guidelines/spending-guidlines-commentary-2026-26',
    destination: '/:lang/use-the-sfs/spending-guidelines-commentary',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/use-the-sfs/spending-guidelines/spending-guidlines-commentary-2024-25',
    destination: '/:lang/use-the-sfs/commentary-for-past-years',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/use-the-sfs/spending-guidelines/uprated-spending-guidelines-june-2022-commentary',
    destination: '/:lang/use-the-sfs/commentary-for-past-years',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/use-the-sfs/spending-guidelines/spending-guidelines-commentary',
    destination: '/:lang/use-the-sfs/commentary-for-past-years',
    permanent: true,
  },
  {
    source: '/:lang(en|cy)/spending-guidelines-april-2023-commentary',
    destination: '/:lang/use-the-sfs/commentary-for-past-years',
    permanent: true,
  },
  // DOWNLOADS
  {
    source: '/:lang(en|cy)/use-the-sfs/download-the-sfs-format-2018',
    destination: '/:lang/use-the-sfs/download-the-sfs-format',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/use-the-sfs/amended-standard-financial-statement-format-for-2018',
    destination: '/:lang/use-the-sfs/download-the-sfs-format',
    permanent: true,
  },
  // GUIDANCE
  {
    source:
      '/:lang(en|cy)/use-the-sfs/encouraging-debt-advice-clients-to-save-using-behavioural-science',
    destination: '/:lang/use-the-sfs/encouraging-debt-advice',
    permanent: true,
  },
  {
    source: '/:lang(en|cy)/use-the-sfs/frequently-asked-questions-2',
    destination: '/:lang/use-the-sfs/frequently-asked-questions',
    permanent: true,
  },
  // CONTACT US
  {
    source: '/:lang(en|cy)/use-the-sfs/download-the-sfs-logo',
    destination: '/:lang/contact-us',
    permanent: true,
  },
  {
    source: '/:lang(en|cy)/use-the-sfs/sfs-developer-toolkit',
    destination: '/:lang/contact-us',
    permanent: true,
  },
  {
    source: '/:lang(en|cy)/use-the-sfs/training',
    destination: '/:lang/contact-us',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/use-the-sfs/spending-guidelines/minimum-income-standard-comparison',
    destination: '/:lang/contact-us',
    permanent: true,
  },
  {
    source: '/:lang(en|cy)/use-the-sfs/lsb-report',
    destination: '/:lang/contact-us',
    permanent: true,
  },
  {
    source:
      '/:lang(en|cy)/use-the-sfs/spending-guidelines/minimum-income-standard-comparison',
    destination: '/:lang/contact-us',
    permanent: true,
  },
  // LOGIN
  {
    source: '/:lang(en|cy)/login',
    destination: '/:lang',
    permanent: true,
  },
];

module.exports = redirects;
