type TranslationValue = Record<
  string,
  string | number | boolean | string[] | TranslationValue[]
>;

export const mockTranslationDataEn: TranslationValue = {
  'common.income': 'Income',
  'common.spending': 'Spending',
  'common.total-labels.positive': 'Spare cash',
  'common.total-labels.neutral': 'Balance',
  'common.total-labels.negative': 'Overspend',

  'components.summary-total.progress': 'Your progress',
  'components.summary-total.total': 'Summary total',
  'components.summary-total.monthly': '(monthly)',
  'components.summary-total.amount': 'Amount',

  'components.reset-calculator.title': 'Reset the calculator',
  'components.reset-calculator.description':
    'Are you sure you want to clear your budget information?',
  'components.reset-calculator.confirm': 'Confirm',
  'components.reset-calculator.cancel': 'Cancel',
};
