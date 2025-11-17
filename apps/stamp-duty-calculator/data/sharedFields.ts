import useTranslation from '@maps-react/hooks/useTranslation';

/**
 * Creates all shared form fields for stamp duty calculators (SDLT, LTT, LBTT)
 * Returns an array of field configurations: buyerType, price, and purchaseDate
 */
export const createStampDutyFields = (
  z: ReturnType<typeof useTranslation>['z'],
) => [
  {
    name: 'buyerType',
    label: z({ en: 'I am buying', cy: "Rwy'n prynu" }),
    type: 'select' as const,
    required: true,
  },
  {
    name: 'price',
    label: z({ en: 'Property price', cy: 'Pris Eiddo' }),
    type: 'money' as const,
    required: true,
  },
  {
    name: 'purchaseDate',
    label: z({
      en: 'Purchase date',
      cy: 'Dyddiad prynu',
    }),
    type: 'date' as const,
    hint: z({
      en: 'Usually estimated completion date. For example, 15 2 2026',
      cy: 'Y dyddiad cyflawni arfaethedig fel arfer Er enghraifft, 15 2 2026',
    }),
    required: true,
  },
];
