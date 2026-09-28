/** In-page anchor link hashes (href suffix). */
export const ANCHOR_LINK = {
  who: '#who',
} as const;

/** Side navigation link `data-testid` values (derived from AEM `linkTo` paths). */
export const NAV_LINK = {
  sfsCodeOfConduct: 'apply-to-use-the-sfs-sfs-code-of-conduct-link',
  spendingGuidelines: 'use-the-sfs-spending-guidelines-link',
  spendingGuidelinesCommentary:
    'use-the-sfs-spending-guidelines-commentary-link',
  commentaryForPastYears: 'use-the-sfs-commentary-for-past-years-link',
  methodology: 'use-the-sfs-spending-guidelines-methodology-link',
  sfsFormat: 'use-the-sfs-download-the-sfs-format-link',
  sfsExcelTool: 'use-the-sfs-download-the-sfs-excel-tool-link',
  sfsCustomerVersion: 'use-the-sfs-sfs-customer-version-link',
  guidanceForUsingTheSfs: 'use-the-sfs-guidance-for-using-the-sfs-link',
  frequentlyAskedQuestions: 'use-the-sfs-frequently-asked-questions-link',
  governanceGroupTor: 'use-the-sfs-governance-group-tor-link',
  encouragingDebtAdvice: 'use-the-sfs-encouraging-debt-advice-link',
  memberOrganisations: 'what-is-the-sfs-public-organisations-link',
  findFreeDebtAdvice: 'what-is-the-sfs-find-free-debt-advice-link',
} as const;

/** Header main navigation link `data-testid` values. */
export const HEADER_LINK = {
  whatIsSfs: 'what-is-the-sfs-link',
  useTheSfs: 'use-the-sfs-link',
  applyToUse: 'apply-to-use-the-sfs-link',
  contactUs: 'contact-us-link',
} as const;

/** Footer link `data-testid` values. */
export const FOOTER_LINK = {
  privacy: 'privacy-link',
  accessibility: 'accessibility-link',
  cookies: 'cookies-link',
  sitemap: 'sitemap-link',
} as const;
