/** Stable `data-testid` for navigation links derived from AEM `linkTo` paths. */
export const linkToTestId = (linkTo: string): string => {
  const slug = linkTo.replaceAll('/', '-').split('-').filter(Boolean).join('-');
  return `${slug || 'home'}-link`;
};
