import { useTranslation } from '@maps-react/hooks/useTranslation';

export const HeaderLinks = () => {
  const { z } = useTranslation();

  const menu = [
    {
      title: z({ en: 'Benefits', cy: 'Budd-daliadau' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/benefits',
        cy: 'https://www.moneyhelper.org.uk/cy/benefits',
      }),
    },
    {
      title: z({ en: 'Everyday money', cy: 'Arian bob dydd' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/everyday-money',
        cy: 'https://www.moneyhelper.org.uk/cy/everyday-money',
      }),
    },
    {
      title: z({ en: 'Family & care', cy: 'Teulu a gofal' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/family-and-care',
        cy: 'https://www.moneyhelper.org.uk/cy/family-and-care',
      }),
    },
    {
      title: z({ en: 'Homes', cy: 'Cartrefi' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/homes',
        cy: 'https://www.moneyhelper.org.uk/cy/homes',
      }),
    },
    {
      title: z({ en: 'Money troubles', cy: 'Problemau ariannol' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/money-troubles',
        cy: 'https://www.moneyhelper.org.uk/cy/money-troubles',
      }),
    },
    {
      title: z({ en: 'Pensions & retirement', cy: 'Pensiynau ac ymddeoliad' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement',
        cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement',
      }),
    },
    {
      title: z({ en: 'Savings', cy: 'Cynilion' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/savings',
        cy: 'https://www.moneyhelper.org.uk/cy/savings',
      }),
    },
    {
      title: z({ en: 'Work', cy: 'Gwaith' }),
      href: z({
        en: 'https://www.moneyhelper.org.uk/en/work',
        cy: 'https://www.moneyhelper.org.uk/cy/work',
      }),
    },
  ];

  return { menu };
};
