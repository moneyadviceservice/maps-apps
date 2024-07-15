import { useTranslation } from '@maps-digital/shared/hooks';
import { Crumb } from '@maps-digital/shared/ui';

export const breadcrumbs = (
  z: ReturnType<typeof useTranslation>['z'],
): Crumb[] => {
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
        en: 'Pensions & retirement',
        cy: 'Pensiynau ac ymddeoliad',
      }),
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement',
        cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement',
      }),
    },
    {
      label: z({
        en: 'Auto enrolment',
        cy: 'Ymrestru awtomatig',
      }),
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment',
        cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment',
      }),
    },
  ];
};
