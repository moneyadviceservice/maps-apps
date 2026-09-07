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
  embedV2?: boolean;
};

export const tools = [
  {
    title: 'Pension Type',
    name: 'pension-type/question-1',
    description: 'Pension Type',
    embedV2: true,
  },
  {
    title: 'Workplace Pension Contribution Calculator',
    name: 'workplace-pension-calculator',
    description: 'Workplace pension contribution calculator',
    embedV2: true,
  },
] as ToolsIndexType[];
