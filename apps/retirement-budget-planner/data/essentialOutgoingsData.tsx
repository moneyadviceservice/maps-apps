import useTranslation from '@maps-react/hooks/useTranslation';
import { PageContentType, RetirementFieldTypes } from 'lib/types/page.type';
import { generateMultipleItems } from 'lib/util/contentFilter/contentFilter';

export const essentialOutgoingsContent = (
  t: ReturnType<typeof useTranslation>['t'],
  name: string,
): PageContentType => {
  return {
    step: 3,
    partnerName: name,
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
        sectionName: 'personal',
        sectionTitle: t('essentialOutgoings.personal.title'),
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
): RetirementFieldTypes[] => [
  {
    sectionName: 'housingCost',
    enableRemove: false,
    maxItems: 0,
    items: [
      {
        index: 0,
        moneyInputName: 'mortgageRepayment',
        frequencyName: 'mortgageRepaymentFrequency',
        labelText: t(
          'essentialOutgoings.housingCost.mortgageRepayment.labelText',
        ),
        moreInfo: t(
          'essentialOutgoings.housingCost.mortgageRepayment.moreInfo',
        ),
      },
      {
        index: 1,
        moneyInputName: 'rent',
        frequencyName: 'rentFrequency',
        labelText: t('essentialOutgoings.housingCost.rent.labelText'),
        moreInfo: t('essentialOutgoings.housingCost.rent.moreInfo'),
      },
      {
        index: 2,
        moneyInputName: 'groundRent',
        frequencyName: 'groundRentFrequency',
        labelText: t('essentialOutgoings.housingCost.groundRent.labelText'),
        moreInfo: t('essentialOutgoings.housingCost.groundRent.moreInfo'),
      },
      {
        index: 3,
        moneyInputName: 'serviceCharge',
        frequencyName: 'serviceChargeFrequency',
        labelText: t('essentialOutgoings.housingCost.serviceCharge.labelText'),
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
        moneyInputName: 'councilTax',
        frequencyName: 'councilTaxFrequency',
        labelText: t('essentialOutgoings.utilities.councilTax.labelText'),
        moreInfo: t('essentialOutgoings.utilities.councilTax.moreInfo'),
      },
      {
        index: 1,
        moneyInputName: 'tvLicence',
        frequencyName: 'tvLicenceFrequency',
        labelText: t('essentialOutgoings.utilities.tvLicence.labelText'),
        moreInfo: t('essentialOutgoings.utilities.tvLicence.moreInfo'),
      },
      {
        index: 2,
        moneyInputName: 'heating',
        frequencyName: 'heatingFrequency',
        labelText: t('essentialOutgoings.utilities.heating.labelText'),
        moreInfo: t('essentialOutgoings.utilities.heating.moreInfo'),
      },
      {
        index: 3,
        moneyInputName: 'electric',
        frequencyName: 'electricFrequency',
        labelText: t('essentialOutgoings.utilities.electric.labelText'),
        moreInfo: t('essentialOutgoings.utilities.electric.moreInfo'),
      },
      {
        index: 4,
        moneyInputName: 'phone',
        frequencyName: 'phoneFrequency',
        labelText: t('essentialOutgoings.utilities.phone.labelText'),
        moreInfo: t('essentialOutgoings.utilities.phone.moreInfo'),
      },
      {
        index: 5,
        moneyInputName: 'water',
        frequencyName: 'waterFrequency',
        labelText: t('essentialOutgoings.utilities.water.labelText'),
        moreInfo: t('essentialOutgoings.utilities.water.moreInfo'),
      },
      {
        index: 6,
        moneyInputName: 'internet',
        frequencyName: 'internetFrequency',
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
        moneyInputName: 'publicTransport',
        frequencyName: 'publicTransportFrequency',
        labelText: t(
          'essentialOutgoings.travelCosts.publicTransport.labelText',
        ),
        moreInfo: t('essentialOutgoings.travelCosts.publicTransport.moreInfo'),
      },
      {
        index: 1,
        moneyInputName: 'sessionTickets',
        frequencyName: 'sessionTicketsFrequency',
        labelText: t('essentialOutgoings.travelCosts.sessionTickets.labelText'),
        moreInfo: t('essentialOutgoings.travelCosts.sessionTickets.moreInfo'),
      },
      {
        index: 2,
        moneyInputName: 'car',
        frequencyName: 'carFrequency',
        labelText: t('essentialOutgoings.travelCosts.car.labelText'),
        moreInfo: t('essentialOutgoings.travelCosts.car.moreInfo'),
      },
      {
        index: 3,
        moneyInputName: 'petrol',
        frequencyName: 'petrolFrequency',
        labelText: t('essentialOutgoings.travelCosts.petrol.labelText'),
        moreInfo: t('essentialOutgoings.travelCosts.petrol.moreInfo'),
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
        moneyInputName: 'loans',
        frequencyName: 'loansFrequency',
        labelText: t('essentialOutgoings.lending.loans.labelText'),
        moreInfo: t('essentialOutgoings.lending.loans.moreInfo'),
      },
      {
        index: 1,
        moneyInputName: 'buyNowPayLater',
        frequencyName: 'buyNowPayLaterFrequency',
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
        moneyInputName: 'homeContentInsurance',
        frequencyName: 'homeContentInsuranceFrequency',
        labelText: t(
          'essentialOutgoings.insurance.homeContentInsurance.labelText',
        ),
        moreInfo: t(
          'essentialOutgoings.insurance.homeContentInsurance.moreInfo',
        ),
      },
      {
        index: 1,
        moneyInputName: 'lifeFuneralInsurance',
        frequencyName: 'lifeFuneralInsuranceFrequency',
        labelText: t(
          'essentialOutgoings.insurance.lifeFuneralInsurance.labelText',
        ),
        moreInfo: t(
          'essentialOutgoings.insurance.lifeFuneralInsurance.moreInfo',
        ),
      },
      {
        index: 2,
        moneyInputName: 'petInsurance',
        frequencyName: 'petInsuranceFrequency',
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
        moneyInputName: 'food',
        frequencyName: 'foodFrequency',
        labelText: t('essentialOutgoings.householdExpenses.food.labelText'),
        moreInfo: t('essentialOutgoings.householdExpenses.food.moreInfo'),
      },
      {
        index: 1,
        moneyInputName: 'cleaning',
        frequencyName: 'cleaningFrequency',
        labelText: t('essentialOutgoings.householdExpenses.cleaning.labelText'),
        moreInfo: t('essentialOutgoings.householdExpenses.cleaning.moreInfo'),
      },
      {
        index: 1,
        moneyInputName: 'personalItems',
        frequencyName: 'personalItemsFrequency',
        labelText: t(
          'essentialOutgoings.householdExpenses.personalItems.labelText',
        ),
        moreInfo: t(
          'essentialOutgoings.householdExpenses.personalItems.moreInfo',
        ),
      },
    ],
  },
  {
    sectionName: 'personal',
    enableRemove: false,
    maxItems: 0,
    items: [
      {
        index: 0,
        moneyInputName: 'medication',
        frequencyName: 'medicationFrequency',
        labelText: t('essentialOutgoings.personal.medication.labelText'),
        moreInfo: t('essentialOutgoings.personal.medication.moreInfo'),
      },
      {
        index: 1,
        moneyInputName: 'pets',
        frequencyName: 'petsFrequency',
        labelText: t('essentialOutgoings.personal.pets.labelText'),
        moreInfo: t('essentialOutgoings.personal.pets.moreInfo'),
      },
      {
        index: 2,
        moneyInputName: 'otherPersonal',
        frequencyName: 'otherPersonalFrequency',
        labelText: t('essentialOutgoings.personal.otherPersonal.labelText'),
        moreInfo: t('essentialOutgoings.personal.otherPersonal.moreInfo'),
      },
    ],
  },
  {
    sectionName: 'essentailsAdditionalItems',
    enableRemove: false,
    maxItems: 0,
    items: generateMultipleItems(
      Array.from({ length: 5 }, (v, i) => i + 1),
      'essentailsAdditionalItems',
    ),
  },
];
