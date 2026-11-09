type TranslationValue = Record<
  string,
  string | number | boolean | string[] | TranslationValue[]
>;

export const mockTranslationDataEn: TranslationValue = {
  pageTitle: 'Mortgage calculator',

  'errorSummary.title': 'There is a problem',
  'errorSummary.price': 'Enter a property price, for example £200,000',
  'errorSummary.rate': 'Enter an interest rate, for example 5%',

  title: 'Calculate your monthly mortgage payment',
  backLink: 'Back',
  callout:
    'Remember to plan for other costs like mortgage fees, legal fees and Stamp Duty tax.',

  'form.optional': '(Optional)',
  'form.typeOfMortgage.label': 'Type of mortgage',
  'form.typeOfMortgage.option1':
    '**Repayment:** repay capital and interest together.',
  'form.typeOfMortgage.option2':
    '**Interest-only:** repay the interest. Capital paid off at end of term.',
  'form.propertyPrice.label': 'Property price',
  'form.propertyPrice.description':
    "If you're not buying a property, enter the amount left on your mortgage.",
  'form.propertyPrice.aria.label': 'Property price in pounds',

  'form.deposit.label': 'Deposit ',
  'form.deposit.description': "If you're remortgaging, this does not apply.",
  'form.deposit.aria.label': 'Deposit in pounds',

  'form.term.label': 'Mortgage term',
  'form.term.description':
    'The average period for repayment of a mortgage is 25 years.',
  'form.term.aria.description':
    'The average period for repayment of a mortgage is 25 years.',

  'form.interestRate.label': 'Interest rate',
  'form.interestRate.description':
    "We've defaulted to the current interest rate.",
  'form.interestRate.aria.description': 'Interest rate %',

  'form.calculate': 'Calculate',
  'form.recalculate': 'Recalculate',

  'socialShareTool.title': 'Share this tool',
  'socialShareTool.subject': 'Mortgage calculator - See your monthly payments',
  'socialShareTool.xTitle': 'Mortgage calculator - See your monthly payments',

  'otherTools.title': 'Other tools to try',
  'otherTools.card1.title': 'Calculate the mortgage you can afford',
  'otherTools.card1.description':
    'This tool can help you estimate how much you can afford to borrow to buy a home.',
  'otherTools.card2.title': 'Calculate your Stamp Duty',
  'otherTools.card2.description':
    'Find out with this tool what tax may be due when buying your home.',

  'recommendedReading.title': 'Recommended reading',
  'recommendedReading.sections': [
    {
      id: 'repayQuicker',
      condition: 'interestonly',
      title: 'Repay your mortgage quicker',
      links: [
        {
          prefix: 'Explore',
          text: 'ways of repaying an interest-only mortgage',
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/ways-of-repaying-an-interest-only-mortgage',
        },
      ],
    },
    {
      id: 'firstTimeBuyers',
      title: 'First-time buyers',
      links: [
        {
          prefix: 'Read our',
          text: 'first-time home buyer guide',
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/first-time-buyer-money-tips',
        },
        {
          prefix: 'How to',
          text: 'save money for a mortgage deposit',
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/saving-money-for-a-mortgage-deposit',
        },
      ],
    },
    {
      id: 'mortgageEssentials',
      title: 'Mortgage essentials',
      links: [
        {
          prefix: 'What are they and',
          text: 'should you use a mortgage adviser?',
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/choosing-a-mortgage-shop-around-or-get-advice',
        },
        {
          prefix: 'Help',
          text: 'understanding mortgage interest rates',
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-interest-rate-options',
        },
        {
          prefix: 'Get the right deal with our',
          text: 'mortgage comparison checklist',
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/your-mortgage-comparison-checklist',
        },
      ],
    },
    {
      id: 'budgetPlanning',
      title: 'Budget planning',
      links: [
        {
          prefix: 'Budget for',
          text: 'the cost of buying a house and moving',
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs',
        },
        {
          prefix: 'Learn',
          text: 'how to prepare for an interest rate rise',
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/how-to-prepare-for-an-interest-rate-rise',
        },
      ],
    },
    {
      id: 'strugglingToPay',
      title: 'Struggling to pay?',
      links: [
        {
          prefix: "Advice if you're facing",
          text: 'mortgage arrears or problems paying your mortgage',
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-arrears-if-you-have-problems-paying-your-mortgage',
        },
        {
          prefix: 'Support and',
          text: "Government help if you can't pay your mortgage",
          href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/government-help-if-you-cant-pay-your-mortgage',
        },
      ],
    },
  ],

  'results.title': 'Your results',
  'results.intro': 'To adjust the results, edit your answers.',
  'results.monthlyRepayment': 'Your monthly payment will be:',
  'results.totalRepayment': "Total you'll repay over the term:",
  'results.makeup.title': 'made up of:',
  'results.makeup.capital': 'capital, and',
  'results.makeup.interest': 'interest',
  'results.breakdown.title': 'See breakdown of costs',
  'results.breakdown.column1.heading': 'Year',
  'results.breakdown.column1.data': 'Year {year}',
  'results.breakdown.column2.heading': 'Remaining Debt',

  'notificationBox.title': 'Make sure you can afford it!',
  'notificationBox.description':
    'For example, if your interest rate goes up by 3%, your payment will be:',
};
