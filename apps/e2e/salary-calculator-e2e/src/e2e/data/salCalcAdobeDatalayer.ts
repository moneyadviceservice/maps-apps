export type PageAnalyticsData = {
  demo?: {
    bYear: string;
    emolument: number;
    isHealth: boolean;
  };
  page: {
    categoryL1: string;
    categoryL2: string;
    pageName: string;
    pageTitle: string;
    site: string;
    pageType: string;
    source: string;
  };
  tool: {
    stepName: string;
    toolCategory: string;
    toolName: string;
    toolStep: string;
    outcome?: {
      benefit: string;
      otherSupport: string;
    };
  };
};

export const adobeDatalayer = (
  locale: 'en' | 'cy',
): Record<string, PageAnalyticsData> => ({
  // 01. Salary Calculator Page Load - Start
  '': {
    page: {
      categoryL1: 'Tools',
      categoryL2: 'Money',
      pageName: 'salary-calculator',
      pageTitle: locale === 'en' ? 'Salary calculator' : 'Cyfrifiannell cyflog',
      site: 'moneyhelper',
      pageType: 'tool page',
      source: 'direct',
    },
    tool: {
      stepName: 'Salary Calculator - start',
      toolCategory: 'simple calculator',
      toolName: 'Salary Calculator',
      toolStep: '1',
    },
  },
  // 02.Calculate for Single Salary
  '?calculationType=single&isEmbed=false&language=en&recalculated=false&salary2_grossIncome=&salary2_grossIncomeFrequency=annual&salary2_hoursPerWeek=&salary2_daysPerWeek=&salary2_taxCode=&salary2_isScottishResident=false&salary2_pensionPercent=0&salary2_pensionFixed=&salary2_plan1=false&salary2_plan2=false&salary2_plan4=false&salary2_plan5=false&salary2_planPostGrad=false&salary2_isBlindPerson=&salary2_isOverStatePensionAge=&grossIncome=35%2C000&grossIncomeFrequency=annual&taxCode=1257L&pensionPercent=5&pensionFixed=&plan4=true&plan5=true&isOverStatePensionAge=true&isBlindPerson=true&calculate=&calculationType-mobile=single#results':
    {
      demo: {
        bYear: '66+',
        emolument: 35,
        isHealth: true,
      },

      page: {
        categoryL1: 'Tools',
        categoryL2: 'Money',
        pageName: 'salary-calculator',
        pageTitle:
          locale === 'en' ? 'Salary calculator' : 'Cyfrifiannell cyflog',
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Salary Calculator Results - standard - current tax year',
        toolCategory: 'simple calculator',
        toolName: 'Salary Calculator',
        toolStep: '2',
      },
    },

  // 03. Recalculate for Single Salary
  '?calculationType=single&isEmbed=false&language=en&recalculated=true&salary2_grossIncome=&salary2_grossIncomeFrequency=annual&salary2_hoursPerWeek=&salary2_daysPerWeek=&salary2_taxCode=&salary2_isScottishResident=false&salary2_pensionPercent=&salary2_pensionFixed=0&salary2_plan1=false&salary2_plan2=false&salary2_plan4=false&salary2_plan5=false&salary2_planPostGrad=false&salary2_isBlindPerson=false&salary2_isOverStatePensionAge=false&grossIncome=32%2C000&grossIncomeFrequency=annual&taxCode=1257L&pensionPercent=5&pensionFixed=&plan4=true&isOverStatePensionAge=true&isBlindPerson=true&calculate=&calculationType-mobile=single#results':
    {
      demo: {
        bYear: '66+',
        emolument: 32,
        isHealth: true,
      },

      page: {
        categoryL1: 'Tools',
        categoryL2: 'Money',
        pageName: 'salary-calculator',
        pageTitle:
          locale === 'en' ? 'Salary calculator' : 'Cyfrifiannell cyflog',
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        outcome: {
          benefit: 'Blind person allowance',
          otherSupport: 'L',
        },
        stepName:
          'Salary Calculator Results recalculated - standard - current tax year',
        toolCategory: 'simple calculator',
        toolName: 'Salary Calculator',
        toolStep: '2.5',
      },
    },

  // 04. Calculate for Compare two Salaries
  '?calculationType=joint&isEmbed=false&language=en&recalculated=false&grossIncome=35%2C000&grossIncomeFrequency=annual&taxCode=&pensionPercent=&pensionFixed=&calculationType-mobile=joint&salary2_grossIncome=39%2C000&salary2_grossIncomeFrequency=annual&salary2_taxCode=&salary2_pensionPercent=&salary2_pensionFixed=&calculate=#results-comparison':
    {
      demo: {
        bYear: '',
        emolument: 35,
        isHealth: false,
      },

      page: {
        categoryL1: 'Tools',
        categoryL2: 'Money',
        pageName: 'salary-calculator',
        pageTitle:
          locale === 'en' ? 'Salary calculator' : 'Cyfrifiannell cyflog',
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName:
          'Salary Calculator Results - salary comparison - current tax year',
        toolCategory: 'simple calculator',
        toolName: 'Salary Calculator',
        toolStep: '2',
      },
    },

  // 05. Recalculate for Compare two Salaries
  '?calculationType=joint&isEmbed=false&language=en&recalculated=true&grossIncome=35%2C000&grossIncomeFrequency=annual&taxCode=1257L&pensionPercent=&pensionFixed=&calculationType-mobile=joint&salary2_grossIncome=39%2C000&salary2_grossIncomeFrequency=annual&salary2_taxCode=S1257L&salary2_pensionPercent=12&salary2_pensionFixed=&salary2_plan2=true&salary2_plan4=true&salary2_isOverStatePensionAge=true&salary2_isBlindPerson=true&calculate=#results-comparison':
    {
      demo: {
        bYear: '66+',
        emolument: 35,
        isHealth: true,
      },

      page: {
        categoryL1: 'Tools',
        categoryL2: 'Money',
        pageName: 'salary-calculator',
        pageTitle:
          locale === 'en' ? 'Salary calculator' : 'Cyfrifiannell cyflog',
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        outcome: {
          benefit: 'Blind person allowance',
          otherSupport: 'L',
        },
        stepName:
          'Salary Calculator Results recalculated - salary comparison - current tax year',
        toolCategory: 'simple calculator',
        toolName: 'Salary Calculator',
        toolStep: '2.5',
      },
    },
});
