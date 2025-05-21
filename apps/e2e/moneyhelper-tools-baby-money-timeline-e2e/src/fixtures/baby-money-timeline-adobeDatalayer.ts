import { getFutureDate } from '@maps-react/utils/e2e/support/commands';

export const adobeDatalayer = (locale: string) => {
  const { day, month, year } = getFutureDate();

  return {
    // 01.pageLoadReact: Tell us your due date
    'baby-money-timeline': {
      page: {
        categoryL1: '"Family & care"',
        categoryL2: 'Becoming a parent',
        pageName: 'baby-money-timeline',
        pageTitle: {
          en: 'Baby Money Timeline: Due date - MoneyHelper Tools',
          cy: 'Llinell amser arian babi: genedigaeth disgwyliedig - Teclynnau HelpwrArian',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Due Date',
        toolCategory: '',
        toolName: 'Baby Money Timeline',
        toolStep: 1,
      },
    },

    // 02.pageLoadReact & Tool Start: Baby Money Timeline - 1 to 12 Weeks
    [`baby-money-timeline/1?day=${day}&month=${month}&year=${year}`]: {
      page: {
        categoryL1: '"Family & care"',
        categoryL2: 'Becoming a parent',
        pageName: 'baby-money-timeline--1-to-12-weeks',
        pageTitle: {
          en: 'Baby Money Timeline: 1 to 12 weeks - MoneyHelper Tools',
          cy: 'Llinell amser arian babi: 1 i 12 wythnos - Teclynnau HelpwrArian',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: '1 to 12 weeks',
        toolCategory: '',
        toolName: 'Baby Money Timeline',
        toolStep: 2,
      },
    },

    // 03.pageLoadReact: Baby Money Timeline - 13 to 27 Weeks
    [`baby-money-timeline/2?day=${day}&month=${month}&year=${year}`]: {
      page: {
        categoryL1: '"Family & care"',
        categoryL2: 'Becoming a parent',
        pageName: 'baby-money-timeline--13-to-27-weeks',
        pageTitle: {
          en: 'Baby Money Timeline: 13 to 27 weeks - MoneyHelper Tools',
          cy: 'Llinell amser arian babi: 13 i 27 wythnos - Teclynnau HelpwrArian',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: '13 to 27 weeks',
        toolCategory: '',
        toolName: 'Baby Money Timeline',
        toolStep: 2,
      },
    },

    // 04.pageLoadReact: Baby Money Timeline - 28 to 41 Weeks
    [`baby-money-timeline/3?day=${day}&month=${month}&year=${year}`]: {
      page: {
        categoryL1: '"Family & care"',
        categoryL2: 'Becoming a parent',
        pageName: 'baby-money-timeline--28-to-41-weeks',
        pageTitle: {
          en: 'Baby Money Timeline: 28 to 41 weeks - MoneyHelper Tools',
          cy: 'Llinell amser arian babi: 28 i 41 wythnos - Teclynnau HelpwrArian',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: '28 to 41 weeks',
        toolCategory: '',
        toolName: 'Baby Money Timeline',
        toolStep: 2,
      },
    },

    // 05.pageLoadReact: Baby Money Timeline - 0 to 6 Months
    [`baby-money-timeline/4?day=${day}&month=${month}&year=${year}`]: {
      page: {
        categoryL1: '"Family & care"',
        categoryL2: 'Becoming a parent',
        pageName: 'baby-money-timeline--0-to-6-months',
        pageTitle: {
          en: 'Baby Money Timeline: 0 to 6 months - MoneyHelper Tools',
          cy: 'Llinell amser arian babi: 0 i 6 mis - Teclynnau HelpwrArian',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: '0 to 6 months',
        toolCategory: '',
        toolName: 'Baby Money Timeline',
        toolStep: 2,
      },
    },

    // 06.pageLoadReact: Baby Money Timeline - 7 to 12 Months
    [`baby-money-timeline/5?day=${day}&month=${month}&year=${year}`]: {
      page: {
        categoryL1: '"Family & care"',
        categoryL2: 'Becoming a parent',
        pageName: 'baby-money-timeline--7-to-12-months',
        pageTitle: {
          en: 'Baby Money Timeline: 7 to 12 months - MoneyHelper Tools',
          cy: 'Llinell amser arian babi: 7 i 12 mis - Teclynnau HelpwrArian',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: '7 to 12 months',
        toolCategory: '',
        toolName: 'Baby Money Timeline',
        toolStep: 2,
      },
    },

    // 07.pageLoadReact & Tool Completion: Baby Money Timeline - 1 to 2 Years
    [`baby-money-timeline/6?day=${day}&month=${month}&year=${year}`]: {
      page: {
        categoryL1: '"Family & care"',
        categoryL2: 'Becoming a parent',
        pageName: 'baby-money-timeline--1-to-2-years',
        pageTitle: {
          en: 'Baby Money Timeline: 1 to 2 years - MoneyHelper Tools',
          cy: 'Llinell amser arian babi: 1 i 2 flynedd - Teclynnau HelpwrArian',
        }[locale],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: '1 to 2 years',
        toolCategory: '',
        toolName: 'Baby Money Timeline',
        toolStep: 2,
      },
    },
  };
};
