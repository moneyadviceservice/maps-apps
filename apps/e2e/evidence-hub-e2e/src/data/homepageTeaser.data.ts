export const opensInNewWindowAccessibleNameSuffix = ' (opens in a new window)';

export const teaserCardAccessibleLinkName = (
  title: string,
  opensInNewWindow = false,
): string =>
  opensInNewWindow ? `${title}${opensInNewWindowAccessibleNameSuffix}` : title;
