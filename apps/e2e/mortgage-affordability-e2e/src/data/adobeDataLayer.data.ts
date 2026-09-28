import config from 'playwright.config';
import { Language } from 'src/types/analytics';

interface DataLayerOverrideOptions {
  language: Language;
}

export const adobeDataLayerEvents = {
  pageLoadReactOne: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      pageName: 'mortgage-affordability-calculator--how-much-can-you-borrow',
      pageTitle:
        language === 'cy'
          ? 'Cyfrifiannell fforddiadwyedd morgais: Faint allwch chi ei fenthyg? - Teclynnau HelpwrArian'
          : 'Mortgage Affordability Calculator: How much can you borrow? - MoneyHelper Tools',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
      categoryL1: 'Homes',
      categoryL2: 'Buying a home',
      url: `${config.use?.baseURL}/${language}/annual-income`,
    },
    tool: {
      toolName: 'Mortgage Affordability Calculator',
      toolStep: '1',
      stepName: 'How much can you borrow',
      toolCategory: '',
    },
    event: 'pageLoadReact',
  }),
  pageLoadReactTwo: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      pageName: 'mortgage-affordability-calculator--your-results',
      pageTitle:
        language === 'cy'
          ? 'Cyfrifiannell fforddiadwyedd morgais: Eich canlyniadau - Teclynnau HelpwrArian'
          : 'Mortgage Affordability Calculator: Your results - MoneyHelper Tools',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
      categoryL1: 'Homes',
      categoryL2: 'Buying a home',
      url: `${config.use?.baseURL}/${language}/results?q-annual-income=35000&q-take-home=2400&q-other-income=1200&q-second-applicant=yes&q-sec-app-annual-income=14000&q-sec-app-take-home=1000&q-sec-app-other-income=600&q-rent-mortgage=650&q-card-and-loan=45&q-child-spousal=12&q-care-school=22&q-travel=15&q-bills-insurance=35&q-groceries=41&q-leisure=28&q-holidays=25`,
    },
    tool: {
      toolName: 'Mortgage Affordability Calculator',
      toolStep: '3',
      stepName: 'Your results',
      toolCategory: '',
    },
    event: 'pageLoadReact',
  }),

  toolStart: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      pageName: 'mortgage-affordability-calculator--how-much-can-you-borrow',
      pageTitle:
        language === 'cy'
          ? 'Cyfrifiannell fforddiadwyedd morgais: Faint allwch chi ei fenthyg? - Teclynnau HelpwrArian'
          : 'Mortgage Affordability Calculator: How much can you borrow? - MoneyHelper Tools',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
      categoryL1: 'Homes',
      categoryL2: 'Buying a home',
      url: `${config.use?.baseURL}/${language}/annual-income`,
    },
    tool: {
      toolName: 'Mortgage Affordability Calculator',
      toolStep: '1',
      stepName: 'How much can you borrow',
      toolCategory: '',
    },
    event: 'toolStart',
  }),

  toolCompletionOne: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      pageName: 'mortgage-affordability-calculator--your-results',
      pageTitle:
        language === 'cy'
          ? 'Cyfrifiannell fforddiadwyedd morgais: Eich canlyniadau - Teclynnau HelpwrArian'
          : 'Mortgage Affordability Calculator: Your results - MoneyHelper Tools',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
      categoryL1: 'Homes',
      categoryL2: 'Buying a home',
      url: `${config.use?.baseURL}/${language}/results?q-annual-income=35000.00&q-take-home=2400.00&q-second-applicant=no&q-rent-mortgage=600.00&q-card-and-loan=25.00&q-child-spousal=22.00&q-care-school=11.00&q-travel=15.00&q-bills-insurance=35.00&q-groceries=41.00&q-leisure=28.00&q-holidays=25.00`,
    },
    tool: {
      toolName: 'Mortgage Affordability Calculator',
      toolStep: '3',
      stepName: 'Your results',
      toolCategory: '',
    },
    event: 'toolCompletion',
  }),

  toolCompletionTwo: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      pageName: 'mortgage-affordability-calculator--your-results',
      pageTitle:
        language === 'cy'
          ? 'Cyfrifiannell fforddiadwyedd morgais: Eich canlyniadau - Teclynnau HelpwrArian'
          : 'Mortgage Affordability Calculator: Your results - MoneyHelper Tools',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
      categoryL1: 'Homes',
      categoryL2: 'Buying a home',
      url: `${config.use?.baseURL}/${language}/results?q-annual-income=36000.00&q-take-home=2300.00&q-other-income=1100.00&q-second-applicant=yes&q-sec-app-annual-income=14000.00&q-sec-app-take-home=1000.00&q-sec-app-other-income=600.00&q-rent-mortgage=650.00&q-card-and-loan=45.00&q-child-spousal=12.00&q-care-school=22.00&q-travel=15.00&q-bills-insurance=35.00&q-groceries=41.00&q-leisure=28.00&q-holidays=25.00`,
    },
    tool: {
      toolName: 'Mortgage Affordability Calculator',
      toolStep: '3',
      stepName: 'Your results',
      toolCategory: '',
    },
    event: 'toolCompletion',
  }),

  errorMessageOne: ({}: DataLayerOverrideOptions) => ({
    eventInfo: {
      toolName: 'Mortgage Affordability Calculator',
      toolStep: '1',
      stepName: 'How much can you borrow',
      errorDetails: [
        {
          reactCompType: 'MoneyInput',
          reactCompName: 'What is your monthly take-home pay?',
          errorMessage: 'Please enter your monthly take-home pay.',
        },
      ],
    },
    event: 'errorMessage',
  }),

  errorMessageTwo: ({}: DataLayerOverrideOptions) => ({
    eventInfo: {
      toolName: 'Mortgage Affordability Calculator',
      toolStep: '1',
      stepName: 'How much can you borrow',
      errorDetails: [
        {
          reactCompType: 'MoneyInput',
          reactCompName: 'What do you earn each year before tax?',
          errorMessage: 'Please enter your annual income or salary before tax.',
        },
      ],
    },
    event: 'errorMessage',
  }),

  errorMessageThree: ({}: DataLayerOverrideOptions) => ({
    eventInfo: {
      toolName: 'Mortgage Affordability Calculator',
      toolStep: '1',
      stepName: 'How much can you borrow',
      errorDetails: [
        {
          reactCompType: 'MoneyInput',
          reactCompName: 'What do they earn each year before tax?',
          errorMessage:
            "Please enter the second applicant's annual income or salary before tax.",
        },
      ],
    },
    event: 'errorMessage',
  }),

  errorMessageFour: ({}: DataLayerOverrideOptions) => ({
    eventInfo: {
      toolName: 'Mortgage Affordability Calculator',
      toolStep: '1',
      stepName: 'How much can you borrow',
      errorDetails: [
        {
          reactCompType: 'MoneyInput',
          reactCompName: 'What is their monthly take-home pay?',
          errorMessage:
            "Please enter the secondary applicant's monthly take-home pay.",
        },
      ],
    },
    event: 'errorMessage',
  }),
};

export function updateLanguage(event: unknown) {
  return event;
}

export function updateUrl(event: unknown) {
  return event;
}
