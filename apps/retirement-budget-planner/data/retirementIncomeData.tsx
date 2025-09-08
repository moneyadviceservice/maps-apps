import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  PageContentType,
  RetirementIncomeFieldTypes,
} from 'lib/types/page.type';
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
        sectionDescription: (
          <>
            {t('income.statePension.description')}
            <Link href={t('income.statePension.link.url')}>
              {t('income.statePension.link.text')}
            </Link>
          </>
        ),
      },
      {
        sectionName: `${partnerSuffix}definedBenefit`,
        sectionTitle: t('income.definedBenefit.title'),
        addButtonLabel: t('income.definedBenefit.buttonLabel'),
        sectionDescription: <>{t('income.definedBenefit.description')}</>,
      },
      {
        sectionName: `${partnerSuffix}contributionIncome`,
        sectionTitle: t('income.definedContributionIncome.title'),
        addButtonLabel: t('income.definedContributionIncome.buttonLabel'),
        sectionDescription: (
          <>{t('income.definedContributionIncome.description')}</>
        ),
      },
      {
        sectionName: `${partnerSuffix}incomeAdditionalItems`,
        sectionTitle: t('income.additionalItems.title'),
      },
    ],
  };
};

export const fieldNames = (prefix: string): RetirementIncomeFieldTypes[] => [
  {
    sectionName: `${prefix}statePension`,
    enableRemove: false,
    maxItems: 0,
    items: [
      {
        index: 0,
        inputLabelName: '',
        moneyInputName: `${prefix}statePension`,
        frequencyName: `${prefix}statePensionFrequency`,
      },
    ],
  },
  {
    sectionName: `${prefix}definedBenefit`,
    enableRemove: true,
    maxItems: 5,
    items: [
      {
        index: 0,
        inputLabelName: `${prefix}definedBenefitLabel`,
        moneyInputName: `${prefix}definedBenefit`,
        frequencyName: `${prefix}definedBenefitFrequency`,
      },
    ],
  },
  {
    sectionName: `${prefix}contributionIncome`,
    enableRemove: true,
    maxItems: 5,
    items: [
      {
        index: 0,
        inputLabelName: `${prefix}contributionIncomeLabel`,
        moneyInputName: `${prefix}contributionIncome`,
        frequencyName: `${prefix}contributionIncomeFrequency`,
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

/**
 * Create content for one or two partners for retirement income
 * @param t
 * @param partners
 * @returns
 */
export const retirementIncomeContent = (
  t: ReturnType<typeof useTranslation>['t'],
  partners: string[],
) =>
  Object.keys(partners).map((key, index) =>
    retirementIncomeContentPerPartner(`p${index + 1}`, t, partners[index]),
  );

/**
 * Create field objects for one or two partners for retirement income
 * @param partners
 * @returns
 */
export const RetirementIncomeGroupFields = (
  partners: string[],
): RetirementIncomeFieldTypes[] => {
  let val: RetirementIncomeFieldTypes[] = [];
  Object.keys(partners).forEach((key, index) => {
    val = val.concat(fieldNames(`p${index + 1}`));
  });
  return val;
};
