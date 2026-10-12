import { Language } from '../types/analytics';

interface DataLayerOverrideOptions {
  language: Language;
}

export const adobeDataLayerEvents = {
  pageLoadReactOne: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      categoryL1: 'Savings',
      categoryL2: 'How to save',
      pageName: 'savings-calculator-how-long--results',
      pageTitle:
        language === 'cy'
          ? "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol"
          : 'Savings Calculator - Work out your monthly savings and interest payments',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
    },
    tool: {
      stepName: 'Your results',
      toolCategory: '',
      toolName: 'Savings Calculator - How Long',
      toolStep: '2',
    },
    event: 'pageLoadReact',
  }),

  pageLoadReactTwo: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      categoryL1: 'Savings',
      categoryL2: 'How to save',
      pageName: 'savings-calculator-how-long--results',
      pageTitle:
        language === 'cy'
          ? "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol"
          : 'Savings Calculator - Work out your monthly savings and interest payments',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
    },
    tool: {
      stepName: 'Your results',
      toolCategory: '',
      toolName: 'Savings Calculator - How Long',
      toolStep: '2',
    },
    event: 'pageLoadReact',
  }),

  pageLoadReactThree: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      categoryL1: 'Savings',
      categoryL2: 'How to save',
      pageName: 'savings-calculator-how-much--results',
      pageTitle:
        language === 'cy'
          ? "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol"
          : 'Savings Calculator - Work out your monthly savings and interest payments',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
    },
    tool: {
      stepName: 'Your results',
      toolCategory: '',
      toolName: 'Savings Calculator - How Much',
      toolStep: '2',
    },
    event: 'pageLoadReact',
  }),

  pageLoadReactFour: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      categoryL1: 'Savings',
      categoryL2: 'How to save',
      pageName: 'savings-calculator-how-much--results',
      pageTitle:
        language === 'cy'
          ? "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol"
          : 'Savings Calculator - Work out your monthly savings and interest payments',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
    },
    tool: {
      stepName: 'Your results',
      toolCategory: '',
      toolName: 'Savings Calculator - How Much',
      toolStep: '2',
    },
    event: 'pageLoadReact',
  }),

  toolStartOne: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      categoryL1: 'Savings',
      categoryL2: 'How to save',
      pageName: 'savings-calculator-how-long',
      pageTitle:
        language === 'cy'
          ? "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol"
          : 'Savings Calculator - Work out your monthly savings and interest payments',
      lang: language,
      source: 'direct',
      pageType: 'tool page',
      site: 'moneyhelper',
    },
    tool: {
      stepName: 'Calculate',
      toolCategory: '',
      toolName: 'Savings Calculator - How Long',
      toolStep: '1',
    },
    event: 'toolStart',
  }),

  toolStartTwo: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      categoryL1: 'Savings',
      categoryL2: 'How to save',
      pageName: 'savings-calculator-how-much',
      pageTitle:
        language === 'cy'
          ? "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol"
          : 'Savings Calculator - Work out your monthly savings and interest payments',
      lang: language,
      source: 'direct',
      pageType: 'tool page',
      site: 'moneyhelper',
    },
    tool: {
      stepName: 'Calculate',
      toolCategory: '',
      toolName: 'Savings Calculator - How Much',
      toolStep: '1',
    },
    event: 'toolStart',
  }),

  toolCompletionOne: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      categoryL1: 'Savings',
      categoryL2: 'How to save',
      pageName: 'savings-calculator-how-long--results',
      pageTitle:
        language === 'cy'
          ? "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol"
          : 'Savings Calculator - Work out your monthly savings and interest payments',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
    },
    tool: {
      stepName: 'Your results',
      toolCategory: '',
      toolName: 'Savings Calculator - How Long',
      toolStep: '2',
    },
    event: 'toolCompletion',
  }),

  toolCompletionTwo: ({ language }: DataLayerOverrideOptions) => ({
    page: {
      categoryL1: 'Savings',
      categoryL2: 'How to save',
      pageName: 'savings-calculator-how-much--results',
      pageTitle:
        language === 'cy'
          ? "Cyfrifiannell Cynilo - Cyfrifwch eich cynilion a'ch taliadau llog misol - Y Gwasanaeth Cynghori Ariannol"
          : 'Savings Calculator - Work out your monthly savings and interest payments',
      lang: language,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
    },
    tool: {
      stepName: 'Your results',
      toolCategory: '',
      toolName: 'Savings Calculator - How Much',
      toolStep: '2',
    },
    event: 'toolCompletion',
  }),

  errorMessageOne: ({}: DataLayerOverrideOptions) => ({
    eventInfo: {
      toolName: 'Savings Calculator - How Long',
      toolStep: '1',
      stepName: 'Calculate',
      errorDetails: [
        {
          reactCompType: 'MoneyInput',
          reactCompName: 'How much can you save?',
          errorMessage: 'The amount you save can’t be blank',
        },
      ],
    },
    event: 'errorMessage',
  }),

  errorMessageTwo: ({}: DataLayerOverrideOptions) => ({
    eventInfo: {
      toolName: 'Savings Calculator - How Much',
      toolStep: '1',
      stepName: 'Calculate',
      errorDetails: [
        {
          reactCompType: 'MoneyInput',
          reactCompName: 'What is your savings goal?',
          errorMessage: 'Your savings goal can’t be blank',
        },
      ],
    },
    event: 'errorMessage',
  }),
};
