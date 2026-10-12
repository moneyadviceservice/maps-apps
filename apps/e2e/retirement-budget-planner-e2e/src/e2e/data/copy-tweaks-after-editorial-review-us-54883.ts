export const copyTweaksAfterEditorialReview = {
  languageLinks: {
    welsh: 'Cymraeg',
  },
  income: {
    intro: {
      en: 'Enter all the income you plan to have after you retire, before tax. As you won’t know any future increases, use today’s values. If you’re not sure on an amount, use your best or latest estimate.',
      cy: 'Rhowch yr holl incwm rydych yn disgwyl ei gael ar ôl i chi ymddeol, cyn treth. Gan na fyddwch yn gwybod am unrhyw gynnydd yn y dyfodol, defnyddiwch werthoedd cyfredol. Os nad ydych yn siŵr am swm, defnyddiwch eich amcangyfrif gorau neu’ch amcangyfrif diweddaraf.',
    },
    statePensionPayments: {
      en: 'State Pension payments',
      cy: 'Taliadau Pensiwn y Wladwriaeth',
    },
    payFromWork: {
      legend: {
        en: 'Pay from work (before tax)',
        cy: 'Tâl o’r gwaith (ar ôl treth)',
      },
      moreInformation: {
        en: 'If you’re looking to phase your retirement, this is the income you plan to get from an employer or self-employment. If you’re self-employed, enter your expected trading profits (your business income minus your expenses).',
        cy: 'Os ydych yn bwriadu ymddeol yn raddol, dyma’r incwm rydych yn disgwyl ei gael gan gyflogwr neu gan hunangyflogaeth. Os ydych yn hunangyflogedig, rhowch eich elw masnachu disgwyliedig (incwm eich busnes llai eich treuliau).',
      },
      moreInformationLink: {
        en: 'More information',
        cy: 'Mwy o wybodaeth',
      },
    },
  },
  costs: {
    rentOrCareHomeFees: {
      en: 'Rent or care home fees',
      cy: 'Rhent neu ffioedd cartref gofal',
    },
    otherEssentialOutgoings: {
      title: {
        en: 'Other essential outgoings',
        cy: 'Taliadau hanfodol eraill',
      },
      intro: {
        en: 'If you expect to have any other essential costs after you retire, you can enter them here.',
        cy: "Os ydych chi'n disgwyl cael unrhyw gostau hanfodol eraill ar ôl i chi ymddeol, gallwch eu nodi yma.",
      },
      fieldTitles: {
        en: [
          'Essential cost 1',
          'Essential cost 2',
          'Essential cost 3',
          'Essential cost 4',
          'Essential cost 5',
        ],
        cy: [
          'Cost hanfodol 1',
          'Cost hanfodol 2',
          'Cost hanfodol 3',
          'Cost hanfodol 4',
          'Cost hanfodol 5',
        ],
      },
    },
  },
  results: {
    checklistTitle: 'Check for ways to boost your retirement income',
    checklistItems: [
      'paying more into your pension – your employer might also match your contributions',
      'checking you’re getting all the tax relief you’re eligible for',
      'making sure you’re on track for the maximum State Pension',
      'delaying your retirement date.',
    ],
  },
} as const;
