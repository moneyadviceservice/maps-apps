export type ToolType = {
  url?: string;
  embedCode?: string;
};

export type ToolsIndexType = {
  title: string;
  name: string;
  description: string;
  disabled?: boolean;
  details?: { en: ToolType; cy: ToolType };
};

export const tools = [
  {
    title: 'Pension Type',
    name: 'pension-type',
    description: 'Pension Type',
    embedV2: true,
  },
  {
    title: 'Workplace Pension Contribution Calculator',
    name: 'workplace-pension-calculator',
    description: 'Workplace pension contribution calculator',
    embedV2: true,
  },
  {
    title: 'Cash In Chunks Calculator',
    name: 'cic-calculator',
    description: 'Cash In Chunks Calculator',
  },
  {
    title: 'Take Whole Pot',
    name: 'take-whole-pot-calculator',
    description: 'Take Whole Pot',
  },
  {
    title: 'Guaranteed Retirement Income',
    name: 'guaranteed-income-estimator',
    description: 'Guaranteed Income Estimator',
  },
  {
    title: 'Leave Pot Untouched',
    name: 'leave-pot-untouched',
    description: 'Leave Pot Untouched',
  },
  {
    title: 'Adjustable Income Estimator',
    name: 'adjustable-income-estimator',
    description: 'Adjustable Income Estimator',
  },
  {
    title: 'Savings Calculator',
    name: 'savings-calculator',
    description: 'Savings Calculator',
  },
  {
    title: 'Baby Costs Calculator',
    name: 'baby-cost-calculator',
    description: 'Baby Costs Calculator',
  },
  {
    title: 'Baby Money Timeline',
    name: 'baby-money-timeline',
    description: 'Baby Money Timeline',
  },
  {
    title: 'Money Midlife MOT',
    name: 'mid-life-mot/question-1',
    description: 'Money Midlife MOT',
  },
  {
    title: 'Debt Advice Locator',
    name: 'debt-advice-locator',
    description: 'Debt Advice Locator',
    details: {
      en: {
        url: 'https://debt-advice-locator.moneyhelper.org.uk/en/',
        embedCode: `<script src="https://debt-advice-locator.moneyhelper.org.uk/api/embed"></script>
      <div class="mas-iframe-container" style="width: 100%; overflow: hidden; padding-top: 66.66%; position: relative;">
        <iframe
          class="mas-iframe"
          style="width: 100%; height: 100%; left: 0; position: absolute; top: 0; border: 0;"
          src="https://debt-advice-locator.moneyhelper.org.uk/en/question-1?isEmbedded=true"
          loading="lazy"
        ></iframe>
      </div>`,
      },
      cy: {
        url: 'https://debt-advice-locator.moneyhelper.org.uk/cy',
        embedCode: `<script src="https://debt-advice-locator.moneyhelper.org.uk/api/embed"></script>
      <div class="mas-iframe-container" style="width: 100%; overflow: hidden; padding-top: 66.66%; position: relative;">
        <iframe
          class="mas-iframe"
          style="width: 100%; height: 100%; left: 0; position: absolute; top: 0; border: 0;"
          src="https://debt-advice-locator.moneyhelper.org.uk/cy/question-1?isEmbedded=true"
          loading="lazy"
        ></iframe>
      </div>`,
      },
    },
  },
] as ToolsIndexType[];
