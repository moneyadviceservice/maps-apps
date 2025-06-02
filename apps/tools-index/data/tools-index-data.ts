export type ToolEmbedType = {
  url?: string;
  embedCode?: string;
};

export type ToolsIndexType = {
  title: string;
  name: string;
  description: string;
  productionOrigin?: string;
  stagingOrigin?: string;
  details?: { en: ToolEmbedType; cy: ToolEmbedType };
};
export const githubTools = [
  {
    title: 'Stamp Duty Land Tax Calculator',
    name: 'sdlt-calculator',
    description:
      'The SDLT calculator for buying a property in England and Northern Ireland.',
    productionOrigin: 'https://tools.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools-git.netlify.app',
  },
  {
    title: 'Land Transaction Tax Calculator',
    name: 'ltt-calculator',
    description: 'The LTT calculator for buying a property in Wales.',
    productionOrigin: 'https://tools.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools-git.netlify.app',
  },
  {
    title: 'Land and Buildings Transaction Tax Calculator',
    name: 'lbtt-calculator',
    description: 'The LBTT calculator for buying a property in Scotland.',
    productionOrigin: 'https://tools.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools-git.netlify.app',
  },
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
    title: 'Mortgage Calculator',
    name: 'mortgage-calculator',
    description: 'Mortgage Calculator',
    productionOrigin: 'https://tools.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools-git.netlify.app',
    path: 'mortgage-calculator',
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
    title: 'Guaranteed Income Estimator',
    name: 'guaranteed-income-estimator',
    description: 'The Guaranteed Income Estimator Calculator',
    productionOrigin: 'https://tool.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools.netlify.app',
  },
  {
    title: 'Cash In Chunks Calculator',
    name: 'cic-calculator',
    description: 'Cash In Chunks Calculator',
    productionOrigin: 'https://tool.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools.netlify.app',
  },
  {
    title: 'Take Whole Pot',
    name: 'take-whole-pot-calculator',
    description: 'Take Whole Pot',
    productionOrigin: 'https://tool.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools.netlify.app',
  },
  {
    title: 'Leave Pot Untouched',
    name: 'leave-pot-untouched',
    description: 'Leave Pot Untouched',
    productionOrigin: 'https://tool.moneyhelper.org.uk',
    stagingOrigin: 'https://staging--moneyhelper-tools.netlify.app',
  },
  {
    title: 'Adjustable Income Estimator',
    name: 'adjustable-income-estimator',
    description: 'Adjustable Income Estimator',
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
];

export const rubyTools = [
  {
    title: 'Mortgage Affordability Calculator',
    name: 'mortgage-affordability-calculator',
    description: '',
    details: {
      en: {
        url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-affordability-calculator',
        embedCode: `<div>
        <noscript><p>You have javascript turned off. Please turn javascript on to see the tools in action.</p></noscript>
        <p>
        <a id="mortgage_affordability_calculator" class="mas-widget" target="_blank" lang="en"
        href="https://partner-tools.moneyadviceservice.org.uk/en/tools/house-buying/mortgage-affordability-calculator" 
        data-width="100%">Mortgage affordability calculator</a>
        </p>
        </div>
        <script class='application_scripts' src="https://partner-tools.moneyadviceservice.org.uk/a/syndication/tools.js"></script>`,
      },
      cy: {
        url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/mortgage-affordability-calculator',
        embedCode: `<div>
        <noscript><p>Mae gennych javascript wedi ei droi i ffwrdd. Rhowch javascript ymlaen i weld y teclynnau ar waith.</p></noscript>
        <p>
        <a id="mortgage_affordability_calculator" class="mas-widget" target="_blank" lang="cy"
        href="https://partner-tools.moneyadviceservice.org.uk/cy/tools/prynu-ty/cyfrifiannell-fforddiadwyedd-morgais" 
        data-width="100%">Cyfrifiannell fforddiadwyedd morgais</a>
        </p>
        </div>
        <script class='application_scripts' src="https://partner-tools.moneyadviceservice.org.uk/a/syndication/tools.js"></script>`,
      },
    },
  },

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
