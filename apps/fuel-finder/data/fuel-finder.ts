import { useTranslation } from '@maps-react/hooks/useTranslation';

interface FilterOption {
  value: string;
  title: string;
  details?: string;
}

interface SelectOption {
  value: string;
  text: string;
}

export const fuelTypeOptions = (
  z: ReturnType<typeof useTranslation>['z'],
): FilterOption[] => [
  {
    value: 'E10',
    title: z({ en: 'Unleaded (E10)', cy: 'Di-blwm (E10)' }),
  },
  {
    value: 'E5',
    title: z({ en: 'Super Unleaded (E5)', cy: 'Uwch Di-blwm (E5)' }),
  },
  {
    value: 'B7_STANDARD',
    title: z({ en: 'Diesel', cy: 'Disel' }),
  },
  {
    value: 'B7_PREMIUM',
    title: z({ en: 'Premium Diesel', cy: 'Disel Premiwm' }),
  },
];

export const stationTypeOptions = (
  z: ReturnType<typeof useTranslation>['z'],
): FilterOption[] => [
  {
    value: 'motorway',
    title: z({ en: 'Motorway stations', cy: 'Gorsafoedd traffordd' }),
  },
  {
    value: 'supermarket',
    title: z({ en: 'Supermarket stations', cy: 'Gorsafoedd archfarchnad' }),
  },
  {
    value: 'open24h',
    title: z({ en: 'Open 24 hours', cy: 'Ar agor 24 awr' }),
  },
  {
    value: 'toilets',
    title: z({ en: 'Toilets', cy: 'Toiledau' }),
  },
];

export const radiusOptions = (
  z: ReturnType<typeof useTranslation>['z'],
): SelectOption[] => [
  { value: '5', text: z({ en: 'Within 5 miles', cy: 'O fewn 5 milltir' }) },
  { value: '10', text: z({ en: 'Within 10 miles', cy: 'O fewn 10 milltir' }) },
  { value: '25', text: z({ en: 'Within 25 miles', cy: 'O fewn 25 milltir' }) },
  { value: '50', text: z({ en: 'Within 50 miles', cy: 'O fewn 50 milltir' }) },
];

export const sortOptions = (
  z: ReturnType<typeof useTranslation>['z'],
): SelectOption[] => [
  { value: 'distance', text: z({ en: 'Distance', cy: 'Pellter' }) },
  {
    value: 'price',
    text: z({ en: 'Cheapest first', cy: 'Rhataf yn gyntaf' }),
  },
  { value: 'name', text: z({ en: 'Name A-Z', cy: 'Enw A-Z' }) },
];

export const perPageOptions: SelectOption[] = [
  { value: '3', text: '3' },
  { value: '10', text: '10' },
  { value: '20', text: '20' },
];

export const FUEL_TYPE_LABELS: Record<string, string> = {
  E5: 'Super Unleaded (E5)',
  E10: 'Unleaded (E10)',
  B7_STANDARD: 'Diesel',
  B7_PREMIUM: 'Premium Diesel',
};

export const AMENITY_LABELS: Record<string, string> = {
  water_filling: 'Water Filling',
  car_wash: 'Car Wash',
  customer_toilets: 'Toilets',
  adblue_packaged: 'AdBlue (Packaged)',
  adblue_pumps: 'AdBlue Pumps',
};
