export type ToolEmbedType = {
  url?: string;
  embedCode?: string;
};

export type ToolsIndexType = {
  title: string;
  name: string;
  description: string;
  live?: boolean; // if false, the tool will not be shown on production tools-index
  productionOrigin?: string;
  stagingOrigin?: string;
  details?: { en: ToolEmbedType; cy: ToolEmbedType };
};
export const githubTools = [
  {
    title: 'Credit rejection',
    name: 'credit-rejection/question-1',
    description: "Find out why you're struggling to get credit.",
    productionOrigin: 'https://tools.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools-git.netlify.app',
  },
  {
    title: 'Money Midlife MOT',
    name: 'mid-life-mot/question-1',
    description: 'Money Midlife MOT',
    productionOrigin: 'https://tools.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools-git.netlify.app',
  },
  {
    title: 'Compare Accounts',
    name: 'use-our-compare-bank-account-fees-and-charges-tool',
    description: 'The account comparison tool.',
    productionOrigin: 'https://tools.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools-git.netlify.app',
  },
  {
    title: 'Credit Options',
    name: 'credit-options/question-1',
    description: 'Credit Options.',
    productionOrigin: 'https://tools.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools-git.netlify.app',
    path: 'credit-options/question-1',
  },
  {
    title: 'Budget planner',
    name: 'budget-planner',
    description: 'Budget planner.',
    productionOrigin: 'https://tools.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools-git.netlify.app',
  },
];

export const monoRepoTools = [
  {
    title: 'Stamp Duty Land Tax Calculator',
    name: 'sdlt',
    description:
      'The SDLT calculator for buying a property in England and Northern Ireland.',
    productionOrigin: 'https://stamp-duty-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--stamp-duty-calc.netlify.app',
  },
  {
    title: 'Land Transaction Tax Calculator',
    name: 'ltt',
    description: 'The LTT calculator for buying a property in Wales.',
    productionOrigin: 'https://stamp-duty-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--stamp-duty-calc.netlify.app',
  },
  {
    title: 'Land and Buildings Transaction Tax Calculator',
    name: 'lbtt',
    description: 'The LBTT calculator for buying a property in Scotland.',
    productionOrigin: 'https://stamp-duty-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--stamp-duty-calc.netlify.app',
  },
  {
    title: 'Mortgage Calculator',
    name: '',
    description: 'Mortgage Calculator',
    productionOrigin: 'https://mortgage-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--mh-mortgage-calculator.netlify.app',
  },
  {
    title: 'Debt Advice Locator',
    name: 'question-1',
    description: 'The Debt Advice Locator Calculator',
    productionOrigin: 'https://debt-advice-locator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--debt-advice-locator.netlify.app',
  },
  {
    title: 'Savings Calculator',
    name: 'savings-calculator',
    description: 'Savings Calculator',
    productionOrigin: 'https://tool.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools.netlify.app',
  },
  {
    title: 'Baby Cost Calculator',
    name: 'baby-cost-calculator',
    description: 'Baby Cost Calculator',
    productionOrigin: 'https://tool.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools.netlify.app',
  },
  {
    title: 'Baby Money Timeline',
    name: 'baby-money-timeline',
    description: '',
    productionOrigin: 'https://tool.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools.netlify.app',
  },
  {
    title: 'Redundancy Pay Calculator',
    name: 'question-1',
    description: 'Redundancy Pay Calculator',
    productionOrigin: 'https://redundancy-pay-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--redundancy-pay-calculator.netlify.app',
  },
  {
    title: 'Pension Type Tool',
    name: 'pension-type/question-1',
    description: 'Pension Type Tool',
    productionOrigin: 'https://tool.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools.netlify.app',
  },
  {
    title: 'Cash In Chunks',
    name: 'cash-in-chunks',
    description: 'Cash In Chunks',
    productionOrigin: 'https://cash-in-chunks.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--cash-in-chunks.netlify.app',
  },
  {
    title: 'Guaranteed Income Estimator',
    name: 'guaranteed-income-estimator',
    description: 'Guaranteed Income Estimator',
    productionOrigin: 'https://guaranteed-income-estimator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--guaranteed-income-estimator.netlify.app',
  },
  {
    title: 'Adjustable Income Calculator',
    name: 'adjustable-income-calculator',
    description: 'Adjustable Income Calculator',
    productionOrigin: 'https://adjustable-income-calculator.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--adjustable-income-calculator.netlify.app',
  },
  {
    title: 'Leave Pot Untouched',
    name: 'leave-pot-untouched',
    description: 'Leave Pot Untouched',
    productionOrigin: 'https://leave-pot-untouched.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--leave-pot-untouched.netlify.app',
  },
  {
    title: 'Take Whole Pot',
    name: 'take-whole-pot',
    description: 'Take Whole Pot',
    productionOrigin: 'https://take-whole-pot.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--take-whole-pot.netlify.app',
  },
  {
    title: 'Mortgage Affordability Calculator',
    name: 'annual-income',
    description: 'Mortgage Affordability Calculator',
    productionOrigin:
      'https://mortgage-affordability-calculator.moneyhelper.org.uk',
    stagingOrigin:
      'https://staging--mortgage-affordability-calculator.netlify.app',
  },
];

export const rubyTools = [
  {
    title: 'Pension Calculator',
    name: 'pension-calculator',
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
    name: 'workplace-pension-contribution-calculator',
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

export const tools: ToolsIndexType[] = [
  ...githubTools,
  ...monoRepoTools,
  ...rubyTools,
];
