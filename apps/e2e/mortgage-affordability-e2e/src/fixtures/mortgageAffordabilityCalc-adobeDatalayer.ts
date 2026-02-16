import '@maps-react/utils/e2e/support/commands';

export const adobeDatalayer = (locale: string) => {
  return {
    // 01.pageLoadReact : Without Second Applicant
    'results?q-annual-income=35000&q-take-home=2400.00&q-second-applicant=no&q-card-and-loan=25&q-child-spousal=12&q-care-school=22&q-travel=15&q-bills-insurance=35&q-rent-mortgage=650&q-leisure=28&q-holidays=25&q-groceries=41':
      {
        page: {
          categoryL1: 'Homes',
          categoryL2: 'Buying a home',
          pageName: 'mortgage-affordability-calculator--your-results',
          pageTitle: {
            en: 'Mortgage Affordability Calculator: Your results - MoneyHelper Tools',
            cy: 'Cyfrifiannell fforddiadwyedd morgais: Eich canlyniadau - Teclynnau HelpwrArian',
          }[locale],
          site: 'partner',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Mortgage Affordability Calculator',
          toolStep: 3,
        },
      },

    // 02.pageLoadReact : With Second Applicant
    'results?q-annual-income=35000&q-take-home=2400.00&q-other-income=1200&q-second-applicant=yes&q-sec-app-annual-income=14000&q-sec-app-take-home=1000&q-sec-app-other-income=600&q-card-and-loan=45.00&q-child-spousal=12.00&q-care-school=22.00&q-travel=15.00&q-bills-insurance=35.00&q-rent-mortgage=650.00&q-leisure=28.00&q-holidays=25.00&q-groceries=41.00':
      {
        page: {
          categoryL1: 'Homes',
          categoryL2: 'Buying a home',
          pageName: 'mortgage-affordability-calculator--your-results',
          pageTitle: {
            en: 'Mortgage Affordability Calculator: Your results - MoneyHelper Tools',
            cy: 'Cyfrifiannell fforddiadwyedd morgais: Eich canlyniadau - Teclynnau HelpwrArian',
          }[locale],
          site: 'moneyhelper',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Mortgage Affordability Calculator',
          toolStep: 3,
        },
      },

    //03.Tool Start :
    'annual-income': {
      page: {
        categoryL1: 'Homes',
        categoryL2: 'Buying a home',
        pageName: 'mortgage-affordability-calculator--how-much-can-you-borrow',
        pageTitle: {
          en: 'Mortgage Affordability Calculator: How much can you borrow? - MoneyHelper Tools',
          cy: 'Cyfrifiannell fforddiadwyedd morgais: Faint allwch chi ei fenthyg? - Teclynnau HelpwrArian',
        }[locale],
        site: 'partner',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'How much can you borrow',
        toolCategory: '',
        toolName: 'Mortgage Affordability Calculator',
        toolStep: 1,
      },
    },

    //04.Tool Completion : Without Second Applicant
    'results?q-annual-income=35000&q-take-home=2400.00&q-second-applicant=no&q-card-and-loan=25.00&q-child-spousal=22&q-care-school=11&q-travel=15.00&q-bills-insurance=35.00&q-rent-mortgage=600.00&q-leisure=28.00&q-holidays=25.00&q-groceries=41.00':
      {
        page: {
          categoryL1: 'Homes',
          categoryL2: 'Buying a home',
          pageName: 'mortgage-affordability-calculator--your-results',
          pageTitle: {
            en: 'Mortgage Affordability Calculator: Your results - MoneyHelper Tools',
            cy: 'Cyfrifiannell fforddiadwyedd morgais: Eich canlyniadau - Teclynnau HelpwrArian',
          }[locale],
          site: 'partner',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Mortgage Affordability Calculator',
          toolStep: 3,
        },
      },

    //05.Tool Completion : With Second Applicant
    'results?q-annual-income=36000.00&q-take-home=2300.00&q-other-income=1100.00&q-second-applicant=yes&q-sec-app-annual-income=14000.00&q-sec-app-take-home=1000.00&q-sec-app-other-income=600.00&q-card-and-loan=45.00&q-child-spousal=12.00&q-care-school=22.00&q-travel=15.00&q-bills-insurance=35.00&q-rent-mortgage=650.00&q-leisure=28.00&q-holidays=25.00&q-groceries=41.00':
      {
        page: {
          categoryL1: 'Homes',
          categoryL2: 'Buying a home',
          pageName: 'mortgage-affordability-calculator--your-results',
          pageTitle: {
            en: '',
            cy: 'Cyfrifiannell fforddiadwyedd morgais: Eich canlyniadau - Teclynnau HelpwrArian',
          }[locale],
          site: 'partner',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Your results',
          toolCategory: '',
          toolName: 'Mortgage Affordability Calculator',
          toolStep: 3,
        },
      },

    //06.Error message : When user not entered annual income
    'annual-income?q-take-home=2%2C400.00&q-second-applicant=no&errors=%257B%2522annual-income%2522%253A%2522required%2522%257D#error-summary-heading':
      {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'Mortgage Affordability Calculator',
          toolStep: '1',
          stepName: 'How much can you borrow',
          errorDetails: [
            {
              reactCompType: 'MoneyInput',
              reactCompName: 'What is your annual income or salary before tax?',
              errorMessage: {
                en: 'Please enter your annual income or salary before tax.',
                cy: 'Please enter your annual income or salary before tax.',
              }[locale],
            },
          ],
        },
      },

    //07.Error message : When user not entered monthly take-home pay
    'annual-income?q-second-applicant=no&q-annual-income=35%2C000&errors=%257B%2522take-home%2522%253A%2522required%2522%257D#error-summary-heading':
      {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'Mortgage Affordability Calculator',
          toolStep: '1',
          stepName: 'How much can you borrow',
          errorDetails: [
            {
              reactCompType: 'MoneyInput',
              reactCompName: 'What is your monthly take-home pay?',
              errorMessage: {
                en: 'Please enter your monthly take-home pay.',
                cy: 'Please enter your monthly take-home pay.',
              }[locale],
            },
          ],
        },
      },

    //08.Error message : When user not entered Second applicant's annual income
    'annual-income?q-second-applicant=yes&q-annual-income=35%2C000.00&q-take-home=2%2C400.00&q-sec-app-take-home=1%2C000&errors=%257B%2522sec-app-annual-income%2522%253A%2522required%2522%257D#error-summary-heading':
      {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'Mortgage Affordability Calculator',
          toolStep: '1',
          stepName: 'How much can you borrow',
          errorDetails: [
            {
              reactCompType: 'MoneyInput',
              reactCompName:
                "What is the second applicant's annual income or salary before tax?",
              errorMessage: {
                en: "Please enter the second applicant's annual income or salary before tax.",
                cy: "Please enter the second applicant's annual income or salary before tax.",
              }[locale],
            },
          ],
        },
      },

    //09.Error message : When user not entered Second applicant's monthly take-home pay
    'annual-income?q-second-applicant=yes&q-annual-income=35%2C000.00&q-take-home=2%2C400.00&q-sec-app-annual-income=14%2C000&errors=%257B%2522sec-app-take-home%2522%253A%2522required%2522%257D#error-summary-heading':
      {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'Mortgage Affordability Calculator',
          toolStep: '1',
          stepName: 'How much can you borrow',
          errorDetails: [
            {
              reactCompType: 'MoneyInput',
              reactCompName:
                "What is the second applicant's monthly take-home pay?",
              errorMessage: {
                en: "Please enter the secondary applicant's monthly take-home pay.",
                cy: "Please enter the secondary applicant's monthly take-home pay.",
              }[locale],
            },
          ],
        },
      },
  };
};
