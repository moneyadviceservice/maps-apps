import '@maps-react/utils/e2e/support/commands';

export const adobeDatalayer = (locale: string) => {
  return {
    // 01.pageLoadReact : Calculate & Recalculate for How long where Saving Goal = 10K, duration=12months, ROI=5.5%
    'how-long?isEmbed=false&savingGoal=5%2C000&amount=300&amountDuration=12&saved=10%2C001&interest=5.5#results':
      {
        page: {
          categoryL1: 'Savings',
          categoryL2: 'How to save',
          pageName: 'savings-calculator-how-long--results',
          pageTitle: {
            en: 'Savings Calculator - Work out your monthly savings and interest payments',
            cy: "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol",
          }[locale],
          site: 'moneyhelper',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Savings Calculator - How Long',
          toolStep: 2,
        },
      },

    // 02.pageLoadReact : Calculate & Recalculate for How long where Saving Goal = 25K, ROI=6.25%
    'how-long?isEmbed=false&savingGoal=25%2C000&amount=2%2C000&amountDuration=12&saved=1%2C000&interest=6.25#results':
      {
        page: {
          categoryL1: 'Savings',
          categoryL2: 'How to save',
          pageName: 'savings-calculator-how-long--results',
          pageTitle: {
            en: 'Savings Calculator - Work out your monthly savings and interest payments',
            cy: "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol",
          }[locale],
          site: 'moneyhelper',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Savings Calculator - How Long',
          toolStep: 2,
        },
      },

    // 03.pageLoadReact : Calculate & Recalculate for How much where Saving Goal = 10K & ROI=5.5%
    'how-much?isEmbed=false&savingGoal=10%2C000&durationMonth=7&durationYear=2025&saved=&interest=5.5#results':
      {
        page: {
          categoryL1: 'Savings',
          categoryL2: 'How to save',
          pageName: 'savings-calculator-how-much--results',
          pageTitle: {
            en: 'Savings Calculator - Work out your monthly savings and interest payments',
            cy: '',
          }[locale],
          site: 'moneyhelper',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Savings Calculator - How Long',
          toolStep: 2,
        },
      },

    // 04.pageLoadReact : Calculate & Recalculate for How much where Saving Goal = 25K & ROI=6.25%
    'how-much?isEmbed=false&savingGoal=25%2C000&durationMonth=7&durationYear=2025&saved=&interest=6.25#results':
      {
        page: {
          categoryL1: 'Savings',
          categoryL2: 'How to save',
          pageName: 'savings-calculator-how-much--results',
          pageTitle: {
            en: 'Savings Calculator - Work out your monthly savings and interest payments',
            cy: '',
          }[locale],
          site: 'moneyhelper',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Savings Calculator - How Long',
          toolStep: 2,
        },
      },

    //05.Error message - For How long
    'how-long?isEmbed=false&savingGoal=5%2C000&amount=&amountDuration=12&saved=10%2C001&interest=7.5#results':
      {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'Savings Calculator - How Long',
          toolStep: '1',
          stepName: 'Calculate',
          errorDetails: [
            {
              reactCompType: 'MoneyInput',
              reactCompName: 'How much can you save?',
              errorMessage: {
                en: 'The amount you save can’t be blank',
                cy: 'The amount you save can’t be blank',
              }[locale],
            },
          ],
        },
      },

    //06.Error message - For How much
    'how-much?isEmbed=false&savingGoal=&durationMonth=6&durationYear=2025&saved=2%2C600&interest=5.5#results':
      {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'Savings Calculator - How Much',
          toolStep: '1',
          stepName: 'Calculate',
          errorDetails: [
            {
              reactCompType: 'MoneyInput',
              reactCompName: 'What is your savings goal?',
              errorMessage: {
                en: 'Your savings goal can’t be blank',
                cy: 'Your savings goal can’t be blank',
              }[locale],
            },
          ],
        },
      },

    //07.Tool Start - For How long
    'how-long': {
      page: {
        categoryL1: 'Savings',
        categoryL2: 'How to save',
        pageName: 'savings-calculator-how-long',
        pageTitle: {
          en: 'Savings Calculator - Work out your monthly savings and interest payments',
          cy: "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol",
        }[locale],
        source: 'direct',
        pageType: 'tool page',
        site: 'moneyhelper',
      },
      tool: {
        stepName: 'Calculate',
        toolCategory: '',
        toolName: 'Savings Calculator - How Long',
        toolStep: 1,
      },
    },

    //08.Tool Start - For How much
    'how-much': {
      page: {
        categoryL1: 'Savings',
        categoryL2: 'How to save',
        pageName: 'savings-calculator-how-much',
        pageTitle: {
          en: 'Savings Calculator - Work out your monthly savings and interest payments',
          cy: "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol",
        }[locale],
        source: 'direct',
        pageType: 'tool page',
        site: 'moneyhelper',
      },
      tool: {
        stepName: 'Calculate',
        toolCategory: '',
        toolName: 'Savings Calculator - How Much',
        toolStep: 1,
      },
    },

    //09.Tool Completion - For How long
    'how-long?isEmbed=false&savingGoal=5%2C000&amount=400&amountDuration=12&saved=10%2C001&interest=4.5#results':
      {
        page: {
          categoryL1: 'Savings',
          categoryL2: 'How to save',
          pageName: 'savings-calculator-how-long--results',
          pageTitle: {
            en: 'Savings Calculator - Work out your monthly savings and interest payments',
            cy: "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol",
          }[locale],
          site: 'moneyhelper',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Savings Calculator - How Long',
          toolStep: 2,
        },
      },

    //10.Tool Completion - For How much
    'how-much?isEmbed=false&savingGoal=5%2C000&amount=400&amountDuration=12&saved=10%2C001&interest=3.5#results':
      {
        page: {
          categoryL1: 'Savings',
          categoryL2: 'How to save',
          pageName: 'savings-calculator-how-much--results',
          pageTitle: {
            en: 'Savings Calculator - Work out your monthly savings and interest payments',
            cy: "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol",
          }[locale],
          site: 'moneyhelper',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Savings Calculator - How Much',
          toolStep: 2,
        },
      },
  };
};
