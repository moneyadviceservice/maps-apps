import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';
import { PageContentType, RetirementFieldTypes } from 'lib/types/page.type';
import { generateMultipleItems } from 'lib/util/contentFilter/contentFilter';

export const retirementIncomeContentPerPartner = (
  partnerSuffix: string,
  t: ReturnType<typeof useTranslation>['t'],
  name: string,
): PageContentType => {
  return {
    step: 2,
    partnerName: name,
    content: [
      {
        sectionName: `${partnerSuffix}statePension`,
        sectionTitle: t('income.statePension.title'),
      },
      {
        sectionName: `${partnerSuffix}estimatedIncome`,
        sectionTitle: t('income.estimatedIncome.title'),
        addButtonLabel: t('income.estimatedIncome.buttonLabel'),
        sectionDescription: <>{t('income.estimatedIncome.description')}</>,
      },
      {
        sectionName: `${partnerSuffix}incomeAdditionalItems`,
        sectionTitle: t('income.additionalItems.title'),
      },
    ],
  };
};

export const statePensionFields = (
  prefix: string,
  t: ReturnType<typeof useTranslation>['t'],
) => [
  {
    sectionName: `${prefix}statePension`,
    enableRemove: false,
    maxItems: 0,
    items: [
      {
        index: 0,
        moneyInputName: `${prefix}netIncome`,
        frequencyName: `${prefix}netIncomeFrequency`,
        labelText: t('income.statePension.netIncome.title'),
        moreInfo: t('income.statePension.netIncome.moreInfo'),
      },
      {
        index: 0,
        moneyInputName: `${prefix}stateBenefits`,
        frequencyName: `${prefix}stateBenefitsFrequency`,
        labelText: t('income.statePension.stateBenefits.title'),
        moreInfo: t('income.statePension.stateBenefits.moreInfo'),
      },
      {
        index: 0,
        moneyInputName: `${prefix}statePension`,
        frequencyName: `${prefix}statePensionFrequency`,
        labelText: t('income.statePension.statePension.title'),
        moreInfo: t('income.statePension.statePension.moreInfo'),
      },
    ],
  },
];

export const retirementIncomefieldNames = (
  prefix: string,
): RetirementFieldTypes[] => [
  {
    sectionName: `${prefix}estimatedIncome`,
    enableRemove: true,
    maxItems: 9,
    items: [
      {
        index: 0,
        inputLabelName: `${prefix}estimatedIncomeLabel`,
        moneyInputName: `${prefix}estimatedIncome`,
        frequencyName: `${prefix}estimatedIncomeFrequency`,
      },
    ],
  },
  {
    sectionName: `${prefix}incomeAdditionalItems`,
    enableRemove: false,
    maxItems: 0,
    items: generateMultipleItems(
      Array.from({ length: 5 }, (v, i) => i + 1),
      `${prefix}incomeAdditionalItems`,
    ),
  },
];
