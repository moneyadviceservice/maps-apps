export type ToolEmbedType = {
  url?: string;
  embedCode?: string;
};

export type ToolsIndexType = {
  title: string;
  path: string; // Path/route for the tool (e.g., "income", "question-1", "midlife-mot/question-1")
  description: string;
  live?: boolean; // if false, the tool will not be shown on production tools-index
  productionOrigin?: string;
  stagingOrigin?: string;
  developOrigin?: string;
  details?: { en: ToolEmbedType; cy: ToolEmbedType };
};

export const monoRepoTools = [
  {
    title: 'Credit rejection',
    path: 'question-1',
    description: "Find out why you're struggling to get credit.",
    productionOrigin: 'https://credit-rejection.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--credit-rejection.netlify.app',
    developOrigin: 'https://develop--credit-rejection.netlify.app',
  },
  {
    title: 'Credit Options',
    path: 'question-1',
    description: 'Credit Options.',
    productionOrigin: 'https://credit-options.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--credit-options.netlify.app',
    developOrigin: 'https://develop--credit-options.netlify.app',
  },
  {
    title: 'Budget Planner',
    path: 'income',
    description: 'Budget Planner.',
    productionOrigin: 'https://budget-planner.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--mh-budget-planner.netlify.app',
    developOrigin: 'https://develop--mh-budget-planner.netlify.app',
  },
  {
    title: 'Stamp Duty Land Tax Calculator',
    path: 'sdlt',
    description:
      'The SDLT calculator for buying a property in England and Northern Ireland.',
    productionOrigin: 'https://stamp-duty-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--stamp-duty-calc.netlify.app',
    developOrigin: 'https://develop--stamp-duty-calc.netlify.app',
  },
  {
    title: 'Money Midlife MOT',
    path: 'midlife-mot/question-1',
    description: 'Money Midlife MOT',
    productionOrigin: 'https://midlife-mot.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--mh-midlife-mot.netlify.app',
    developOrigin: 'https://develop--mh-midlife-mot.netlify.app',
  },
  {
    title: 'Compare Accounts',
    path: '',
    description: 'The account comparison tool.',
    productionOrigin: 'https://payment-accounts-comparison.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--mh-compare-accounts.netlify.app',
    developOrigin: 'https://develop--mh-compare-accounts.netlify.app',
  },
  {
    title: 'Land Transaction Tax Calculator',
    path: 'ltt',
    description: 'The LTT calculator for buying a property in Wales.',
    productionOrigin: 'https://stamp-duty-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--stamp-duty-calc.netlify.app',
    developOrigin: 'https://develop--stamp-duty-calc.netlify.app',
  },
  {
    title: 'Land and Buildings Transaction Tax Calculator',
    path: 'lbtt',
    description: 'The LBTT calculator for buying a property in Scotland.',
    productionOrigin: 'https://stamp-duty-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--stamp-duty-calc.netlify.app',
    developOrigin: 'https://develop--stamp-duty-calc.netlify.app',
  },
  {
    title: 'Mortgage Calculator',
    path: '',
    description: 'Mortgage Calculator',
    productionOrigin: 'https://mortgage-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--mh-mortgage-calculator.netlify.app',
    developOrigin: 'https://develop--mh-mortgage-calculator.netlify.app',
  },
  {
    title: 'Debt Advice Locator',
    path: 'question-1',
    description: 'The Debt Advice Locator Calculator',
    productionOrigin: 'https://debt-advice-locator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--debt-advice-locator.netlify.app',
    developOrigin: 'https://develop--debt-advice-locator.netlify.app',
  },
  {
    title: 'Savings Calculator',
    path: '',
    description: 'Savings Calculator',
    productionOrigin: 'https://savings-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--maps-savings-calculator.netlify.app',
    developOrigin: 'https://develop--maps-savings-calculator.netlify.app',
  },
  {
    title: 'Baby Cost Calculator',
    path: '1',
    description: 'Baby Cost Calculator',
    productionOrigin: 'https://baby-cost-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--baby-cost-calculator.netlify.app',
    developOrigin: 'https://develop--baby-cost-calculator.netlify.app',
  },
  {
    title: 'Baby Money Timeline',
    path: '',
    description: '',
    productionOrigin: 'https://baby-money-timeline.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--maps-baby-money-timeline.netlify.app',
    developOrigin: 'https://develop--maps-baby-money-timeline.netlify.app',
  },
  {
    title: 'Redundancy Pay Calculator',
    path: 'question-1',
    description: 'Redundancy Pay Calculator',
    productionOrigin: 'https://redundancy-pay-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--redundancy-pay-calculator.netlify.app',
    developOrigin: 'https://develop--redundancy-pay-calculator.netlify.app',
  },
  {
    title: 'Pension Type Tool',
    path: 'pension-type/question-1',
    description: 'Pension Type Tool',
    productionOrigin: 'https://tool.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools.netlify.app',
    developOrigin: 'https://develop--moneyhelper-tools.netlify.app',
  },
  {
    title: 'Cash In Chunks',
    path: 'cash-in-chunks',
    description: 'Cash In Chunks',
    productionOrigin: 'https://cash-in-chunks.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--cash-in-chunks.netlify.app',
    developOrigin: 'https://develop--cash-in-chunks.netlify.app',
  },
  {
    title: 'Guaranteed Income Estimator',
    path: 'guaranteed-income-estimator',
    description: 'Guaranteed Income Estimator',
    productionOrigin: 'https://guaranteed-income-estimator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--guaranteed-income-estimator.netlify.app',
    developOrigin: 'https://develop--guaranteed-income-estimator.netlify.app',
  },
  {
    title: 'Adjustable Income Calculator',
    path: 'adjustable-income-calculator',
    description: 'Adjustable Income Calculator',
    productionOrigin: 'https://adjustable-income-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--adjustable-income-calculator.netlify.app',
    developOrigin: 'https://develop--adjustable-income-calculator.netlify.app',
  },
  {
    title: 'Leave Pot Untouched',
    path: 'leave-pot-untouched',
    description: 'Leave Pot Untouched',
    productionOrigin: 'https://leave-pot-untouched.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--leave-pot-untouched.netlify.app',
    developOrigin: 'https://develop--leave-pot-untouched.netlify.app',
  },
  {
    title: 'Take Whole Pot',
    path: 'take-whole-pot',
    description: 'Take Whole Pot',
    productionOrigin: 'https://take-whole-pot.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--take-whole-pot.netlify.app',
    developOrigin: 'https://develop--take-whole-pot.netlify.app',
  },
  {
    title: 'Mortgage Affordability Calculator',
    path: 'annual-income',
    description: 'Mortgage Affordability Calculator',
    productionOrigin:
      'https://mortgage-affordability-calculator.moneyhelper.org.uk',
    stagingOrigin:
      'https://staging--mortgage-affordability-calculator.netlify.app',
    developOrigin:
      'https://develop--mortgage-affordability-calculator.netlify.app',
  },
  {
    title: 'Salary Calculator',
    path: '',
    description: 'Salary Calculator',
    productionOrigin: 'https://salary-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--maps-salary-calculator.netlify.app',
    developOrigin: 'https://develop--maps-salary-calculator.netlify.app',
  },
];

export const rubyTools = [
  {
    title: 'Pension Calculator',
    path: 'pension-calculator',
    description: '',
    details: {
      en: {
        url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
        embedCode: `<div>
        <noscript><p>You have javascript turned off. Please turn javascript on to see the tools in action.</p></noscript>
        <p>
        <a id="pensions_calculator" class="mas-widget" target="_blank" lang="en" 
        href="https://partner-tools.moneyadviceservice.org.uk/en/tools/pension-calculator" data-width="100%">Pensions Calculator</a>
        </p>
        </div>
        <script class='application_scripts' src="https://partner-tools.moneyadviceservice.org.uk/a/syndication/tools.js"></script>`,
      },
      cy: {
        url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pension-calculator',
        embedCode: `<div>
        <noscript><p>Mae gennych javascript wedi ei droi i ffwrdd. Rhowch javascript ymlaen i weld y teclynnau ar waith.</p></noscript>
        <p>
        <a id="pensions_calculator" class="mas-widget" target="_blank" lang="cy" 
        href="https://partner-tools.moneyadviceservice.org.uk/cy/tools/cyfrifiannell-pensiwn" data-width="100%">Cyfrifiannell pensiwn</a>
        </p>
        </div>
        <script class='application_scripts' src="https://partner-tools.moneyadviceservice.org.uk/a/syndication/tools.js"></script>`,
      },
    },
  },

  {
    title: 'Workplace Pension Contribution Calculator',
    path: 'workplace-pension-contribution-calculator',
    description: '',
    details: {
      en: {
        url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/workplace-pension-calculator',
        embedCode: `<div>
        <noscript><p>You have javascript turned off. Please turn javascript on to see the tools in action.</p></noscript>
        <p>
        <a id="wpcc" class="mas-widget" target="_blank" lang="en"
        href="https://partner-tools.moneyadviceservice.org.uk/en/tools/workplace-pension-contribution-calculator" 
        data-width="100%">Workplace Pension Contribution Calculator</a>
        </p>
        </div>
        <script class='application_scripts' src="https://partner-tools.moneyadviceservice.org.uk/a/syndication/tools.js"></script>`,
      },
      cy: {
        url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment/workplace-pension-calculator',
        embedCode: `<div>
        <noscript><p>Mae gennych javascript wedi ei droi i ffwrdd. Rhowch javascript ymlaen i weld y teclynnau ar waith.</p></noscript>
        <p>
        <a id="wpcc" class="mas-widget" target="_blank" lang="cy"
        href="https://partner-tools.moneyadviceservice.org.uk/cy/tools/cyfrifiannell-cyfraniadau-pensiwn-gweithle" 
        data-width="100%">Cyfrifiannell cyfraniadau pensiwn gweithle</a>
        </p>
        </div>
        <script class=‘application_scripts' src="https://partner-tools.moneyadviceservice.org.uk/a/syndication/tools.js"></script>`,
      },
    },
  },
];

export const tools: ToolsIndexType[] = [...monoRepoTools, ...rubyTools];
