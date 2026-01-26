import useTranslation from '@maps-react/hooks/useTranslation';
import { DEFAULT_PREFIX } from 'lib/constants/constants';
import { PageContentType, RetirementFieldTypes } from 'lib/types/page.type';
import { generateMultipleItems } from 'lib/util/contentFilter/contentFilter';

export const retirementIncomeContentPerPartner = (
  t: ReturnType<typeof useTranslation>['t'],
): PageContentType => {
  return {
    step: 2,
    content: [
      {
        sectionName: `statePensionSection`,
        sectionTitle: t('income.statePension.title'),
      },
      {
        sectionName: `estimatedIncomeSection`,
        sectionTitle: t('income.estimatedIncome.title'),
        addButtonLabel: t('income.estimatedIncome.buttonLabel'),
        sectionDescription: <>{t('income.estimatedIncome.description')}</>,
      },
      {
        sectionName: `incomeAdditionalItems`,
        sectionTitle: t('income.additionalItems.title'),
      },
    ],
  };
};

export const statePensionFields = (
  t: ReturnType<typeof useTranslation>['t'],
) => {
  const prefix = DEFAULT_PREFIX;
  return {
    sectionName: `statePensionSection`,
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
  };
};

export const retirementIncomefieldNames = (): RetirementFieldTypes[] => {
  const prefix = DEFAULT_PREFIX;
  return [
    {
      sectionName: `estimatedIncomeSection`,
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
      sectionName: `incomeAdditionalItems`,
      enableRemove: false,
      maxItems: 0,
      items: generateMultipleItems(
        Array.from({ length: 5 }, (v, i) => i + 1),
        `incomeAdditionalItems`,
      ),
    },
  ];
};
