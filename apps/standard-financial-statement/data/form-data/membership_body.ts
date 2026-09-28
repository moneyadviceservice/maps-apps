export const membershipBody = [
  {
    key: 'advice-ni',
    en: 'Advice NI',
    cy: 'Cyngor NI',
  },
  {
    key: 'advice-uk',
    en: 'Advice UK',
    cy: 'Cyngor DU',
  },
  {
    key: 'citizens-advice',
    en: 'Citizens Advice',
    cy: 'Cyngor y Bobl',
  },
  {
    key: 'ccua',
    en: 'CCUA',
    cy: 'CCUA',
  },
  {
    key: 'civea',
    en: 'CIVEA',
    cy: 'CIVEA',
  },
  {
    key: 'cma',
    en: 'CMA',
    cy: 'CMA',
  },
  {
    key: 'csa',
    en: 'CSA',
    cy: 'CSA',
  },
  {
    key: 'demsa',
    en: 'DEMSA',
    cy: 'DEMSA',
  },
  {
    key: 'drf',
    en: 'DFR',
    cy: 'DFR',
  },
  {
    key: 'fla',
    en: 'FLA',
    cy: 'FLA',
  },
  {
    key: 'hceoa',
    en: 'HCEOA',
    cy: 'HCEOA',
  },
  {
    key: 'ima',
    en: 'IMA',
    cy: 'IMA',
  },
  {
    key: 'ipa',
    en: 'IPA',
    cy: 'IPA',
  },
  {
    key: 'irrv',
    en: 'IRRV',
    cy: 'IRRV',
  },
  {
    key: 'r3',
    en: 'R3',
    cy: 'R3',
  },
  {
    key: 'uk-finance',
    en: 'UK Finance',
    cy: 'UK Finance',
  },
  {
    key: 'none',
    en: 'none',
    cy: 'none',
  },
  {
    key: 'other',
    en: 'Other (please specify below)',
    cy: 'Arall (Nodwch isod osod)',
  },
];

export const orderedMembershipBody = membershipBody?.sort((a, b) => {
  if (a.key === 'other') return 1;
  if (b.key === 'other') return -1;
  return a.key.localeCompare(b.key);
});
