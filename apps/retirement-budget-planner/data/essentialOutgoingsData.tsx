import useTranslation from '@maps-react/hooks/useTranslation';
import { DEFAULT_PREFIX } from 'lib/constants/constants';
import { FREQUNCY_KEYS } from 'lib/constants/pageConstants';
import { PageContentType, CostsFieldTypes } from 'lib/types/page.type';
import { generateMultipleItems } from 'lib/util/contentFilter/contentFilter';

export const essentialOutgoingsContent = (
  t: ReturnType<typeof useTranslation>['t'],
): PageContentType => {
  return {
    step: 3,
    content: [
      {
        sectionName: 'housingCost',
        sectionTitle: t('essentialOutgoings.housingCost.title'),
      },
      {
        sectionName: 'utilities',
        sectionTitle: t('essentialOutgoings.utilities.title'),
      },
      {
        sectionName: 'travelCosts',
        sectionTitle: t('essentialOutgoings.travelCosts.title'),
      },
      {
        sectionName: 'lending',
        sectionTitle: t('essentialOutgoings.lending.title'),
      },
      {
        sectionName: 'insurance',
        sectionTitle: t('essentialOutgoings.insurance.title'),
      },
      {
        sectionName: 'householdExpenses',
        sectionTitle: t('essentialOutgoings.householdExpenses.title'),
      },
      {
        sectionName: 'essentialsAdditionalItems',
        sectionTitle: t('essentialOutgoings.essentialsAdditionalItems.title'),
      },
    ],
  };
};

const FIELD_NAMES = {
  MORTGAGE_REPAYMENT: 'mortgageRepayment',
  RENT: 'rent',
  GROUND_RENT: 'groundRent',
  SERVICE_CHARGE: 'serviceCharge',
  COUNCIL_TAX: 'councilTax',
  TV_LICENCE: 'tvLicence',
  ELECTRIC: 'electric',
  PHONE: 'phone',
  MOBILE_PHONE: 'mobilePhone',
  WATER: 'water',
  INTERNET: 'internet',
  PUBLIC_TRANSPORT: 'publicTransport',
  PETROL: 'petrol',
  ROAD_TAX: 'roadTax',
  OTHER_VEHICLE: 'otherVehicle',
  LOANS: 'loans',
  BUY_NOW_PAY_LATER: 'buyNowPayLater',
  HOME_CONTENT_INSURANCE: 'homeContentInsurance',
  CAR_VAN_BIKE: 'carVanMotorbike',
  LIFE_FUNERAL: 'lifeFuneralInsurance',
  PET: 'petInsurance',
  FOOD: 'food',
  HEALTH_BEAUTY: 'healthBeauty',
  MEDICATION: 'medication',
  PET_ESSENTIAL: 'petEssentials',
  CLOTHES_SHOES: 'clothesShoes',
  ADDITIONAL_ITEMS: 'essentialsAdditionalItems',
};
const prefix = DEFAULT_PREFIX;

export const costsModel: CostsFieldTypes[] = [
  {
    sectionName: 'housingCost',
    items: [
      {
        index: 0,
        moneyInputName: `${prefix}${FIELD_NAMES.MORTGAGE_REPAYMENT}`,
        frequencyName: `${prefix}${FIELD_NAMES.MORTGAGE_REPAYMENT}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 1,
        moneyInputName: `${prefix}${FIELD_NAMES.RENT}`,
        frequencyName: `${prefix}${FIELD_NAMES.RENT}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 2,
        moneyInputName: `${prefix}${FIELD_NAMES.GROUND_RENT}`,
        frequencyName: `${prefix}${FIELD_NAMES.GROUND_RENT}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 3,
        moneyInputName: `${prefix}${FIELD_NAMES.SERVICE_CHARGE}`,
        frequencyName: `${prefix}${FIELD_NAMES.SERVICE_CHARGE}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
    ],
  },
  {
    sectionName: 'utilities',
    items: [
      {
        index: 0,
        moneyInputName: `${prefix}${FIELD_NAMES.COUNCIL_TAX}`,
        frequencyName: `${prefix}${FIELD_NAMES.COUNCIL_TAX}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 1,
        moneyInputName: `${prefix}${FIELD_NAMES.TV_LICENCE}`,
        frequencyName: `${prefix}${FIELD_NAMES.TV_LICENCE}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 2,
        moneyInputName: `${prefix}${FIELD_NAMES.ELECTRIC}`,
        frequencyName: `${prefix}${FIELD_NAMES.ELECTRIC}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 3,
        moneyInputName: `${prefix}${FIELD_NAMES.PHONE}`,
        frequencyName: `${prefix}${FIELD_NAMES.PHONE}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 4,
        moneyInputName: `${prefix}${FIELD_NAMES.MOBILE_PHONE}`,
        frequencyName: `${prefix}${FIELD_NAMES.MOBILE_PHONE}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 5,
        moneyInputName: `${prefix}${FIELD_NAMES.WATER}`,
        frequencyName: `${prefix}${FIELD_NAMES.WATER}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 6,
        moneyInputName: `${prefix}${FIELD_NAMES.INTERNET}`,
        frequencyName: `${prefix}${FIELD_NAMES.INTERNET}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
    ],
  },
  {
    sectionName: 'travelCosts',
    items: [
      {
        index: 0,
        moneyInputName: `${prefix}${FIELD_NAMES.PUBLIC_TRANSPORT}`,
        frequencyName: `${prefix}${FIELD_NAMES.PUBLIC_TRANSPORT}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 1,
        moneyInputName: `${prefix}${FIELD_NAMES.PETROL}`,
        frequencyName: `${prefix}${FIELD_NAMES.PETROL}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 2,
        moneyInputName: `${prefix}${FIELD_NAMES.ROAD_TAX}`,
        frequencyName: `${prefix}${FIELD_NAMES.ROAD_TAX}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 3,
        moneyInputName: `${prefix}${FIELD_NAMES.OTHER_VEHICLE}`,
        frequencyName: `${prefix}${FIELD_NAMES.OTHER_VEHICLE}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
    ],
  },
  {
    sectionName: 'lending',
    items: [
      {
        index: 0,
        moneyInputName: `${prefix}${FIELD_NAMES.LOANS}`,
        frequencyName: `${prefix}${FIELD_NAMES.LOANS}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 1,
        moneyInputName: `${prefix}${FIELD_NAMES.BUY_NOW_PAY_LATER}`,
        frequencyName: `${prefix}${FIELD_NAMES.BUY_NOW_PAY_LATER}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
    ],
  },
  {
    sectionName: 'insurance',
    items: [
      {
        index: 0,
        moneyInputName: `${prefix}${FIELD_NAMES.HOME_CONTENT_INSURANCE}`,
        frequencyName: `${prefix}${FIELD_NAMES.HOME_CONTENT_INSURANCE}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 1,
        moneyInputName: `${prefix}${FIELD_NAMES.CAR_VAN_BIKE}`,
        frequencyName: `${prefix}${FIELD_NAMES.CAR_VAN_BIKE}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 2,
        moneyInputName: `${prefix}${FIELD_NAMES.LIFE_FUNERAL}`,
        frequencyName: `${prefix}${FIELD_NAMES.LIFE_FUNERAL}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 3,
        moneyInputName: `${prefix}${FIELD_NAMES.PET}`,
        frequencyName: `${prefix}${FIELD_NAMES.PET}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
    ],
  },
  {
    sectionName: 'householdExpenses',
    items: [
      {
        index: 0,
        moneyInputName: `${prefix}${FIELD_NAMES.FOOD}`,
        frequencyName: `${prefix}${FIELD_NAMES.FOOD}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 1,
        moneyInputName: `${prefix}${FIELD_NAMES.HEALTH_BEAUTY}`,
        frequencyName: `${prefix}${FIELD_NAMES.HEALTH_BEAUTY}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 2,
        moneyInputName: `${prefix}${FIELD_NAMES.MEDICATION}`,
        frequencyName: `${prefix}${FIELD_NAMES.MEDICATION}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 3,
        moneyInputName: `${prefix}${FIELD_NAMES.PET_ESSENTIAL}`,
        frequencyName: `${prefix}${FIELD_NAMES.PET_ESSENTIAL}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
      {
        index: 4,
        moneyInputName: `${prefix}${FIELD_NAMES.CLOTHES_SHOES}`,
        frequencyName: `${prefix}${FIELD_NAMES.CLOTHES_SHOES}Frequency`,
        defaultFrequency: FREQUNCY_KEYS.MONTH,
      },
    ],
  },
  {
    sectionName: 'essentialsAdditionalItems',
    items: generateMultipleItems(
      Array.from({ length: 5 }, (v, i) => i + 1),
      FIELD_NAMES.ADDITIONAL_ITEMS,
      false,
    ).map((k) => ({
      ...k,
    })),
  },
];

export const essentialOutgoingsItems = (
  t: ReturnType<typeof useTranslation>['t'],
): CostsFieldTypes[] =>
  costsModel.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      const fieldName = item.moneyInputName.split(prefix)[1];

      if (!fieldName) return item;

      if (fieldName.startsWith(FIELD_NAMES.ADDITIONAL_ITEMS)) {
        return {
          ...item,
          labelPlaceholder: t(
            'essentialOutgoings.essentialsAdditionalItems.placeholder',
          ),
        };
      }

      return {
        ...item,
        labelText: t(
          `essentialOutgoings.${section.sectionName}.${fieldName}.labelText`,
        ),
        moreInfo: t(
          `essentialOutgoings.${section.sectionName}.${fieldName}.moreInfo`,
        ),
      };
    }),
  }));
