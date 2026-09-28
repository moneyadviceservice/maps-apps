import useTranslation from '@maps-react/hooks/useTranslation';
import { DEFAULT_PREFIX } from 'lib/constants/constants';
import { FREQUENCY_KEYS } from 'lib/constants/pageConstants';
import { PageContentType, RetirementFieldTypes } from 'lib/types/page.type';

export const prefix = DEFAULT_PREFIX;

const enum SECTIONS {
  PRIVATE = 'privatePensionSection',
  WORKPLACE = 'workplacePensionSection',
  STATE = 'statePensionSection',
  OTHER = 'otherRetirementSection',
}

export const enum INCOME_FIELDS {
  PERSONAL = 'privatePension',
  DC = 'definedContribution',
  DB = 'definedBenefit',
  STATE = 'statePension',
  WORK_PAY = 'workPay',
  BENEFITS = 'benefitsPay',
  HOUSEHOLD = 'householdIncome',
  OTHER = 'otherIncome',
}

export const retirementIncomeContentPerPartner = (
  t: ReturnType<typeof useTranslation>['t'],
): PageContentType => {
  return {
    step: 2,
    content: [
      {
        sectionName: SECTIONS.STATE,
        sectionTitle: t('income.statePension.title'),
        sectionDescription: t('income.statePension.description'),
      },
      {
        sectionName: SECTIONS.WORKPLACE,
        sectionTitle: t('income.workplacePension.title'),
        sectionDescription: t('income.workplacePension.description'),
        addButtonLabel: t('income.workplacePension.addButtonLabel'),
        removeButtonLabel: t('income.workplacePension.removeButtonLabel'),
      },
      {
        sectionName: SECTIONS.PRIVATE,
        sectionTitle: t('income.privatePension.title'),
        sectionDescription: t('income.privatePension.description'),
        addButtonLabel: t('income.privatePension.addButtonLabel'),
        removeButtonLabel: t('income.privatePension.removeButtonLabel'),
      },
      {
        sectionName: SECTIONS.OTHER,
        sectionTitle: t('income.additionalItems.title'),
      },
    ],
  };
};

export const incomeDefaultFrequencies = [
  {
    moneyInputName: `${prefix}${INCOME_FIELDS.STATE}`,
    defaultFrequency: FREQUENCY_KEYS.FOUR_WEEKS,
  },
  {
    moneyInputName: `${prefix}${INCOME_FIELDS.WORK_PAY}`,
    defaultFrequency: FREQUENCY_KEYS.MONTH,
  },
  {
    moneyInputName: `${prefix}${INCOME_FIELDS.BENEFITS}`,
    defaultFrequency: FREQUENCY_KEYS.MONTH,
  },
  {
    moneyInputName: `${prefix}${INCOME_FIELDS.HOUSEHOLD}`,
    defaultFrequency: FREQUENCY_KEYS.MONTH,
  },
  {
    moneyInputName: `${prefix}${INCOME_FIELDS.OTHER}`,
    defaultFrequency: FREQUENCY_KEYS.MONTH,
  },
  {
    moneyInputName: `${prefix}${INCOME_FIELDS.PERSONAL}`,
    defaultFrequency: FREQUENCY_KEYS.MONTH,
  },
  {
    moneyInputName: `${prefix}${INCOME_FIELDS.PERSONAL}`,
    defaultFrequency: FREQUENCY_KEYS.MONTH,
  },
  {
    moneyInputName: `${prefix}${INCOME_FIELDS.DB}`,
    defaultFrequency: FREQUENCY_KEYS.MONTH,
  },
];

export const staticIncomeSections = (
  t: ReturnType<typeof useTranslation>['t'],
): RetirementFieldTypes[] => {
  return [
    {
      sectionName: SECTIONS.STATE,
      fields: [
        {
          field: INCOME_FIELDS.STATE,
          isDynamic: false,
          items: [
            {
              index: 0,
              moneyInputName: `${prefix}${INCOME_FIELDS.STATE}`,
              frequencyName: `${prefix}${INCOME_FIELDS.STATE}Frequency`,
              defaultFrequency: FREQUENCY_KEYS.FOUR_WEEKS,
              labelText: t(`income.${INCOME_FIELDS.STATE}.statePay.title`),
              enableRemove: false,
            },
          ],
        },
      ],
    },
    {
      sectionName: SECTIONS.OTHER,
      fields: [
        {
          field: INCOME_FIELDS.WORK_PAY,
          isDynamic: false,
          items: [
            {
              index: 0,
              moneyInputName: `${prefix}${INCOME_FIELDS.WORK_PAY}`,
              frequencyName: `${prefix}${INCOME_FIELDS.WORK_PAY}Frequency`,
              defaultFrequency: FREQUENCY_KEYS.MONTH,
              labelText: t(
                `income.otherRetirementIncome.${INCOME_FIELDS.WORK_PAY}.title`,
              ),
              moreInfo: t(
                `income.otherRetirementIncome.${INCOME_FIELDS.WORK_PAY}.moreInfo`,
              ),
              enableRemove: false,
              infoType: 'text',
            },
          ],
        },
        {
          field: INCOME_FIELDS.BENEFITS,
          isDynamic: false,
          items: [
            {
              index: 1,
              moneyInputName: `${prefix}${INCOME_FIELDS.BENEFITS}`,
              frequencyName: `${prefix}${INCOME_FIELDS.BENEFITS}Frequency`,
              defaultFrequency: FREQUENCY_KEYS.MONTH,
              labelText: t(
                `income.otherRetirementIncome.${INCOME_FIELDS.BENEFITS}.title`,
              ),
              moreInfo: t(
                `income.otherRetirementIncome.${INCOME_FIELDS.BENEFITS}.moreInfo`,
              ),
              enableRemove: false,
              infoType: 'html',
            },
          ],
        },
        {
          field: INCOME_FIELDS.HOUSEHOLD,
          isDynamic: false,
          items: [
            {
              index: 2,
              moneyInputName: `${prefix}${INCOME_FIELDS.HOUSEHOLD}`,
              frequencyName: `${prefix}${INCOME_FIELDS.HOUSEHOLD}Frequency`,
              defaultFrequency: FREQUENCY_KEYS.MONTH,
              labelText: t(
                `income.otherRetirementIncome.${INCOME_FIELDS.HOUSEHOLD}.title`,
              ),
              moreInfo: t(
                `income.otherRetirementIncome.${INCOME_FIELDS.HOUSEHOLD}.moreInfo`,
              ),
              enableRemove: false,
            },
          ],
        },
        {
          field: INCOME_FIELDS.OTHER,
          isDynamic: false,
          items: [
            {
              index: 3,
              moneyInputName: `${prefix}${INCOME_FIELDS.OTHER}`,
              frequencyName: `${prefix}${INCOME_FIELDS.OTHER}Frequency`,
              defaultFrequency: FREQUENCY_KEYS.MONTH,
              labelText: t(
                `income.otherRetirementIncome.${INCOME_FIELDS.OTHER}.title`,
              ),
              moreInfo: t(
                `income.otherRetirementIncome.${INCOME_FIELDS.OTHER}.moreInfo`,
              ),
              enableRemove: false,
              infoType: 'text',
            },
          ],
        },
      ],
    },
  ];
};

export const retirementIncomefieldNames = (
  t: ReturnType<typeof useTranslation>['t'],
): RetirementFieldTypes[] => {
  return [
    {
      sectionName: SECTIONS.PRIVATE,
      fields: [
        {
          field: INCOME_FIELDS.PERSONAL,
          isDynamic: true,
          items: [
            {
              index: 0,
              moneyInputName: `${prefix}${INCOME_FIELDS.PERSONAL}`,
              frequencyName: `${prefix}${INCOME_FIELDS.PERSONAL}Frequency`,
              defaultFrequency: FREQUENCY_KEYS.MONTH,
              enableRemove: false,

              labelText: t('income.privatePension.label'),
            },
          ],
          maxItems: 9,
        },
      ],
    },
    {
      sectionName: SECTIONS.WORKPLACE,
      fields: [
        {
          field: INCOME_FIELDS.DC,
          isDynamic: true,
          maxItems: 9,
          title: t('income.workplacePension.definedContribution.title'),
          description: t(
            'income.workplacePension.definedContribution.description',
          ),
          items: [
            {
              index: 0,
              moneyInputName: `${prefix}${INCOME_FIELDS.DC}`,
              frequencyName: `${prefix}${INCOME_FIELDS.DC}Frequency`,
              defaultFrequency: FREQUENCY_KEYS.MONTH,
              enableRemove: false,

              labelText: t('income.workplacePension.definedContributionLabel'),
            },
          ],
        },
        {
          field: INCOME_FIELDS.DB,
          isDynamic: true,
          maxItems: 9,
          title: t('income.workplacePension.definedBenefit.title'),
          description: t('income.workplacePension.definedBenefit.description'),
          items: [
            {
              index: 0,
              moneyInputName: `${prefix}${INCOME_FIELDS.DB}`,
              frequencyName: `${prefix}${INCOME_FIELDS.DB}Frequency`,
              defaultFrequency: FREQUENCY_KEYS.MONTH,
              enableRemove: false,
              labelText: t('income.workplacePension.definedBenefitLabel'),
            },
          ],
        },
      ],
    },
  ];
};
