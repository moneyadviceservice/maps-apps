import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';
import { DEFAULT_PREFIX } from 'lib/constants/constants';
import { FREQUNCY_KEYS } from 'lib/constants/pageConstants';
import { PageContentType, RetirementFieldTypes } from 'lib/types/page.type';

const prefix = DEFAULT_PREFIX;

const enum SECTIONS {
  PRIVATE = 'privatePensionSection',
  WORKPLACE = 'workplacePensionSection',
  STATE = 'statePensionSection',
  OTHER = 'otherRetirementSection',
}

const enum INCOME_FIELDS {
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
        sectionName: SECTIONS.PRIVATE,
        sectionTitle: t('income.privatePension.title'),
        addButtonLabel: t('income.privatePension.buttonLabel'),
        sectionDescription: <>{t('income.privatePension.description')}</>,
      },
      {
        sectionName: SECTIONS.WORKPLACE,
        sectionTitle: t('income.workplacePension.title'),
        addButtonLabel: t('income.workplacePension.buttonLabel'),
        sectionDescription: (
          <>
            {t('income.workplacePension.description.text')}{' '}
            <Link href={t('income.workplacePension.description.linkUrl')}>
              {t('income.workplacePension.description.linkText')}
            </Link>
          </>
        ),
      },
      {
        sectionName: SECTIONS.STATE,
        sectionTitle: t('income.statePension.title'),
      },
      {
        sectionName: SECTIONS.OTHER,
        sectionTitle: t('income.additionalItems.title'),
      },
    ],
  };
};

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
              defaultFrequency: FREQUNCY_KEYS.FOUR_WEEKS,
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
              defaultFrequency: FREQUNCY_KEYS.MONTH,
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
              defaultFrequency: FREQUNCY_KEYS.MONTH,
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
              defaultFrequency: FREQUNCY_KEYS.MONTH,
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
              defaultFrequency: FREQUNCY_KEYS.MONTH,
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
              defaultFrequency: FREQUNCY_KEYS.MONTH,
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
          items: [
            {
              index: 0,
              moneyInputName: `${prefix}${INCOME_FIELDS.DC}`,
              frequencyName: `${prefix}${INCOME_FIELDS.DC}Frequency`,
              defaultFrequency: FREQUNCY_KEYS.MONTH,
              enableRemove: false,

              labelText: t('income.workplacePension.definedContributionLabel'),
            },
          ],
        },
        {
          field: INCOME_FIELDS.DB,
          isDynamic: true,
          maxItems: 9,
          items: [
            {
              index: 0,
              moneyInputName: `${prefix}${INCOME_FIELDS.DB}`,
              frequencyName: `${prefix}${INCOME_FIELDS.DB}Frequency`,
              defaultFrequency: FREQUNCY_KEYS.MONTH,
              enableRemove: false,
              labelText: t('income.workplacePension.definedBenefitLabel'),
            },
          ],
        },
      ],
    },
  ];
};
