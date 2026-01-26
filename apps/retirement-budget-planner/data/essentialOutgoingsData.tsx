import useTranslation from '@maps-react/hooks/useTranslation';
import { DEFAULT_PREFIX } from 'lib/constants/constants';
import { PageContentType, RetirementFieldTypes } from 'lib/types/page.type';
import { generateMultipleItems } from 'lib/util/contentFilter/contentFilter';

export const essentialOutgoingsContent = (
  t: ReturnType<typeof useTranslation>['t'],
  name: string,
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
        sectionName: 'essentailsAdditionalItems',
        sectionTitle: t('essentialOutgoings.essentailsAdditionalItems.title'),
      },
    ],
  };
};

export const essentialOutgoingsItems = (
  t: ReturnType<typeof useTranslation>['t'],
): RetirementFieldTypes[] => {
  const prefix = DEFAULT_PREFIX;
  return [
    {
      sectionName: 'housingCost',
      enableRemove: false,
      maxItems: 0,
      items: [
        {
          index: 0,
          moneyInputName: `${prefix}mortgageRepayment`,
          frequencyName: `${prefix}mortgageRepaymentFrequency`,
          labelText: t(
            'essentialOutgoings.housingCost.mortgageRepayment.labelText',
          ),
          moreInfo: t(
            'essentialOutgoings.housingCost.mortgageRepayment.moreInfo',
          ),
        },
        {
          index: 1,
          moneyInputName: `${prefix}rent`,
          frequencyName: `${prefix}rentFrequency`,
          labelText: t('essentialOutgoings.housingCost.rent.labelText'),
          moreInfo: t('essentialOutgoings.housingCost.rent.moreInfo'),
        },
        {
          index: 2,
          moneyInputName: `${prefix}groundRent`,
          frequencyName: `${prefix}groundRentFrequency`,
          labelText: t('essentialOutgoings.housingCost.groundRent.labelText'),
          moreInfo: t('essentialOutgoings.housingCost.groundRent.moreInfo'),
        },
        {
          index: 3,
          moneyInputName: `${prefix}serviceCharge`,
          frequencyName: `${prefix}serviceChargeFrequency`,
          labelText: t(
            'essentialOutgoings.housingCost.serviceCharge.labelText',
          ),
          moreInfo: t('essentialOutgoings.housingCost.serviceCharge.moreInfo'),
        },
      ],
    },
    {
      sectionName: 'utilities',
      enableRemove: false,
      maxItems: 0,
      items: [
        {
          index: 0,
          moneyInputName: `${prefix}councilTax`,
          frequencyName: `${prefix}councilTaxFrequency`,
          labelText: t('essentialOutgoings.utilities.councilTax.labelText'),
          moreInfo: t('essentialOutgoings.utilities.councilTax.moreInfo'),
        },
        {
          index: 1,
          moneyInputName: `${prefix}tvLicence`,
          frequencyName: `${prefix}tvLicenceFrequency`,
          labelText: t('essentialOutgoings.utilities.tvLicence.labelText'),
          moreInfo: t('essentialOutgoings.utilities.tvLicence.moreInfo'),
        },
        {
          index: 2,
          moneyInputName: `${prefix}electric`,
          frequencyName: `${prefix}electricFrequency`,
          labelText: t('essentialOutgoings.utilities.electric.labelText'),
          moreInfo: t('essentialOutgoings.utilities.electric.moreInfo'),
        },
        {
          index: 3,
          moneyInputName: `${prefix}phone`,
          frequencyName: `${prefix}phoneFrequency`,
          labelText: t('essentialOutgoings.utilities.phone.labelText'),
          moreInfo: t('essentialOutgoings.utilities.phone.moreInfo'),
        },
        {
          index: 4,
          moneyInputName: `${prefix}mobilePhone`,
          frequencyName: `${prefix}mobilePhoneFrequency`,
          labelText: t('essentialOutgoings.utilities.mobilePhone.labelText'),
          moreInfo: t('essentialOutgoings.utilities.mobilePhone.moreInfo'),
        },
        {
          index: 5,
          moneyInputName: `${prefix}water`,
          frequencyName: `${prefix}waterFrequency`,
          labelText: t('essentialOutgoings.utilities.water.labelText'),
          moreInfo: t('essentialOutgoings.utilities.water.moreInfo'),
        },
        {
          index: 6,
          moneyInputName: `${prefix}internet`,
          frequencyName: `${prefix}internetFrequency`,
          labelText: t('essentialOutgoings.utilities.internet.labelText'),
          moreInfo: t('essentialOutgoings.utilities.internet.moreInfo'),
        },
      ],
    },
    {
      sectionName: 'travelCosts',
      enableRemove: false,
      maxItems: 0,
      items: [
        {
          index: 0,
          moneyInputName: `${prefix}publicTransport`,
          frequencyName: `${prefix}publicTransportFrequency`,
          labelText: t(
            'essentialOutgoings.travelCosts.publicTransport.labelText',
          ),
          moreInfo: t(
            'essentialOutgoings.travelCosts.publicTransport.moreInfo',
          ),
        },
        {
          index: 1,
          moneyInputName: `${prefix}petrol`,
          frequencyName: `${prefix}petrolFrequency`,
          labelText: t('essentialOutgoings.travelCosts.petrol.labelText'),
          moreInfo: t('essentialOutgoings.travelCosts.petrol.moreInfo'),
        },
        {
          index: 2,
          moneyInputName: `${prefix}roadTax`,
          frequencyName: `${prefix}roadTaxFrequency`,
          labelText: t('essentialOutgoings.travelCosts.roadTax.labelText'),
          moreInfo: t('essentialOutgoings.travelCosts.roadTax.moreInfo'),
        },
        {
          index: 3,
          moneyInputName: `${prefix}otherVehicle`,
          frequencyName: `${prefix}otherVehicleFrequency`,
          labelText: t('essentialOutgoings.travelCosts.otherVehicle.labelText'),
          moreInfo: t('essentialOutgoings.travelCosts.otherVehicle.moreInfo'),
        },
      ],
    },
    {
      sectionName: 'lending',
      enableRemove: false,
      maxItems: 0,
      items: [
        {
          index: 0,
          moneyInputName: `${prefix}loans`,
          frequencyName: `${prefix}loansFrequency`,
          labelText: t('essentialOutgoings.lending.loans.labelText'),
          moreInfo: t('essentialOutgoings.lending.loans.moreInfo'),
        },
        {
          index: 1,
          moneyInputName: `${prefix}buyNowPayLater`,
          frequencyName: `${prefix}buyNowPayLaterFrequency`,
          labelText: t('essentialOutgoings.lending.buyNowPayLater.labelText'),
          moreInfo: t('essentialOutgoings.lending.buyNowPayLater.moreInfo'),
        },
      ],
    },
    {
      sectionName: 'insurance',
      enableRemove: false,
      maxItems: 0,
      items: [
        {
          index: 0,
          moneyInputName: `${prefix}homeContentInsurance`,
          frequencyName: `${prefix}homeContentInsuranceFrequency`,
          labelText: t(
            'essentialOutgoings.insurance.homeContentInsurance.labelText',
          ),
          moreInfo: t(
            'essentialOutgoings.insurance.homeContentInsurance.moreInfo',
          ),
        },
        {
          index: 1,
          moneyInputName: `${prefix}carVanMotorbike`,
          frequencyName: `${prefix}carVanMotorbikeFrequency`,
          labelText: t(
            'essentialOutgoings.insurance.carVanMotorbike.labelText',
          ),
          moreInfo: t('essentialOutgoings.insurance.carVanMotorbike.moreInfo'),
        },
        {
          index: 2,
          moneyInputName: `${prefix}lifeFuneralInsurance`,
          frequencyName: `${prefix}lifeFuneralInsuranceFrequency`,
          labelText: t(
            'essentialOutgoings.insurance.lifeFuneralInsurance.labelText',
          ),
          moreInfo: t(
            'essentialOutgoings.insurance.lifeFuneralInsurance.moreInfo',
          ),
        },
        {
          index: 3,
          moneyInputName: `${prefix}petInsurance`,
          frequencyName: `${prefix}petInsuranceFrequency`,
          labelText: t('essentialOutgoings.insurance.petInsurance.labelText'),
          moreInfo: t('essentialOutgoings.insurance.petInsurance.moreInfo'),
        },
      ],
    },
    {
      sectionName: 'householdExpenses',
      enableRemove: false,
      maxItems: 0,
      items: [
        {
          index: 0,
          moneyInputName: `${prefix}food`,
          frequencyName: `${prefix}foodFrequency`,
          labelText: t('essentialOutgoings.householdExpenses.food.labelText'),
          moreInfo: t('essentialOutgoings.householdExpenses.food.moreInfo'),
        },
        {
          index: 1,
          moneyInputName: `${prefix}healthBeauty`,
          frequencyName: `${prefix}healthBeautyFrequency`,
          labelText: t(
            'essentialOutgoings.householdExpenses.healthBeauty.labelText',
          ),
          moreInfo: t(
            'essentialOutgoings.householdExpenses.healthBeauty.moreInfo',
          ),
        },
        {
          index: 2,
          moneyInputName: `${prefix}medication`,
          frequencyName: `${prefix}medicationFrequency`,
          labelText: t(
            'essentialOutgoings.householdExpenses.medication.labelText',
          ),
          moreInfo: t(
            'essentialOutgoings.householdExpenses.medication.moreInfo',
          ),
        },
        {
          index: 3,
          moneyInputName: `${prefix}petEssentials`,
          frequencyName: `${prefix}petEssentialsFrequency`,
          labelText: t(
            'essentialOutgoings.householdExpenses.petEssentials.labelText',
          ),
          moreInfo: t(
            'essentialOutgoings.householdExpenses.petEssentials.moreInfo',
          ),
        },
        {
          index: 4,
          moneyInputName: `${prefix}clothesShoes`,
          frequencyName: `${prefix}clothesShoesFrequency`,
          labelText: t(
            'essentialOutgoings.householdExpenses.clothesShoes.labelText',
          ),
          moreInfo: t(
            'essentialOutgoings.householdExpenses.clothesShoes.moreInfo',
          ),
        },
      ],
    },
    {
      sectionName: 'essentailsAdditionalItems',
      enableRemove: false,
      maxItems: 0,
      items: generateMultipleItems(
        Array.from({ length: 5 }, (v, i) => i + 1),
        `essentailsAdditionalItems`,
      ).map((k) => ({
        ...k,
        labelPlaceholder: t(
          'essentialOutgoings.essentailsAdditionalItems.placeholder',
        ),
      })),
    },
  ];
};
