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
] as ToolsIndexType[];
