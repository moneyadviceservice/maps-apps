import { useTranslation } from '@maps-react/hooks/useTranslation';

export const breadcrumbs = (z: ReturnType<typeof useTranslation>['z']) => {
  return [
    {
      label: z({ en: 'Home', cy: 'Hafan' }),
      link: z({
        en: 'https://www.moneyhelper.org.uk/en',
        cy: 'https://www.moneyhelper.org.uk/cy',
      }),
    },
    {
      label: z({
        en: 'Savings',
        cy: 'Cynilion',
      }),
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/savings',
        cy: 'https://www.moneyhelper.org.uk/cy/savings',
      }),
    },
    {
      label: z({
        en: 'How to save',
        cy: 'Sut i gynilo',
      }),
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/savings/how-to-save',
        cy: 'https://www.moneyhelper.org.uk/cy/savings/how-to-save',
      }),
    },
  ];
};
