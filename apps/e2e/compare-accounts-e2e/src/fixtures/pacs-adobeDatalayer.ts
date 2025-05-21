import '@maps-react/utils/e2e/support/commands';

export const adobeDatalayer = (locale: string) => {
  return {
    // 01. Select 20 for View per page with Sort results by Random
    '?accountsPerPage=20&p=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Banking and payments',
        pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
        pageTitle: {
          en: 'Compare bank accounts - MoneyHelper Tools',
          cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
        }[locale],
        site: 'partner',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Compare bank accounts',
        toolCategory: '',
        toolName: 'Compare Bank Accounts',
        toolStep: '1',
      },
    },

    // 02.Apply Filter for Account Type with Select 5 for View per page
    '?q=&standardcurrent=on&feefreebasicbank=on&student=on&premier=on&accountsPerPage=5&order=random':
      {
        page: {
          categoryL1: 'Everyday money',
          categoryL2: 'Banking and payments',
          pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
          pageTitle: {
            en: 'Compare bank accounts - MoneyHelper Tools',
            cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
          }[locale],
          site: 'partner',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Compare bank accounts',
          toolCategory: '',
          toolName: 'Compare Bank Accounts',
          toolStep: '1',
        },
      },

    // 03. Apply Filter for Account features Select 10 for View per page
    '?q=&chequebookavailable=on&nomonthlyfee=on&opentonewcustomers=on&overdraftfacilities=on&sevendayswitching=on&accountsPerPage=10&order=random':
      {
        page: {
          categoryL1: 'Everyday money',
          categoryL2: 'Banking and payments',
          pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
          pageTitle: {
            en: 'Compare bank accounts - MoneyHelper Tools',
            cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
          }[locale],
          site: 'partner',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Compare bank accounts',
          toolCategory: '',
          toolName: 'Compare Bank Accounts',
          toolStep: '1',
        },
      },

    // 04. Apply Filter for Account Access with Select 15 for View per page
    '?q=&branchbanking=on&internetbanking=on&mobileappbanking=on&postofficebanking=on&accountsPerPage=15&order=random':
      {
        page: {
          categoryL1: 'Everyday money',
          categoryL2: 'Banking and payments',
          pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
          pageTitle: {
            en: 'Compare bank accounts - MoneyHelper Tools',
            cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
          }[locale],
          site: 'partner',
          pageType: 'tool page',
          source: 'direct',
        },
        tool: {
          stepName: 'Compare bank accounts',
          toolCategory: '',
          toolName: 'Compare Bank Accounts',
          toolStep: '1',
        },
      },

    // 05. Sort Results by Bank name A-Z with Select 20 for View per page
    '?accountsPerPage=20&order=providerNameAZ&p=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Banking and payments',
        pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
        pageTitle: {
          en: 'Compare bank accounts - MoneyHelper Tools',
          cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
        }[locale],
        site: 'partner',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Compare bank accounts',
        toolCategory: '',
        toolName: 'Compare Bank Accounts',
        toolStep: '1',
      },
    },

    // 06. Sort Results by Bank name Z-A with Select 20 for View per page
    '?accountsPerPage=20&order=providerNameZA&p=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Banking and payments',
        pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
        pageTitle: {
          en: 'Compare bank accounts - MoneyHelper Tools',
          cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
        }[locale],
        site: 'partner',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Compare bank accounts',
        toolCategory: '',
        toolName: 'Compare Bank Accounts',
        toolStep: '1',
      },
    },

    // 07. Sort Results by Monthly account fees(lowest first) with Select 20 for View per page
    '?accountsPerPage=20&order=monthlyAccountFeeLowestFirst&p=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Banking and payments',
        pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
        pageTitle: {
          en: 'Compare bank accounts - MoneyHelper Tools',
          cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
        }[locale],
        site: 'partner',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Compare bank accounts',
        toolCategory: '',
        toolName: 'Compare Bank Accounts',
        toolStep: '1',
      },
    },

    // 08. Sort Results by Minimum monthly deposit(lowest first) with Select 20 for View per page
    '?accountsPerPage=20&order=minimumMonthlyDepositLowestFirst&p=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Banking and payments',
        pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
        pageTitle: {
          en: 'Compare bank accounts - MoneyHelper Tools',
          cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
        }[locale],
        site: 'partner',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Compare bank accounts',
        toolCategory: '',
        toolName: 'Compare Bank Accounts',
        toolStep: '1',
      },
    },

    // 09. Sort Results by Arranged overdraft rate(lowest first) with Select 10 for View per page
    '?accountsPerPage=10&order=arrangedOverdraftRateLowestFirst&p=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Banking and payments',
        pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
        pageTitle: {
          en: 'Compare bank accounts - MoneyHelper Tools',
          cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
        }[locale],
        site: 'partner',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Compare bank accounts',
        toolCategory: '',
        toolName: 'Compare Bank Accounts',
        toolStep: '1',
      },
    },

    // 10. Sort Results by Unarranged maximum monthly charge(lowest first) with Select 5 for View per page
    '?accountsPerPage=5&order=unarrangedMaximumMonthlyChargeLowestFirst&p=1': {
      page: {
        categoryL1: 'Everyday money',
        categoryL2: 'Banking and payments',
        pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
        pageTitle: {
          en: 'Compare bank accounts - MoneyHelper Tools',
          cy: 'Cymharu cyfrifon banc - Teclynnau HelpwrArian',
        }[locale],
        site: 'partner',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Compare bank accounts',
        toolCategory: '',
        toolName: 'Compare Bank Accounts',
        toolStep: '1',
      },
    },
  };
};
