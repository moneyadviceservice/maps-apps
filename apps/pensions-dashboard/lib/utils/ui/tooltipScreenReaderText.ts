export const tooltipScreenReaderText = (
  text: string,
  t: (key: string) => string,
): string => {
  return t('common.more-information') + ' ' + t('common.on') + ' ' + text;
};
