type sdcBreadcrumbsProps = {
  z: (translations: { en: string; cy: string }) => string;
  toolHref: string;
  breadcrumbTitle: string;
};
export const sdcBreadcrumbs = ({
  z,
  toolHref,
  breadcrumbTitle,
}: sdcBreadcrumbsProps) => [
  {
    label: z({ en: 'MoneyHelper', cy: 'HelpwrArian' }),
    link: z({
      en: 'https://www.moneyhelper.org.uk/en',
      cy: 'https://www.moneyhelper.org.uk/cy',
    }),
  },
  {
    label: z({ en: 'Homes', cy: 'Cartrefi' }),
    link: z({
      en: 'https://www.moneyhelper.org.uk/en/homes',
      cy: 'https://www.moneyhelper.org.uk/cy/homes',
    }),
  },
  {
    label: z({ en: 'Buying a home', cy: ' Prynu tŷ' }),
    link: z({
      en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home',
      cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home',
    }),
  },
  { label: breadcrumbTitle, link: toolHref },
];
