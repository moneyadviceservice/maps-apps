import type { ReactNode } from 'react';

import type { StaticImageData } from 'next/image';

import { Link } from '@maps-react/common/components/Link';
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
    title: z({ en: 'Unleaded (E10)', cy: 'Unleaded (E10)' }),
  },
  {
    value: 'E5',
    title: z({ en: 'Super unleaded (E5)', cy: 'Super unleaded (E5)' }),
  },
  {
    value: 'B7_STANDARD',
    title: z({ en: 'Diesel', cy: 'Disel' }),
  },
  {
    value: 'B7_PREMIUM',
    title: z({ en: 'Premium diesel', cy: 'Disel premiwm' }),
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
  {
    value: 'airScreenwash',
    title: z({
      en: 'Air or screenwash',
      cy: "Aer neu hylif glanhau'r sgrin wynt",
    }),
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
  {
    value: 'distance',
    text: z({ en: 'Distance (closest)', cy: 'Pellter (yr agosaf)' }),
  },
  {
    value: 'price',
    text: z({ en: 'Price (cheapest)', cy: 'Pris (y rhataf)' }),
  },
  {
    value: 'name',
    text: z({ en: 'Station name (A-Z)', cy: "Enw'r orsaf (A-Z)" }),
  },
];

export const pageTitle = (z: ReturnType<typeof useTranslation>['z']) =>
  z({ en: 'Petrol price finder', cy: 'Canfyddwr prisiau petrol' });

export const analyticsPageTitle = (z: ReturnType<typeof useTranslation>['z']) =>
  z({
    en: `${pageTitle(z)} - MoneyHelper Tools`,
    cy: `${pageTitle(z)} - Teclynnau HelpwrArian`,
  });

export const perPageOptions: SelectOption[] = [
  { value: '3', text: '3' },
  { value: '10', text: '10' },
  { value: '20', text: '20' },
];

export const FUEL_TYPE_LABELS: Record<string, string> = {
  E5: 'Super unleaded (E5)',
  E10: 'Unleaded (E10)',
  B7_STANDARD: 'Diesel',
  B7_PREMIUM: 'Premium diesel',
};

export const AMENITY_LABELS: Record<string, { en: string; cy: string }> = {
  water_filling: { en: 'Water Filling', cy: 'Llenwi Dŵr' },
  car_wash: { en: 'Car Wash', cy: 'Golchi Car' },
  customer_toilets: { en: 'Toilets', cy: 'Toiledau' },
  adblue_packaged: { en: 'AdBlue (Packaged)', cy: 'Adblue (pecyn)' },
  adblue_pumps: { en: 'AdBlue Pumps', cy: 'Pympiau Adblue' },
  air_pump_or_screenwash: {
    en: 'Air or screenwash',
    cy: "Aer neu hylif glanhau'r sgrin wynt",
  },
};

interface OtherTool {
  title: string;
  description: string;
  href: string;
  image: StaticImageData;
}

export const otherToolsData = (
  z: ReturnType<typeof useTranslation>['z'],
  lang: string,
  images: {
    budgetPlanner: StaticImageData;
    billPrioritiser: StaticImageData;
    benefitsCalculator: StaticImageData;
  },
): OtherTool[] => [
  {
    title: z({ en: 'Budget planner', cy: 'Cynllunydd cyllideb' }),
    description: z({
      en: "Get in control of your household spending to help you see where your money's going.",
      cy: "Cael rheolaeth dros wariant eich cartref i'ch helpu i weld ble mae eich arian yn mynd.",
    }),
    href: `https://www.moneyhelper.org.uk/${lang}/everyday-money/budgeting/budget-planner`,
    image: images.budgetPlanner,
  },
  {
    title: z({ en: 'Bill prioritiser', cy: 'Blaenoriaethwr biliau' }),
    description: z({
      en: 'Our easy-to-use tool sorts out the bills you need to deal with first to avoid missing payments.',
      cy: "Mae ein teclyn hawdd ei ddefnyddio yn trefnu'r biliau y mae angen i chi ddelio â nhw yn gyntaf er mwyn osgoi methu taliadau.",
    }),
    href: `https://www.moneyhelper.org.uk/${lang}/money-troubles/cost-of-living/bill-prioritiser`,
    image: images.billPrioritiser,
  },
  {
    title: z({ en: 'Benefits calculator', cy: 'Cyfrifiannell budd-daliadau' }),
    description: z({
      en: "If you're living on a low income or have had an income shock, use our Benefits calculator to quickly find out what you could be entitled to.",
      cy: "Os ydych chi'n byw ar incwm isel neu wedi cael sioc incwm, defnyddiwch ein cyfrifiannell budd-daliadau i ddarganfod yn gyflym beth y gallech fod â hawl iddo.",
    }),
    href: `https://www.moneyhelper.org.uk/${lang}/benefits/benefits-calculator`,
    image: images.benefitsCalculator,
  },
];

interface NextStep {
  heading: { en: string; cy: string };
  content: { en: ReactNode; cy: ReactNode };
}

export const nextStepsData: NextStep[] = [
  {
    heading: {
      en: 'Make your money go further',
      cy: "Gwnewch i'ch arian fynd ymhellach",
    },
    content: {
      en: (
        <>
          Find out{' '}
          <Link
            href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/squeezed-income"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            how to cut your costs and save money on bills
          </Link>
          .
        </>
      ),
      cy: (
        <>
          Darganfyddwch{' '}
          <Link
            href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/squeezed-income"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            sut i dorri eich costau ac arbed arian ar filiau.
          </Link>
          .
        </>
      ),
    },
  },
  {
    heading: { en: 'Look into support', cy: 'Edrych i mewn i gefnogaeth' },
    content: {
      en: (
        <>
          Find out about ways to tackle{' '}
          <Link
            href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            the cost of living
          </Link>
          , as well as the extra support you can claim.
        </>
      ),
      cy: (
        <>
          Darganfyddwch am ffyrdd o fynd i'r afael â{' '}
          <Link
            href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            chostau byw
          </Link>
          , yn ogystal â'r cymorth ychwanegol y gallwch ei hawlio.
        </>
      ),
    },
  },
  {
    heading: { en: 'Get help with debt', cy: 'Cael help gyda dyled' },
    content: {
      en: (
        <>
          If you&apos;re{' '}
          <Link
            href="https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            struggling with debt
          </Link>
          , you&apos;re not alone, speak to a{' '}
          <Link
            href="https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            free debt adviser
          </Link>
          .
        </>
      ),
      cy: (
        <>
          Os ydych chi&apos;n{' '}
          <Link
            href="https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/help-if-youre-struggling-with-debt"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            cael trafferth gyda dyled
          </Link>
          , nid ydych ar eich pen eich hun, siaradwch â{' '}
          <Link
            href="https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator"
            target="_blank"
            asInlineText
            withIcon={false}
          >
            chynghorydd dyled am ddim
          </Link>
          .
        </>
      ),
    },
  },
];
