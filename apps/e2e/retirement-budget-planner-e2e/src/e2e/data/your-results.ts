export const otherToolsToTry = {
  aboutYou: {
    day: '1',
    month: '1',
    year: '1980',
    retireAge: '60',
    gender: 'female',
  },
  income: {
    pensionValue: '180',
  },
  cost: {
    mortgageRepayment: '500',
  },
  expected: {
    pensionCalculator: {
      title: 'Pension calculator',
      description:
        'Find out how much you might need to save for retirement and the income you’re on track to get.',
      link: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
    },
    benefitsCalculator: {
      title: 'Benefits calculator',
      description:
        'Check if you’re entitled to any extra payments or grants, including Universal Credit and Pension Credit.',
      link: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
    },
    budgetPlanner: {
      title: 'Budget planner',
      description:
        'Keep track of your current household spending, plus tips to improve your finances.',
      link: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
    },
  },
};

export const opensInNewWindowAccessibleNameSuffix = ' (opens in a new window)';

export const otherToolsToTryAccessibleLinkName = (title: string) =>
  `${title}${opensInNewWindowAccessibleNameSuffix}`;

export const otherToolsToTryAccessibleLinkNames = [
  otherToolsToTry.expected.budgetPlanner.title,
  otherToolsToTry.expected.pensionCalculator.title,
  otherToolsToTry.expected.benefitsCalculator.title,
].map(otherToolsToTryAccessibleLinkName);

export const editButtonLinkRegex = (category: string): RegExp =>
  new RegExp(
    String.raw`/(en|cy)/essential-outgoings\?sessionId=([a-z]|\d)+&stepsEnabled=4(&language=(en|cy))?#${category}`,
    'g',
  );

export const retirementCostsVisual = {
  componentTestId: 'summary-costs-chart',
  pieChartTestId: 'summary-costs-pie-chart',
  heading: 'Retirement costs',
  editButtonLabel: 'Edit',
  inputValues: {
    income: {
      amount: '5000',
      frequency: 'month',
    },
    costs: {
      housingCost: {
        amount: '2000',
        formInputTestId: 'formmortgageRepaymentId',
        accordionTitle: 'Housing',
      },
      utilities: {
        amount: '1000',
        formInputTestId: 'formcouncilTaxId',
        accordionTitle: 'Household bills',
      },
      householdExpenses: {
        amount: '500',
        formInputTestId: 'formfoodId',
        accordionTitle: 'Living costs',
      },
      insurance: {
        amount: '200',
        formInputTestId: 'formhomeContentInsuranceId',
        accordionTitle: 'Insurance',
      },
      essentialsAdditionalItems1Label: {
        amount: 'Cost 1',
        formInputTestId: 'formessentialsAdditionalItems1Label',
        accordionTitle: 'Other essential outgoings',
      },
      essentialsAdditionalItems1LabelCost: {
        amount: '20',
        formInputTestId: 'formessentialsAdditionalItems1Id',
        accordionTitle: 'Other essential outgoings',
      },
      essentialsAdditionalItems2Label: {
        amount: 'Cost 2',
        formInputTestId: 'formessentialsAdditionalItems2Label',
        accordionTitle: 'Other essential outgoings',
      },
      essentialsAdditionalItems2LabelCost: {
        amount: '20',
        formInputTestId: 'formessentialsAdditionalItems2Id',
        accordionTitle: 'Other essential outgoings',
      },
    },
  },
  expectedOutputValues: {
    categories: {
      housingCost: {
        label: 'Housing',
        value: '£2,000.00',
        linkAnchor: 'housingCost',
      },
      utilities: {
        label: 'Household bills',
        value: '£1,000.00',
        linkAnchor: 'utilities',
      },
      householdExpenses: {
        label: 'Living costs',
        value: '£500.00',
        linkAnchor: 'householdExpenses',
      },
      insurance: {
        label: 'Insurance',
        value: '£200.00',
        linkAnchor: 'insurance',
      },
      lending: {
        label: 'Borrowing',
        value: '£0.00',
        linkAnchor: 'lending',
      },
      travelCosts: {
        label: 'Travel',
        value: '£0.00',
        linkAnchor: 'travelCosts',
      },
      essentialsAdditionalItems: {
        label: 'Other essential outgoings',
        value: '£40.00',
        linkAnchor: 'essentialsAdditionalItems',
      },
    },
    pieChartStyle:
      'background: conic-gradient(rgb(0, 120, 143) 0%, rgb(0, 120, 143) 53.4759%, rgb(230, 112, 50) 53.4759%, rgb(230, 112, 50) 80.2139%, rgb(174, 0, 96) 80.2139%, rgb(174, 0, 96) 93.5829%, rgb(127, 153, 47) 93.5829%, rgb(127, 153, 47) 98.9305%, rgb(0, 11, 58) 98.9305%, rgb(0, 11, 58) 98.9305%, rgb(142, 42, 158) 98.9305%, rgb(142, 42, 158) 98.9305%, rgb(217, 125, 125) 98.9305%, rgb(217, 125, 125) 100%);',
  },
} as const;

export const feedback = {
  heading: 'Was this tool useful?',
  positiveResponse: {
    buttonText: 'Yes',
    textboxLabel: 'Thanks. Is there anything else you would like to tell us?',
  },
  negativeResponse: {
    buttonText: 'No',
    textboxLabel: 'How could this tool be improved?',
  },
  reportProblemResponse: {
    subheading:
      "Please don't include personal or financial information like your National Insurance number or credit card details",
    buttonText: 'Report a problem',
    textbox1Label: 'What were you doing?',
    textbox2Label: 'What went wrong?',
  },
  backButton: {
    text: 'Previous',
    label: 'back',
  },
  responseForm: {
    heading: 'Help us improve MoneyHelper',
    submitButtonText: 'Submit feedback',
  },
  submissionConfirmation: {
    heading: 'Thank you for your feedback',
    message:
      'We’re always trying to improve our website and services, and your feedback helps us understand how we’re doing.',
  },
  textboxHighlightStyle: 'border: 1px solid rgb(221, 221, 221) !important;',
} as const;

export const summaryTotal = {
  inputValues: {
    income: {
      amount: '5000',
      frequency: 'month',
    },
    costs: {
      amount: '2000',
      formInputTestId: 'formmortgageRepaymentId',
    },
  },
  expectedOutputValues: {
    monthly: {
      income: '£4,047.33', // 5,000 - 952.67 tax
      costs: '£2,000.00',
      balance: '£2,047.33', // 4,047.33 - 2,000
    },
    yearly: {
      income: '£48,568.00', // 60,000 - 11,432 tax (4,047.33 * 12)
      costs: '£24,000.00', // 2,000 * 12
      balance: '£24,568.00', // 48,568 - 24,000
    },
  },
  testId: 'summary-total',
  heading: 'Summary total',
  frequencySelect: {
    testId: 't-summary-options',
    monthlyValue: 'month',
    yearlyValue: 'year',
  },
  updateResultsButtonText: 'Update results',
  valueTypes: {
    income: {
      label: 'Retirement income after tax',
      valueTestId: 't-summary-value-retirement-income-after-tax',
    },
    costs: {
      label: 'Retirement costs',
      valueTestId: 't-summary-value-retirement-costs',
    },
    balance: {
      label: 'Balance',
      valueTestId: 't-summary-value-balance',
    },
  },
} as const;

export type SummaryTotalValueType = keyof typeof summaryTotal.valueTypes;

export const pageHeading = 'Your results';
